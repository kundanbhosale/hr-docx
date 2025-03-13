import React, { Suspense } from "react";
import UpgradePage from "./page.client";

export default function Page() {
  return (
    <Suspense>
      <UpgradePage />
    </Suspense>
  );
}
