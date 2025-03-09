import React from "react";
import PageClient from "./page.client";

import { getDashboardData } from "@/features/dashboard/server.actions";

const Page = async () => {
  const data = await getDashboardData();
  return <PageClient {...data} />;
};

export default Page;
