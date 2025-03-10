"use client";
import { authClient } from "@/features/auth/client";
import Script from "next/script";
import React from "react";
import { PageClient } from "./page.client";

export default function Page() {
  const { data } = authClient.useSession();

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <PageClient user={data?.user} />
    </>
  );
}
