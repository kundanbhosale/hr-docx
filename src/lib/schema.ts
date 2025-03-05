import slugify from "slugify";
import { z } from "zod";

export const colorValidate = z.string().length(7).regex(/^#/);
export const slugValidate = z
  .string()
  .min(1)
  .transform((v) => slugify(v, { lower: true, trim: true }));
