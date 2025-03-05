import { slugValidate } from "@/lib/schema";
import { z } from "zod";

export const allDocumentsSchema = z.object({
  search: z.string().optional(),
});

export const singleDocumentSchema = z.object({
  id: z
    .string()
    .uuid()
    .or(z.enum(["new"])),
});

export const generateDocumentSchema = z.object({
  template: z.string(),
});

export const createDocumentSchema = z.object({
  template: z.string(),
});

export const updateDocumentSchema = z.object({
  id: z.string().uuid(),
  ...createDocumentSchema.shape,
});

export const deleteDocumentSchema = z.object({
  id: z.string().uuid(),
});
export type AllDocumentsSchema = z.infer<typeof allDocumentsSchema>;

export type SingleDocumentSchema = z.infer<typeof singleDocumentSchema>;
export type GenerateDocumentSchema = z.infer<typeof generateDocumentSchema>;

export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentSchema = z.infer<typeof updateDocumentSchema>;
export type DeleteDocumentSchema = z.infer<typeof deleteDocumentSchema>;
