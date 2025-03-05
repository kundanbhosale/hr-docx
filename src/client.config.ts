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
      url: "/app",
      icon: ArrowLeftCircle,
    },
    {
      label: "My Profile",
      url: "/app/account",
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
      url: "/app",
      icon: LayoutDashboard,
    },
    {
      label: "My Document",
      url: "/app/documents",
      icon: FileText,
    },
    {
      label: "Templates",
      url: "/app/templates",
      icon: Layers,
    },
    {
      label: "My Profile",
      url: "/app/account",
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
    { label: "Help", url: "/help", icon: CircleHelp },
  ],
};
