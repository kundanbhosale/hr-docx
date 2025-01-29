import { z } from "zod";

export const templateFormSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  schema: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
      title: z.string(),
      desc: z.string(),
      type: z.enum(["text"]),
    })
  ),
});

export type TemplateFormSchema = z.infer<typeof templateFormSchema>;
