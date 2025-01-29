import { getTemplates } from "@/features/templates/action";
import React from "react";
import BackBtn from "@/components/common/backBtn";
import TemplatesTable from "./table";
const Page = async () => {
  const data = await getTemplates();
  return (
    <div className="p-8 space-y-12">
      <div className="flex gap-4 items-center">
        <BackBtn />
        <h1 className="text-4xl">All Templates</h1>
      </div>
      <TemplatesTable data={data} />
    </div>
  );
};

export default Page;
