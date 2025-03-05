import { auth } from "@/features/auth/server";
import { getPath } from "@/lib/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const head = headers();
  const data = await auth.api.getSession({
    headers: head,
  });
  const path = await getPath();
  if (!data?.session) return redirect("/login");
  if (!data.session.activeOrganizationId && path !== "/app/org")
    return redirect("/app/org");
  return <>{children}</>;
};

export default Layout;
