import { dashboardNavs } from "@/client.config";
import { DashboardLayout } from "@/components/dashboard/layout";
import QueryProvider from "@/contexts/queryProvider";

import React, { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <DashboardLayout navs={dashboardNavs}>{children}</DashboardLayout>
    </QueryProvider>
  );
}
