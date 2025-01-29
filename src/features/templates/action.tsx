"use server";
import { db } from "@/_server/db";
import { templateFormSchema, TemplateFormSchema } from "./schema";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { Expression, SqlBool } from "kysely";

export const getTemplates = async (search?: string) => {
  const val = await db
    .selectFrom("templates")
    .where((eb) => {
      const filters: Expression<SqlBool>[] = [];
      if (search) {
        filters.push(eb("title", "ilike", `%${search}%`));
      }
      return eb.and(filters);
    })
    .selectAll()
    .execute();
  return val;
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
