"use server";

import { db } from "@/_server/db";
import { createCheckoutSchema, CreateCheckoutSchema } from "./schema";
import { hasPermission } from "@/features/auth/server/actions";
import { razorpay } from "@/features/payments/server.init";
import { action, ClientError } from "@/lib/error";
import { redirect, RedirectType } from "next/navigation";
import { appConfig } from "@/app.config";
import {
  manageOrderPaid,
  manageSubscriptionStatusChange,
} from "@/app/api/webhook/rzp/route";
import { revalidatePath } from "next/cache";

export async function longPolling(cb: () => Promise<boolean>) {
  let attempts = 0;
  const maxAttempts = 20;
  const interval = 3000; // 3 seconds

  while (attempts < maxAttempts) {
    console.log("Long polling attempt - " + attempts);
    const success = await cb();
    if (success) {
      return { success };
    }
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return { success: false, message: "Max retries reached" };
}

export const createCheckout = action(async (data: CreateCheckoutSchema) => {
  const { plan_id, offer_id, order_id, sub_id, success, cb_url } =
    createCheckoutSchema.parse(data);
  const params = new URLSearchParams();
  if (cb_url) {
    params.set("cb_url", cb_url);
  }
  const session = await hasPermission({
    permission: {
      payments: ["create"],
    },
  });

  let sub: Subscriptions.RazorpaySubscription | null = null;
  const getOrg = async () =>
    await db
      .selectFrom("orgs.list")
      .where("id", "=", session.session.activeOrganizationId!)
      .selectAll()
      .executeTakeFirstOrThrow();

  if (success) {
    // const isTrue = async () =>
    //   await getOrg().then((t) => t.metadata.subscription?.plan_id === plan_id);
    // return await longPolling(isTrue).then(() => {
    //   return redirect(
    //     cb_url || "/account?view=subscription",
    //     RedirectType.replace
    //   );
    // });

    const checkandPoll = async () => {
      if (order_id) {
        const order = (await razorpay.orders.fetch(
          order_id
        )) as Orders.RazorpayOrder;

        if (order.status !== "paid") return false;
        await manageOrderPaid(order);
        return true;
      }

      if (sub_id) {
        const sub = (await razorpay.subscriptions.fetch(
          sub_id
        )) as Subscriptions.RazorpaySubscription;
        if (sub.status !== "active") return false;

        await manageSubscriptionStatusChange("", sub);
        return true;
      }
      return true;
    };
    return await longPolling(checkandPoll).then(() => {
      return redirect(
        cb_url || "/account?view=subscription",
        RedirectType.replace
      );
    });
    // return redirect(
    //   cb_url || "/account?view=subscription",
    //   RedirectType.replace
    // );
  }

  const result: {
    sub: Subscriptions.RazorpaySubscription | null;
    order: Orders.RazorpayOrder | null;
    plan: (typeof appConfig.plans)[0] | null;
  } & typeof session = { sub: null, order: null, plan: null, ...session };

  const org = await getOrg();

  if (org.metadata.subscription?.status === "active") {
    throw new ClientError("Already subscribed");
  }

  result.plan = appConfig.plans.find((p) => p.id === plan_id) || null;

  params.set("plan_id", result.plan?.id);

  if (!result.plan) throw new ClientError("Plan not found");

  if (order_id) {
    result.order = await razorpay.orders.fetch(order_id).catch((e) => {
      throw new ClientError("Failed to find order");
    });

    return result;
  }

  if (plan_id === "ppd") {
    result.order = await razorpay.orders.create({
      amount: result.plan.prices.inr * 100,
      currency: "INR",
      offer_id: offer_id || undefined,
      notes: {
        plan_name: result.plan.name,
        plan_id: result.plan.id,
        user: session.user.id,
        org_id: session.session.activeOrganizationId!,
      },
    });
    params.set("order_id", result.order?.id);

    redirect("?" + params.toString(), RedirectType.replace);
  }

  if (sub_id) {
    sub = await razorpay.subscriptions.fetch(sub_id).catch((err) => {
      throw new ClientError("Failed to find subscription", err);
    });

    if (!["created", "authenticated"].includes(sub.status)) {
      throw new ClientError("Invalid subscription");
    }
  } else {
    if (plan_id) {
      sub = await razorpay.subscriptions
        .create({
          plan_id,
          total_count: 360,
          offer_id: offer_id || undefined,
          notes: {
            plan_id: result.plan.id,
            plan_name: result.plan.name,
            user: session.user.id,
            org_id: session.session.activeOrganizationId!,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new ClientError("Failed to create subscription", err);
        });
      params.set("sub_id", sub?.id);

      redirect("?" + params.toString(), RedirectType.replace);
    }
  }

  result.sub = sub;

  return result;
});

export const getSubscriptionAndPayments = action(async () => {
  const session = await hasPermission({
    permission: {
      subscription: ["read"],
    },
  });

  const org = await db
    .selectFrom("orgs.list")
    .where("orgs.list.id", "=", session.session.activeOrganizationId!)
    .selectAll()
    .executeTakeFirstOrThrow();

  const sub = org.metadata.subscription?.id
    ? await razorpay.subscriptions.fetch(org.metadata.subscription.id)
    : null;
  const plan = appConfig.plans.find(
    (p) => p.id === org.metadata.subscription?.plan_id
  );

  const orders = await db
    .selectFrom("orgs.orders")
    .selectAll()
    .where("org", "=", session.session.activeOrganizationId!)
    .orderBy("created_at desc")
    .execute()
    .then((r) =>
      r.map((t) => {
        const order = t.metadata as unknown as Orders.RazorpayOrder;
        return {
          id: t.id,
          status: order.status,
          amount: order.amount,
          created: order.created_at,
        };
      })
    );

  return {
    plan,
    orders,
    sub: sub
      ? {
          id: sub.id,
          current_start: Number(sub.current_start) * 1000,
          current_end: Number(sub.current_end) * 1000,
        }
      : null,
  };
});

export const cancelSubscription = async () => {
  const session = await hasPermission({
    permission: {
      subscription: ["delete"],
    },
  });

  const org = await db
    .selectFrom("orgs.list")
    .where("id", "=", session.session.activeOrganizationId!)
    .selectAll()
    .executeTakeFirstOrThrow();

  if (!org.metadata?.subscription?.id) {
    throw new ClientError("No active subscription");
  }

  await razorpay.subscriptions
    .cancel(org.metadata?.subscription?.id, false)
    .catch((c) => {
      console.log(c);
      throw new ClientError("Failed to cancel subscription");
    });

  revalidatePath("/account", "layout");

  return true;
};
