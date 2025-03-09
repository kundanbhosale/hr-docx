"use server";

import { headers } from "next/headers";
import { auth } from "../auth/server";
import { db } from "@/_server/db";

export const getDashboardData = async () => {
  const head = await headers();
  const sess = await auth.api.getSession({ headers: head });

  const [documents, counts] = await Promise.all([
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
      .executeTakeFirst(),
  ]);

  return { documents, counts };
};
