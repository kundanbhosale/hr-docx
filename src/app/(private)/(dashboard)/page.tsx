import React from "react";
import PageClient from "./page.client";

import { getDashboardData } from "@/features/dashboard/server.actions";
import { ClientError } from "@/lib/error";

const Page = async () => {
  const data = await getDashboardData();
  if (data.error) {
    throw new ClientError(data.error;)
  }

  return <PageClient {...data.data} />;
};

export default Page;
