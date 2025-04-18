"use client";
import React from "react";
import { getAllPublicCategories } from "./server.action";
import { AwaitedReturn } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine, Plus } from "lucide-react";
import CategoryForm from "./client.create";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const CategoryList = ({
  data,
}: {
  data: AwaitedReturn<typeof getAllPublicCategories>;
}) => {
  const path = usePathname().split("/").pop();
  return (
    <div className="p-4 space-y-2 w-full border-r">
      <CategoryForm>
        <Button
          size={"lg"}
          variant={"secondary"}
          className="w-full rounded-none border-dashed border bg-transparent h-10"
        >
          <Plus /> New Category
        </Button>
      </CategoryForm>
      <div
        className={cn(
          "p-1 pl-3 hover:bg-muted flex gap-1 justify-between items-center border-b h-10",
          path === "un-categorized" &&
            "bg-primary text-primary-foreground hover:bg-primary/70"
        )}
      >
        <Link
          href={`/admin/category/un-categorized`}
          className={cn("font-medium flex-1")}
        >
          Un categorized
        </Link>
      </div>
      {data?.data?.map((d, i) => (
        <div
          key={i}
          className={cn(
            "p-1 pl-3 hover:bg-muted flex gap-1 justify-between items-center border-b",
            path === d.slug &&
              "bg-primary text-primary-foreground hover:bg-primary/70"
          )}
        >
          <Link
            href={`/admin/category/${d.slug}`}
            className="font-medium flex-1 truncate"
          >
            {d.title}
          </Link>
          <span>
            <CategoryForm data={d}>
              <a className="size-8 flex items-center justify-center cursor-pointer">
                <PenLine className="size-4" />
              </a>
            </CategoryForm>
          </span>
        </div>
      ))}
    </div>
  );
};
