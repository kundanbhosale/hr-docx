"use client";
import { DashboardLayout } from "@/components/dashboard/layout";
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
  const { data } = authClient.useSession();

  const [navs, setNavs] = useState({
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
    secondary: [{ label: "Help", url: "/help", icon: CircleHelp }],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data?.session.id) {
        if (navs.secondary.find((u) => u.url === "/logout")) return;
        const d = navs;
        d.secondary.unshift({
          label: "Sign out",
          url: "/logout",
          icon: LogOut,
        });
        setNavs(d);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return <DashboardLayout navs={navs}>{children}</DashboardLayout>;
}
