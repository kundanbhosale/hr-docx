"use client";

import ErrorPage from "@/components/pages/error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-screen flex">
      <ErrorPage error={error} reset={reset} />
    </div>
  );
}
