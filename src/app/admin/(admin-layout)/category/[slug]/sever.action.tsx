"use server";
import { db } from "@/_server/db";
import { hasPermission } from "@/features/auth/server/actions";
import {
  createCategorySchema,
  CreateCategorySchema,
  DeleteCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
  UpdateCategorySchema,
} from "@/features/categories/schema";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { randomUUID } from "node:crypto";

export const createCategory = async (props: CreateCategorySchema) => {
  const { title, slug, color } = createCategorySchema.parse(props);
  const { user } = await hasPermission(undefined, "internal");

  const c = await db
    .insertInto("groups")
    .values({
      id: randomUUID(),
      title,
      slug,
      created_by: user.id,
      color,
      is_public: true,
    })
    .returning("slug")
    .executeTakeFirstOrThrow();

  return redirect(c.slug);
};

export const updateCategory = async (props: UpdateCategorySchema) => {
  const { title, slug, color, id } = updateCategorySchema.parse(props);
  const { user } = await hasPermission(undefined, "internal");

  const c = await db
    .updateTable("groups")
    .set({ title, slug, created_by: user.id, color })
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  return true;
};

export const deleteCategory = async (props: DeleteCategorySchema) => {
  const { id } = deleteCategorySchema.parse(props);
  await hasPermission(undefined, "internal");

  await db.deleteFrom("groups").where("id", "=", id).executeTakeFirstOrThrow();
  revalidatePath("/admin/category", "layout");
  return redirect("/admin/category/un-categorized", RedirectType.replace);
};
