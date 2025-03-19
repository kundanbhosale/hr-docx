"use client";

import {
  ArrowLeftCircle,
  Box,
  CircleHelp,
  CircleUser,
  FileText,
  Info,
  Layers,
  LayoutDashboard,
  LogOut,
  Navigation2,
  Phone,
  Settings,
  User,
} from "lucide-react";

export const adminNavs = {
  primary: [
    // {
    //   label: "Dashboard",
    //   url: "/app",
    //   icon: ArrowLeftCircle,
    // },
    // {
    //   label: "Templates",
    //   url: "/admin",
    //   icon: FileText,
    // },
    // {
    //   label: "Categories",
    //   url: "/admin/categories",
    //   icon: Box,
    // },
  ],
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
      label: "Templates",
      url: "/templates",
      icon: Layers,
    },
    {
      label: "My Profile",
      url: "/account",
      icon: CircleUser,
    },
    // {
    //   label: "Take a Tour",
    //   url: "#app-tour",
    //   icon: Navigation2,
    // },
    // {
    //   label: "About us",
    //   url: "#about",
    //   icon: Info,
    // },
    // {
    //   label: "Need Help",
    //   url: "/help",
    //   icon: Phone,
    // },
  ],
  secondary: [
    { label: "Sign out", url: "/logout", icon: LogOut },
    { label: "Help", url: "https://tawk.to/hrdocxsupport", icon: CircleHelp },
  ],
};
