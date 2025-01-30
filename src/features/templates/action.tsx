"use server";
import { db } from "@/_server/db";
import { templateFormSchema, TemplateFormSchema } from "./schema";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { Expression, sql, SqlBool } from "kysely";
//
export const getTemplates = async (search?: string) => {
  let query = db
    .selectFrom("templates")
    .select([
      "content",
      "created_at",
      "id",
      "title",
      "schema",
      "slug",
      "deleted_at",
    ]);

  if (search) {
    // If search term exists, add similarity search
    query = query
      .select((eb) => [sql<number>`similarity(title, ${search})`.as("score")])
      .where("deleted_at", "is", null)
      .where((eb) => sql<boolean>`similarity(title, ${search}) > 0.1`)
      .orderBy("score", "desc");
  } else {
    // If no search, just get recent files
    query = query
      .where("deleted_at", "is", null)
      .orderBy("created_at", "desc")
      .limit(50);
  }

  const results = await query.execute();

  console.log(results);

  return results;
};

export const getSingleTemplate = async ({
  id,
  slug,
}: {
  slug?: string;
  id?: string;
}) => {
  const val = await db
    .selectFrom("templates")
    .where((eb) => {
      const filters: Expression<SqlBool>[] = [];
      if (id) {
        filters.push(eb("id", "=", id));
      }
      if (slug) {
        filters.push(eb("slug", "=", slug));
      }
      return eb.and(filters);
    })
    .selectAll()
    .executeTakeFirst();
  return val;
};

export const createTemplate = async (data: TemplateFormSchema) => {
  const id = randomUUID();

  const parsed = templateFormSchema.parse(data);
  await db
    .insertInto("templates")
    .values({ id, ...parsed })
    .execute();
  return redirect(`/documents/generate/${id}`);
};

export const updateTemplate = async (id: string, data: TemplateFormSchema) => {
  const parsed = templateFormSchema.parse(data);
  await db.updateTable("templates").set(parsed).where("id", "=", id).execute();
  return true;
};

export const deleteTemplate = async (id: string) => {
  await db.deleteFrom("templates").where("id", "=", id).execute();
  return true;
};
