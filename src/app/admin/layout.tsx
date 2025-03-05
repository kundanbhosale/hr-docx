import { hasPermission } from "@/features/auth/server/actions";

import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  await hasPermission(undefined, "internal");
  return <>{children}</>;
};

export default Layout;
