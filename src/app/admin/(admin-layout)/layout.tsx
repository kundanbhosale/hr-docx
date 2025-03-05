"use client";
import { adminNavs } from "@/client.config";
import { DashboardBody } from "@/components/dashboard/body";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardLayout } from "@/components/dashboard/layout";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardLayout navs={adminNavs}>
      <DashboardHeader label="Admin" title="Kundan Bhosale" />
      <DashboardBody>{children}</DashboardBody>
    </DashboardLayout>
  );
};

export default Layout;
