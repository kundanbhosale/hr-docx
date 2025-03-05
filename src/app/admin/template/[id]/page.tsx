import React from "react";
import DocGenerator from "./";
import { getSingleTemplate } from "@/features/templates/server.action";
import { AwaitedReturn } from "@/lib/types";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  let data: AwaitedReturn<typeof getSingleTemplate> | null = null;
  if (id !== "new") {
    data = await getSingleTemplate({ id });
  }
  return (
    <div>
      <DocGenerator id={id} data={data?.data} />
    </div>
  );
};

export default Page;
