// app/providers.js
"use client";

import { ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/app/env";

const PostHogPageView = dynamic(() => import("../hooks/posthog"), {
  ssr: false,
});

export function CSPostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (env.IN_PROD) {
      posthog.init("", {
        api_host: "",
        person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
        capture_pageview: false,
        capture_pageleave: true, // Enable pageleave capture
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
}
