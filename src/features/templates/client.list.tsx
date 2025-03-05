"use client";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment, ReactNode } from "react";
import { getPublicTemplates } from "./server.action";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
export default function SearchTemplateList({
  onSelect,
  searchQuery,
  setSearchQuery,
  className,
  popupTrigger,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSelect: (string) => void;
  className?: string;
  popupTrigger?: ReactNode;
}) {
  const [search] = useDebounce(searchQuery, 300);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["templates", search],
    queryFn: async () => getPublicTemplates({ search }),
  });

  if (isError) {
    return <h1>Failed to load templates</h1>;
  }
  const InputComp = (
    <Input
      placeholder="Search Templates"
      value={searchQuery}
      onChange={(e) => setSearchQuery?.(e.currentTarget.value)}
      icon={<Search />}
      className={cn(
        "font-normal",
        popupTrigger && "border-none rounded-none pr-10",
        className
      )}
    />
  );

  const Items = (
    <div className="relative">
      <div>
        <div className="grid gap-24">
          {isLoading
            ? [...Array(2)].map((_, i) => (
                <div className="grid gap-8" key={i}>
                  <Skeleton className="h-10 w-full" key={i} />
                  <div className="flex flex-wrap gap-8">
                    {[...Array(10)].map((_, e) => (
                      <Skeleton
                        key={e}
                        className=""
                        style={{ width: "12rem", height: "16rem" }}
                      />
                    ))}
                  </div>
                </div>
              ))
            : data?.data?.map((k, i) => (
                <Fragment key={i}>
                  <div
                    className="grid"
                    id={k.group.slug || "un-categorized"}
                    // whileInView={{}}
                  >
                    <div>
                      <h1
                        className="text-lg font-semibold py-1 px-4 mb-8"
                        style={{ background: k.group.color || "#ddd" }}
                      >
                        {k.group.title || "Un-categorized"}
                      </h1>
                    </div>
                    <div className="flex flex-wrap gap-8">
                      {k.templates.map((t, idx) => (
                        <a
                          onClick={() => onSelect(t.slug)}
                          key={i}
                          className="block group cursor-pointer"
                          style={{ width: "12rem" }}
                        >
                          <div
                            className="border rounded-md overflow-hidden mb-1 relative group-hover:border-primary"
                            style={{
                              height: "16rem",
                            }}
                          >
                            <div className="hidden group-hover:block group-hover:bg-primary/10 z-10 absolute top-0 left-0 h-full w-full" />
                            <Image
                              key={idx}
                              src={"/docs.png"}
                              alt=""
                              fill
                              quality={100}
                            />
                          </div>
                          <p className="block w-full font-medium text-muted-foreground break-words">
                            {t.title}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
        </div>
      </div>
    </div>
  );

  if (popupTrigger)
    return (
      <Sheet>
        <SheetTrigger>{popupTrigger}</SheetTrigger>
        <SheetContent className="sm:max-w-screen-lg p-0 overflow-y-scroll">
          <SheetHeader className="sticky top-0 z-50 bg-background">
            <SheetTitle className="border-b">{InputComp}</SheetTitle>
          </SheetHeader>
          <div className="px-8 py-12">{Items}</div>
        </SheetContent>
      </Sheet>
    );

  return (
    <>
      {InputComp}
      {Items}
    </>
  );
}
