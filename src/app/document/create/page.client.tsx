"use client";
import { parseAsString, useQueryState } from "nuqs";
import React, { useState } from "react";
import DocPage from "../docPage";
import { SearchTemplateList } from "@/features/templates/client.list";
import { authClient } from "@/features/auth/client";
import Link from "next/link";
import Image from "next/image";
import { env } from "@/app/env";
import { appConfig } from "@/app.config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PageClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = authClient.useSession();

  const [template, setTemplate] = useQueryState("template", parseAsString);

  if (!template)
    return (
      <>
        {data?.session.id ? (
          <h1 className="text-xl font-semibold text-primary p-4">
            Please Select a template
          </h1>
        ) : (
          <div className="px-8 flex justify-between py-4 m-auto items-center">
            <Link href={env.WWW_URL}>
              <Image
                key={String(open)}
                src={appConfig.logo.logo}
                alt={appConfig.title.short}
                width={200}
                height={40}
              />
            </Link>
            <div className="text-base flex gap-8 items-center">
              <Link href={`${env.WWW_URL}/pricing`}>Pricing</Link>
              <Link
                href={`/login`}
                className={cn(buttonVariants({ size: "lg" }), "text-base")}
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="p-8 border bg-muted">
          <SearchTemplateList
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={(e) => setTemplate(e)}
            className="h-14 text-lg z-50 mb-10"
          />
        </div>
      </>
    );

  return (
    <>
      <DocPage documentId="new" templateId={template} />
    </>
  );
};

export default PageClient;
