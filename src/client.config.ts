"use client";

import {
  ArrowLeftCircle,
  CircleHelp,
  CircleUser,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

export const adminNavs = {
  primary: [],
  secondary: [
    {
      label: "Dashboard",
      url: "/",
      icon: ArrowLeftCircle,
    },
    {
      label: "My Profile",
      url: "/account",
      icon: User,
    },
    {
      label: "Logout",
      url: "/auth/logout",
      icon: LogOut,
    },
  ],
};

export const dashboardNavs = {
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
      label: "List of documents",
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
    { label: "Sign out", url: "/logout", icon: LogOut },
    { label: "Help", url: "https://tawk.to/hrdocxsupport", icon: CircleHelp },
  ],
};
