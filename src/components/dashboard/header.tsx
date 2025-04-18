"use client";
import React, { useState } from "react";

import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { SearchTemplateList } from "@/features/templates/client.list";

export const DashboardHeader = ({
  title,
  label,
}: {
  title: string;
  label?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex justify-between gap-12 w-full p-8 items-center border-b">
      <div className="text-primary">
        {label && <p className="font-semibold text-md">{label}</p>}
        <h1 className="font-semibold text-xl">{title}</h1>
      </div>
      <div className="flex-1 flex justify-end">
        <SearchTemplateList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="h-16 text-lg w-full"
          onSelect={(c) => c}
          idPrefix="search"
          popupTrigger={
            <>
              <Input
                icon={<Search />}
                placeholder="Search Templates..."
                className="w-full rounded-full h-14 text-base border-primary border-2"
              />
            </>
          }
        />
      </div>
    </div>
  );
};
