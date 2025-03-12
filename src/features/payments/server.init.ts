import { env } from "@/app/env";
import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: env.NEXT_PUBLIC_RAZORPAY_KEY!,
  key_secret: env.RAZORPAY_SECRET!,
});
