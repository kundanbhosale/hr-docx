import { z } from "zod";

export const createCheckoutSchema = z
  .object({
    plan_id: z.string().min(1).optional(),
    offer_id: z.string().optional(),
    success: z.coerce.boolean().default(false), // Coerce values to boolean

    sub_id: z.string().optional(),
    cb_url: z.string().optional(),
  })
  .refine((data) => data.plan_id !== undefined || data.sub_id !== undefined, {
    message: "At least plan_id or sub_id field is required",
  });

export const getSubscriptionSchema = z.object({ id: z.string() });
export type GetSubscriptionSchema = z.infer<typeof getSubscriptionSchema>;

export type CreateCheckoutSchema = z.infer<typeof createCheckoutSchema>;
