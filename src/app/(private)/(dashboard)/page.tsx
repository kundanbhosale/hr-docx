import React from "react";
import PageClient from "./page.client";

import { getDashboardData } from "@/features/dashboard/server.actions";

const Page = async () => {
  const data = await getDashboardData();
  if (data.error) {
    throw data.error;
  }

  return <PageClient {...data.data} />;
};

export default Page;
