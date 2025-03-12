// src/types/global.d.ts

import { Subscriptions as T } from "razorpay/dist/types/subscriptions";

declare global {
  namespace Subscriptions {
    interface RazorpaySubscription extends T.RazorpaySubscription {
      notes: {
        org_id: string;
        user_id: string;
        [key: string]: string | undefined; // Allows additional custom metadata fields
      };
    }
  }
}
