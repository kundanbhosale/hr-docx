// import React from "react";

import { createCheckout } from "@/features/payments/server.actions";
import { PageClient } from "./page.client";
import { ClientError } from "@/lib/error";

const Page = async (props: {
  searchParams: {
    plan_id: string;
    success: boolean;
    sub_id: string;
    order_id: string;
  };
}) => {
  const data = await createCheckout(props.searchParams);
  if (data.error) {
    throw new ClientError(data.error);
  }

  return <PageClient {...data.data} />;
};

export default Page;
