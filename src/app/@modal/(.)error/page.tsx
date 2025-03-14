import UpgradePage from "@/app/upgrade/page.client";
import ErrorPage from "@/components/pages/error";
import React, { Suspense } from "react";

export default function ErrorFn({ searchParams }) {
  return (
    <Suspense>
      <ErrorPage />
    </Suspense>
  );
}
