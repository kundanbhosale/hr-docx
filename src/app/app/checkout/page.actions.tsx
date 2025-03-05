"use server";

import { createSubSchema, CreateSubscription } from "./schema";
import { hasPermission } from "@/features/auth/server/actions";
import { razorpay } from "@/features/payments/server.init";

export const createSubscription = async (data: CreateSubscription) => {
  const { plan_id, org_id, offer_id } = createSubSchema.parse(data);

  const session = await hasPermission({
    permission: {
      subscription: ["create"],
    },
    organizationId: org_id,
  });

  const sub = await razorpay.subscriptions
    .create({
      plan_id,
      total_count: 1,
      offer_id: offer_id || undefined,
      notes: {
        user: session.user.id,
        org_id,
      },
    })
    .catch((err) => {
      console.log(err);
      throw Error("Failed to create subscription", err);
    });

  return sub;
};
