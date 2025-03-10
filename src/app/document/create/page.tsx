"use client";
import { parseAsString, useQueryState } from "nuqs";
import React, { useState } from "react";
import DocPage from "../docPage";
import { SearchTemplateList } from "@/features/templates/client.list";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [template, setTemplate] = useQueryState("template", parseAsString);
  if (!template)
    return (
      <>
        <h1 className="text-xl font-semibold text-primary p-4">
          Please Select a template
        </h1>
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

export default Page;
