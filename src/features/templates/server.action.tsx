"use server";
import { db } from "@/_server/db";
import {
  getTemplatesSchema,
  GetTemplatesSchema,
  SingleTemplateSchema,
  singleTemplateSchema,
  templateFormSchema,
  TemplateFormSchema,
} from "./schema";
import { randomUUID } from "crypto";
import { Expression, sql, SqlBool } from "kysely";
import { action } from "@/lib/error";
import { hasPermission } from "../auth/server/actions";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";
import { Groups, Templates } from "@/_server/db/types";

export const getPublicTemplates = action(async (props: { search: string }) => {
  const { search } = z.object({ search: z.string() }).parse(props);

  let query = db
    .selectFrom("templates")
    .where("templates.deleted_at", "is", null)
    // .where("templates.is_public", "is", true)
    .leftJoin("groups", "groups.id", "templates.group")
    .select((eb) => [
      "groups.id",
      sql<Array<Templates>>`json_agg(to_jsonb(templates) - 'group')`.as(
        "templates"
      ), // Aggregate all template data into a JSON array
      sql<Groups>`
      json_build_object(
        'id', groups.id,
        'title', groups.title,
        'slug', groups.slug,
        'color', groups.color
      )
    `.as("group"),
    ])
    .groupBy(["groups.id"]);

  if (search) {
    query = query
      // .select((eb) => [
      //   sql<number>`similarity(templates.title, ${eb.val(search)})`.as("score"),
      // ])
      .where(
        (eb) =>
          sql<boolean>`similarity(templates.title, ${eb.val(search)}) > 0.1`
      );
    // .where("groups.title", "ilike", `%${search}%`);
    // .orderBy(
    //   (eb) =>
    //     sql<number>`COALESCE(similarity(templates.title, ${eb.val(
    //       search
    //     )}), 0)`,
    //   "desc"
    // );
  }

  return await query.execute();
});

export const getTemplates = action(async (props: GetTemplatesSchema) => {
  const { search, group } = getTemplatesSchema.parse(props);

  let query = db
    .selectFrom("templates")
    .select([
      "templates.content",
      "templates.created_at",
      "templates.id",
      "templates.title",
      "schema",
      "templates.slug",
      "templates.deleted_at",
      "group",
    ])
    .where("templates.deleted_at", "is", null); // Ensure deleted_at is always checked

  if (search) {
    query = query
      .select((eb) => [sql<number>`similarity(title, ${search})`.as("score")])
      .where((eb) => sql<boolean>`similarity(title, ${search}) > 0.1`)
      .orderBy("score", "desc");
  }

  if (group) {
    query = query
      .leftJoin("groups", "groups.id", "templates.group") // Ensure correct table reference
      .where("groups.slug", "=", group);
  }

  if (!search && !group) {
    query = query.orderBy("templates.created_at", "desc").limit(50);
  }

  return await query.execute();
});

export const getSingleTemplate = action(async (props: SingleTemplateSchema) => {
  const { id, slug } = singleTemplateSchema.parse(props);

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
});

export const createTemplate = action(async (data: TemplateFormSchema) => {
  const { user } = await hasPermission(undefined, "internal");
  const id = randomUUID();
  const parsed = templateFormSchema.parse(data);
  await db
    .insertInto("templates")
    .values({ id, ...parsed, created_by: user.id })
    .execute();
  redirect(id, RedirectType.replace);
  return { id };
});

export const updateTemplate = action(
  async (id: string, data: TemplateFormSchema) => {
    await hasPermission(undefined, "internal");

    const parsed = templateFormSchema.parse(data);
    await db
      .updateTable("templates")
      .set(parsed)
      .where("id", "=", id)
      .execute();
    return true;
  }
);

export const deleteTemplate = action(async (id: string) => {
  await hasPermission(undefined, "internal");
  await db.deleteFrom("templates").where("id", "=", id).execute();
  // revalidatePath("/documents/generate", "page");
  return true;
});
