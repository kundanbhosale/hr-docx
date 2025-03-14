"use client";
import React, { useEffect } from "react";
import { env } from "@/app/env";
import Script from "next/script";
import { AwaitedReturn } from "@/lib/types";
import { createCheckout } from "@/features/payments/server.actions";
import Loading from "@/components/common/loading";

export const PageClient = (
  props: AwaitedReturn<typeof createCheckout>["data"]
) => {
  const { sub, user, session, order, plan } = props || {};
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
      subscription_id: sub?.id || undefined,
      order_id: order?.id || undefined,
      callback_url: window.location.origin + "/checkout?" + params.toString(),
      notes: {
        plan: plan?.name,
        plan_id: plan?.id,
        user_id: user?.id,
        org_id: session?.activeOrganizationId,
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
    <div className="flex h-screen justify-center items-center">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Loading />
    </div>
  );
};
