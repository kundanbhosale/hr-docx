import { getTemplates } from "@/features/templates/action";
import React, { Fragment } from "react";
import BackBtn from "@/components/common/backBtn";
import TemplatesTable from "./table";
import NavBar from "@/components/common/nav";
const Page = async () => {
  const data = await getTemplates();
  return (
    <Fragment>
      <NavBar />

      <div className="p-8 space-y-12">
        <div className="flex gap-4 items-center">
          <BackBtn href="/" />
          <h1 className="text-4xl">All Templates</h1>
        </div>
        <TemplatesTable data={data} />
      </div>
    </Fragment>
  );
};

export default Page;
