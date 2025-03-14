// src/types/global.d.ts

import { Orders as O } from "razorpay/dist/types/orders";
import { Subscriptions as T } from "razorpay/dist/types/subscriptions";
import { Payments as P } from "razorpay/dist/types/payments";

export type RZPNotes = {
  org_id: string;
  user_id: string;
  plan_name: string;
  plan_id: string;
  [key: string]: string | undefined; // Allows additional custom metadata fields
};
declare global {
  namespace Subscriptions {
    interface RazorpaySubscription extends T.RazorpaySubscription {
      notes: RZPNotes;
    }
  }
}

declare global {
  namespace Orders {
    interface RazorpayOrder extends O.RazorpayOrder {
      notes: RZPNotes;
    }
  }
}

declare global {
  namespace Payments {
    interface RazorpayPayment extends P.RazorpayPayment {
      notes: RZPNotes;
    }
  }
}
