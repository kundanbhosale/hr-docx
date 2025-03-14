"use server";

import { headers } from "next/headers";
import { auth } from "../auth/server";
import { db } from "@/_server/db";
import { redirect } from "next/navigation";
import { razorpay } from "../payments/server.init";
import { appConfig } from "@/app.config";
import { format } from "date-fns";
import { action } from "@/lib/error";

export const getDashboardData = action(async () => {
  const head = await headers();
  const sess = await auth.api.getSession({ headers: head });

  if (!sess?.session.activeOrganizationId) {
    return redirect("/org");
  }

  const [documents, counts, org] = await Promise.all([
    await db
      .selectFrom("documents")
      .select(["id", "title", "thumbnail", "updated_at"])
      .where("org", "=", sess!.session!.activeOrganizationId!)
      .limit(20)
      .orderBy("documents.updated_at desc")
      .execute(),
    await db
      .selectFrom("documents")
      .where("org", "=", sess!.session!.activeOrganizationId!)
      .select([
        (eb) => eb.fn.count<number>("id").as("total"),
        (eb) => eb.fn.count<number>("starred").as("favorites"),
        (eb) => eb.fn.sum<number>("downloads").as("total_downloads"),
      ])
      .executeTakeFirstOrThrow(),
    await db
      .selectFrom("orgs.list")
      .where("orgs.list.id", "=", sess.session.activeOrganizationId!)
      .selectAll()
      .executeTakeFirstOrThrow(),
  ]);
  let sub: Subscriptions.RazorpaySubscription | null = null;
  if (org.metadata?.subscription?.id) {
    sub = (await razorpay.subscriptions
      .fetch(org.metadata?.subscription?.id)
      .catch((e) => null)) as Subscriptions.RazorpaySubscription;
  }

  const plan = appConfig.plans.find(
    (p) => p.id === org.metadata?.subscription?.plan_id
  );

  return {
    documents,
    counts,
    sub: {
      plan: org.metadata?.subscription?.plan || "Free",
      plan_id: org.metadata.subscription?.plan_id,
      total: plan?.features?.downloads || 0,
      credits: org?.metadata?.credits || 0,
      period:
        sub?.current_start && sub?.current_end
          ? `${
              sub?.current_start && format(sub.current_start * 1000, "PP")
            } - ${sub?.current_end && format(sub.current_end * 1000, "PP")}`
          : "-",
    },
  };
});
