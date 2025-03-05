import { DashboardBody } from "@/components/dashboard/body";
import { DashboardHeader } from "@/components/dashboard/header";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  const data = {
    documents: 10,
    downloaded: 100,
    saved: 35,
    drafts: 2,
  };

  const cardCls = {
    title: "text-lg font-medium text-primary-foreground",
    val: "text-end text-4xl text-primary-foreground font-semibold",
    body: "px-4 py-2 border rounded-md bg-primary",
  };

  return (
    <div>
      <DashboardHeader title="Ketaki Katkar" label="Hello" />
      <DashboardBody className="p-8 grid grid-cols-3 gap-8">
        <div className="grid grid-cols-4 gap-8 col-span-2">
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>My Documents</h1>
            <br />
            <p className={cardCls.val}>{data.documents}</p>
          </div>
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Downloaded</h1>
            <br />
            <p className={cardCls.val}>{data.downloaded}</p>
          </div>
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Saved</h1>
            <br />
            <p className={cardCls.val}>{data.saved}</p>
          </div>
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Drafts</h1>
            <br />
            <p className={cardCls.val}>{data.drafts}</p>
          </div>
          <div className="col-span-4">
            <Docs />
          </div>
          <div className="col-span-4">
            <Modules />
          </div>
        </div>
        <div className="border rounded-md"></div>
      </DashboardBody>
    </div>
  );
};

function Docs() {
  return (
    <div className="">
      <h1 className="text-lg font-semibold text-primary mb-4">
        Recent Documents
      </h1>
      <div className="grid grid-cols-4 gap-8 rounded-md">
        <Link
          href={"/document/create"}
          className="border flex items-center justify-center flex-1"
        >
          <Plus className="size-8" />
        </Link>
        {[...Array(3)].map((v, i) => (
          <div className="border rounded-md overflow-hidden" key={i}>
            <Image
              key={i}
              src={"/docs.png"}
              alt=""
              width={300}
              height={300}
              quality={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
function Modules() {
  return (
    <div className="">
      <h1 className="text-lg font-semibold text-primary mb-4">Modules</h1>
      <div className="grid grid-cols-4 gap-8 rounded-md">
        {[...Array(4)].map((v, i) => (
          <div className="border rounded-md h-20 p-4" key={i}>
            <p className="text-md font-medium text-primary">Module {i}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
