// app/providers.js
"use client";

import { ReactNode, Suspense, useEffect } from "react";
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
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
        capture_pageview: false,
        capture_pageleave: true, // Enable pageleave capture
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  );
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
