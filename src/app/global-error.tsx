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
    <html>
      <body style={{ display: "flex", height: "100vh" }}>
        <ErrorPage error={error} reset={reset} />
      </body>
    </html>
  );
}
