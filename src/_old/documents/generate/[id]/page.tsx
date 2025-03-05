import React from "react";
import DocGenerator from "./";
import { getSingleTemplate } from "@/features/templates/server.action";
import { AwaitedReturn } from "@/lib/types";

const Page = async ({ params }: { params: { id: string } }) => {
  let data: AwaitedReturn<typeof getSingleTemplate> | null = null;
  if (params.id !== "new") {
    data = await getSingleTemplate({ id: params.id });
  }
  return (
    <div>
      <DocGenerator id={params.id} data={data} />
    </div>
  );
};

export default Page;
