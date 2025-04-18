import { z } from "zod";

export const templateTypeSchema = z.enum([
  "text",
  "date",
  "time",
  "email",
  "phone",
]);
export const templateFormSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  group: z.string().uuid().optional(),
  thumbnail: z.string(),
  schema: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
      title: z.string(),
      desc: z.string(),
      type: templateTypeSchema,
    })
  ),
});

// export const getTemplatesSchema = z.object({
//   search: z.string().optional(),
//   limit: z.number().int().min(10).max(50).optional().default(10),
//   group: z.string().optional(),
// });

export const singleTemplateSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
});

export type SingleTemplateSchema = z.infer<typeof singleTemplateSchema>;

// export type GetTemplatesSchema = z.infer<typeof getTemplatesSchema>;

export type TemplateFormSchema = z.infer<typeof templateFormSchema>;
