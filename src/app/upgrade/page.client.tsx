"use client";
import React from "react";
import { Modal } from "../@modal/modal";
import { appConfig } from "@/app.config";
import Link from "next/link";
import { ArrowRight, Check, Download, XCircle } from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/intl";
import { useSearchParams } from "next/navigation";

export default function UpgradePage({}) {
  const params = useSearchParams();

  const view = (params.get("view") as "all_plans") || undefined;
  const cb = (params.get("cb") as string) || undefined;

  const bestValuePlan = appConfig.plans.find((b) => b.bestValue);
  const ppdPlan = appConfig.plans.find((b) => b.id === "ppd");

  const banner = {
    default: {
      label: "Save More",
      title: "With Unlimited Plans",
      desc: "Choose a plan and get onboard in minutes. Enjoy creating unlimited documents with exciting editing features.",
      btn: {
        text: "Explore All Payment Plans",
      },
    },
  };

  const currBanner = banner.default;

  const plans =
    view === "all_plans" ? appConfig.plans : [ppdPlan, bestValuePlan];

  const featuresList = {};

  appConfig.plans.forEach((f) => {
    const features = f.features;
    featuresList[f.id] = [
      {
        text: `Access to ${
          features.documents === -1 ? "Unlimited" : features.documents
        } document(s)`,
        check: features.documents !== 0,
      },
      {
        text: `${
          features.downloads === -1 ? "Unlimited" : features.downloads
        } document download(s)`,
        check: features.downloads !== 0,
      },
      {
        text: `Collaboration access for${
          features.collaboration_access === -1
            ? "Unlimited"
            : features.collaboration_access
        } document(s)`,
        check: features.collaboration_access !== 0,
      },
      {
        text: `${features.email_support} E-mail Support`,
        check: features.email_support,
      },
      {
        text: `${features.call_support ? "Priority" : ""} Call Support`,
        check: features.call_support,
      },
      {
        text: `History Control`,
        check: features.history_control,
      },
      {
        text: `Version Control`,
        check: features.version_control,
      },
    ];
  });

  return (
    <Modal className="max-w-screen-xl m-auto w-max border-none shadow-none overflow-y-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        {view !== "all_plans" && (
          <div className="bg-background text-primary max-w-[350px] w-full border rounded-lg p-8 space-y-8 flex flex-col justify-between border-secondary">
            <div className="space-y-8">
              <h1 className="text-2xl space-y-4">
                <span className="font-semibold"> {currBanner.label}</span>
                <br />
                <span> {currBanner.title}</span>
              </h1>
              <p>{currBanner.desc}</p>
            </div>
            <Link
              href={"/upgrade?view=all_plans"}
              className="flex gap-2 items-center text-base"
            >
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
        )}

        {plans.map((p, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[300px] w-full border rounded-lg p-8 gap-6 flex flex-col justify-between border-secondary bg-background relative overflow-hidden",
              p?.bestValue && "bg-secondary border-none"
            )}
          >
            {p?.bestValue && (
              <div className="bg-primary text-primary-foreground pl-4 pt-4 pb-2 pr-7 text-sm font-medium absolute -right-4 -top-3 rounded-2xl">
                Best Value
              </div>
            )}
            <div className="space-y-2">
              <h1 className="text-2xl">{p?.name}</h1>
              <p className="font-medium">What You&apos;ll Get</p>
            </div>
            <div className="space-y-2">
              {featuresList[p?.id as any].map((k, i) => (
                <div key={i} className="grid grid-cols-[30px,auto]">
                  <div>
                    {k.check ? (
                      <Check className="size-4 stroke-primary" />
                    ) : (
                      <XCircle className="size-4 stroke-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="capitalize">{k.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-b border-dashed border-foreground" />

            <div>
              <h1 className="text-xl font-semibold">
                {formatAmount("INR", Number(p?.prices.inr))} /-
              </h1>
              <p>
                {formatAmount(
                  "INR",
                  Number(p?.prices.inr) / Number(p?.features.downloads || 0)
                )}
                /document
              </p>
            </div>
            <div>
              <Link
                href={
                  "/checkout?plan_id=" + p?.id + ((cb && "&cb_url=" + cb) || "")
                }
                className={cn(buttonVariants({ variant: "default" }), "w-full")}
              >
                {p?.id === "ppd" ? (
                  <>
                    <Download />
                    <span>Pay & Download</span>
                  </>
                ) : (
                  "Subscribe to " + p?.name
                )}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
