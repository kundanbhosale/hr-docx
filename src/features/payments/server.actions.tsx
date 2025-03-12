"use server";

import { db } from "@/_server/db";
import {
  createCheckoutSchema,
  CreateCheckoutSchema,
  getSubscriptionSchema,
  GetSubscriptionSchema,
} from "./schema";
import { hasPermission } from "@/features/auth/server/actions";
import { razorpay } from "@/features/payments/server.init";
import { action } from "@/lib/error";
import { redirect, RedirectType } from "next/navigation";
import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { appConfig } from "@/app.config";

export const createCheckout = action(async (data: CreateCheckoutSchema) => {
  const { plan_id, offer_id, sub_id, success, cb_url } =
    createCheckoutSchema.parse(data);
  const session = await hasPermission({
    permission: {
      payments: ["create"],
    },
  });

  let sub: Subscriptions.RazorpaySubscription | null = null;

  if (success) {
    return redirect(
      cb_url || "/account?view=subscription",
      RedirectType.replace
    );
  }

  if (sub_id) {
    sub = await razorpay.subscriptions.fetch(sub_id).catch((err) => {
      throw Error("Failed to find subscription", err);
    });

    if (!["created", "authenticated"].includes(sub.status)) {
      throw Error("Invalid subscription");
    }
  } else {
    if (plan_id) {
      sub = await razorpay.subscriptions
        .create({
          plan_id,
          total_count: 360,
          offer_id: offer_id || undefined,
          notes: {
            user: session.user.id,
            org_id: session.session.activeOrganizationId!,
          },
        })
        .catch((err) => {
          console.log(err.message);
          throw Error("Failed to create subscription", err);
        });
      redirect("?sub_id=" + sub.id, RedirectType.replace);
    }
  }

  return { sub, session: session.session, user: session.user };
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
  const sub = await razorpay.subscriptions.fetch(org.metadata.subscription.id);
  const plan = appConfig.plans.find((p) => p.id === sub.plan_id);
  return {
    plan,
    sub: {
      id: sub.id,
      current_start: Number(sub.current_start) * 1000,
      current_end: Number(sub.current_end) * 1000,
    },
  };
});
