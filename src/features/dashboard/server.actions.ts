"use server";

import { headers } from "next/headers";
import { auth } from "../auth/server";
import { db } from "@/_server/db";
import { redirect } from "next/navigation";
import { razorpay } from "../payments/server.init";
import { appConfig } from "@/app.config";
import { format } from "date-fns";

export const getDashboardData = async () => {
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
  let plan: (typeof appConfig.plans)[0] | null = null;
  let sub: Subscriptions.RazorpaySubscription | null = null;
  if (org.metadata?.subscription?.id) {
    sub = (await razorpay.subscriptions.fetch(
      org.metadata?.subscription?.id
    )) as Subscriptions.RazorpaySubscription;
    if (sub) {
      plan = appConfig.plans.find(
        (p) => p.id === sub?.plan_id
      ) as (typeof appConfig.plans)[0];
    }
  }

  return {
    documents,
    counts,
    sub: {
      plan: plan?.name,
      total: plan?.credits.download,
      credits: org?.metadata?.credits,
      period: `${
        sub?.current_start && format(sub.current_start * 1000, "PP")
      } - ${sub?.current_end && format(sub.current_end * 1000, "PP")}`,
    },
  };
};
