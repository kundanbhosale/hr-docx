import { slugValidate } from "@/lib/schema";
import { z } from "zod";

export const allCategoriesSchema = z.object({
  search: z.string().optional(),
});

export const singleCategorySchema = z.object({
  slug: z.string(),
});

export const createCategorySchema = z.object({
  title: z.string(),
  slug: slugValidate,
  color: z.string().length(7).regex(/^#/),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  ...createCategorySchema.shape,
});

export const deleteCategorySchema = z.object({
  id: z.string().uuid(),
});
export type AllCategoriesSchema = z.infer<typeof allCategoriesSchema>;

export type SingleCategorySchema = z.infer<typeof singleCategorySchema>;

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>;
