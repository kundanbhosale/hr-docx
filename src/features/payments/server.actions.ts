import { razorpay } from "./server.init";

export const createOrder = async () => {
  const sub = await razorpay.subscriptions.create({
    plan_id,
    total_count: 1000,
    offer_id,
    notes: {
      user: user.id,
      org_id: org.id,
    },
  });
};
