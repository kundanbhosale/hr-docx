import ErrorPage from "@/components/pages/error";
import React from "react";

export default function Page({ searchParams }) {
  const state = searchParams?.state
    ? JSON.parse(atob(searchParams?.state))
    : null;

  return (
    <div className="h-screen flex">
      <ErrorPage
        title="Oops, Error"
        message={state.message || "Something went wrong"}
        noReset
      />
    </div>
  );
}
