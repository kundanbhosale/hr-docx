"use server";
import { db } from "@/_server/db";
import { action } from "@/lib/error";
import {
  allCategoriesSchema,
  AllCategoriesSchema,
  singleCategorySchema,
  SingleCategorySchema,
} from "./schema";
import { Expression, SqlBool } from "kysely";

export const getAllPublicCategories = action(
  async (params: AllCategoriesSchema) => {
    const { search } = allCategoriesSchema.parse(params);

    const data = await db
      .selectFrom("groups")
      .where("is_public", "=", true)
      .where((eb) => {
        const filters: Expression<SqlBool>[] = [];

        if (search) {
          const searchConditions = [
            eb("groups.title", "ilike", `%${search!}%`),
          ];

          filters.push(eb.or(searchConditions));
        }
        return eb.and(filters);
      })
      .select(["color", "id", "slug", "title", "thumbnail"])
      .execute();
    return data;
  }
);

export const getSingleCategory = action(async (props: SingleCategorySchema) => {
  const { slug } = singleCategorySchema.parse(props);
  const data = await db
    .selectFrom("groups")
    .where("slug", "=", slug)
    .select(["color", "id", "slug", "title", "thumbnail"])
    .executeTakeFirstOrThrow();
  return data;
});

export const geCategoryComboBox = action(
  async (params: AllCategoriesSchema) => {
    const { search } = allCategoriesSchema.parse(params);
    const data = await db
      .selectFrom("groups")
      .where((eb) => {
        const filters: Expression<SqlBool>[] = [];

        if (search) {
          const searchConditions = [
            eb("groups.title", "ilike", `%${search!}%`),
          ];

          filters.push(eb.or(searchConditions));
        }
        return eb.and(filters);
      })
      .select([
        "groups.id as value",
        "groups.title as label",
        "groups.thumbnail as image",
      ])
      .limit(10)
      .execute();

    data.forEach((d) => {
      if (!d.image) {
        d.image = `https://api.dicebear.com/9.x/initials/svg?seed=${d.label.replaceAll(
          " ",
          "_"
        )}`;
      }
    });
    return data;
  }
);
