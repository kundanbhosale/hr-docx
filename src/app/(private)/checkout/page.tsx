// import React from "react";

import { createCheckout } from "@/features/payments/server.actions";
import { PageClient } from "./page.client";

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
    throw data.error;
  }

  return <PageClient {...data.data} />;
};

export default Page;
