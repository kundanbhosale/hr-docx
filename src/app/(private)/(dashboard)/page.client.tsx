"use client";
import { DashboardBody } from "@/components/dashboard/body";
import { DashboardHeader } from "@/components/dashboard/header";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/auth/client";
import { getDashboardData } from "@/features/dashboard/server.actions";
import { CreateBtn } from "@/features/documents/components/createbtn";
import { AwaitedReturn } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PageClient = (props: AwaitedReturn<typeof getDashboardData>["data"]) => {
  const data = {
    documents: props?.counts?.total || 0,
    downloaded: props?.counts?.total_downloads || 0,
    favorites: props?.counts?.favorites || 0,
    drafts: 0,
  };

  const documents = props?.documents;
  const sub = props?.sub;

  const cardCls = {
    title: "text-lg font-medium text-primary-foreground",
    val: "text-end text-4xl text-primary-foreground font-semibold",
    body: "px-4 py-2 border rounded-md bg-primary",
  };

  const { data: sess } = authClient.useSession();

  return (
    <div>
      <DashboardHeader title={sess?.user.name || ""} label="Hello" />
      <DashboardBody className="p-8 grid grid-cols-[auto_400px] gap-8">
        <div className="grid grid-cols-4 gap-8">
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Total Documents</h1>
            <br />
            <p className={cardCls.val}>{data.documents}</p>
          </div>
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Downloaded</h1>
            <br />
            <p className={cardCls.val}>{data.downloaded}</p>
          </div>
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Favorites</h1>
            <br />
            <p className={cardCls.val}>{data.favorites}</p>
          </div>
          <div className={cardCls.body}>
            <h1 className={cardCls.title}>Drafts</h1>
            <br />
            <p className={cardCls.val}>{data.drafts}</p>
          </div>
          <div className="col-span-4">
            <Docs documents={documents} />
          </div>
          <div className="col-span-4">
            <Modules />
          </div>
        </div>
        <div className="rounded-md bg-accent p-4 space-y-8 flex flex-col">
          <div className="bg-background rounded-md space-y-4 p-4 [&_p]:text-muted-foreground">
            <div className="flex justify-between gap-2">
              <Label>Current Plan</Label>
              <p>{sub?.plan || "Free"}</p>
            </div>
            <div className="flex justify-between gap-2">
              <Label>Total Monthly Downloads</Label>
              <p>{sub?.total}</p>
            </div>
            <div className="flex justify-between gap-2">
              <Label>Monthly Downloads Remaining</Label>
              <p>{sub?.credits.download}</p>
            </div>
            <div className="flex justify-between gap-2">
              <Label>Period</Label>
              <p>{sub?.period}</p>
            </div>
            <div className="pt-5">
              <Link
                href={"/"}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
          <div className="text-primary space-y-4 flex-1 flex flex-col justify-between max-h-[350px]">
            <div className="space-y-2">
              <h1 className="text-2xl">Save More</h1>
              <h1 className="text-2xl font-semibold">With Unlimited Plans</h1>
              <p className="text-base">
                Choose a plan and get onboard in minutes. Enjoy creating
                unlimited documents with exciting editing features.
              </p>
            </div>
            <Link href={"/"} className="flex gap-2 items-center text-base">
              <ArrowRight /> Explore All Payment Plans
            </Link>
            <Image
              src={"/app/ico.svg"}
              alt="HRDocx"
              className=""
              width={50}
              height={50}
            />
          </div>
        </div>
      </DashboardBody>
    </div>
  );
};

function Docs({
  documents,
}: {
  documents:
    | NonNullable<AwaitedReturn<typeof getDashboardData>["data"]>["documents"]
    | undefined;
}) {
  return (
    <div className="">
      <h1 className="text-lg font-semibold text-primary mb-4">
        Recent Documents
      </h1>
      <div className="flex flex-wrap gap-x-8 gap-y-10">
        <CreateBtn />
        {documents?.map((t, i) => (
          <Link
            href={"document/" + t.id}
            key={i}
            style={{
              width: "12rem",
            }}
          >
            <div
              className="border rounded-md overflow-hidden mb-1"
              style={{
                height: "16rem",
                overflow: "hidden",
              }}
            >
              <Image
                key={i}
                src={t.thumbnail || "/docs.png"}
                alt=""
                width={300}
                height={300}
              />
            </div>
            <p className="font-medium text-muted-foreground truncate">
              {t.title || "Untitled Document"}
            </p>
          </Link>
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

export default PageClient;
