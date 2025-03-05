"use client";
import Loading from "@/components/common/loading";
import { authClient } from "@/features/auth/client";
import { CreateOrgDialog } from "@/features/org/client";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

export default function PageClient() {
  const { data, isPending } = authClient.useListOrganizations();
  const [pendingAction, startTrans] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOrg = async (organizationSlug: string) => {
    startTrans(async () => {
      await authClient.organization.setActive({ organizationSlug }).then(() => {
        router.push("/app");
      });
    });
  };

  return (
    <div className="p-8 min-h-screen flex flex-col bg-muted">
      <div className="flex justify-center items-center mb-10">
        {" "}
        <Image src={"/app/logo.png"} alt="" width={150} height={44} />
      </div>
      <div className="max-w-screen-md m-auto border flex-1 w-full p-8 space-y-8 bg-background flex flex-col">
        {pendingAction ? (
          <Loading title="Redirecting to Organization" />
        ) : isPending ? (
          <Loading title="Fetching Organization" />
        ) : (
          <>
            <div className="space-y-2">
              {" "}
              <h1 className="text-2xl font-semibold text-primary">
                My Organizations
              </h1>
              <p>List of all organization that you can access</p>
            </div>
            <div className=" grid grid-cols-3 gap-8">
              <CreateOrgDialog open={open} setOpen={setOpen}>
                <a className="border p-4 flex items-center justify-start gap-2 size-full hover:bg-primary/20">
                  <span>
                    <Plus />
                  </span>{" "}
                  Create New
                </a>
              </CreateOrgDialog>

              {data?.map((o, i) => (
                <a
                  onClick={() => handleOrg(o.slug)}
                  key={i}
                  className="border p-4 hover:bg-primary/20 cursor-pointer"
                >
                  <h1 className="capitalize font-semibold">{o.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {format(o.createdAt, "PP")}
                  </p>
                </a>
              ))}
            </div>
          </>
        )}{" "}
      </div>
    </div>
  );
}
