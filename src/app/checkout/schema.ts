import { z } from "zod";

export const createSubSchema = z.object({
  plan_id: z.string().min(1),
  org_id: z.string().min(1),
  offer_id: z.string().optional(),
});

export type CreateSubscription = z.infer<typeof createSubSchema>;
