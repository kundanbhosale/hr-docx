"use client";
import { DashboardLayout } from "@/components/dashboard/layout";
import Loading from "@/components/ui/loading";
import { authClient } from "@/features/auth/client";
import {
  CircleHelp,
  CircleUser,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import React, { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession();

  const navs = {
    primary: [
      {
        label: "My Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        label: "My Document",
        url: "/documents",
        icon: FileText,
      },
      {
        label: "Templates",
        url: "/templates",
        icon: Layers,
      },
      {
        label: "My Profile",
        url: "/account",
        icon: CircleUser,
      },
    ],
    secondary: [
      { label: "Help", url: "/help", icon: CircleHelp },
      { label: "Sign out", url: "/logout", icon: LogOut },
    ],
  };

  if (isPending) {
    return <Loading className="min-h-screen" />;
  }

  console.log(data, !data?.session?.id);

  if (!data?.session?.id) {
    return <>{children}</>;
  }

  return <DashboardLayout navs={navs}>{children}</DashboardLayout>;
}
