"use client";
import { Session, User } from "better-auth";
import React, { useEffect } from "react";

import { env } from "@/app/env";

import Script from "next/script";
import { Subscriptions } from "razorpay/dist/types/subscriptions";

export const PageClient = ({
  sub,
  user,
  session,
}: {
  sub: Subscriptions.RazorpaySubscription;
  session: Session;
  user: User;
}) => {
  const processPayment = async () => {
    const params = new URLSearchParams(window.location.search);
    params.set("success", "true");
    const options = {
      key: env.NEXT_PUBLIC_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      //   handler: function (_response: any) {},
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      subscription_id: sub.id,
      callback_url: window.location.origin + "/checkout?" + params.toString(),
      notes: {
        user_id: user?.id,
        org_id: (session as any).activeOrganizationId!,
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      processPayment();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </div>
  );
};
