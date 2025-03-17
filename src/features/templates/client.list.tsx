"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicTemplates } from "@/features/templates/server.action";
import { AwaitedReturn } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, ReactNode, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const TemplatesList = ({
  search,
  onSelect,
  idPrefix,
}: {
  search: string;
  onSelect?: (slug: string) => void;
  idPrefix?: string;
}) => {
  const [currentView, setCurrentView] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["templates", search],
    queryFn: async () => await getPublicTemplates({ search }),
  });

  if (isError) {
    return <h1>Failed to load templates</h1>;
  }

  const handleFocus = (slug: string, smooth?: boolean = true) => {
    const element = document.getElementById(idPrefix ? idPrefix : "" + slug);
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? "smooth" : "instant",
        block: "start",
      });
    }
  };

  useEffect(() => {
    window.location.hash && handleFocus(window.location.hash.split("#")[1]);
  }, [data]);

  return (
    <div className="grid grid-cols-[200px,auto] gap-8">
      <div className="flex flex-col h-fit sticky top-2">
        {isLoading
          ? [...Array(8)].map((_, i) => (
              <Skeleton className="h-10 w-full mb-4" key={i} />
            ))
          : data?.data?.map((k, i) => (
              <Fragment key={i}>
                <a
                  onClick={() => handleFocus(k.group.slug || "un-categorized")}
                  className={cn(
                    "px-4 py-2 rounded-md hover:bg-muted cursor-pointer h-fit capitalize",
                    currentView === k.group.slug &&
                      "bg-primary text-primary-foreground hover:bg-primary/80"
                  )}
                >
                  {k.group.title || "Un-categorized"}
                </a>
              </Fragment>
            ))}
      </div>

      <div className="grid gap-24 border p-4 bg-muted rounded-md">
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
                  id={`${
                    (idPrefix ? `${idPrefix}-` : "") +
                    (k.group.slug || "un-categorized")
                  }`}
                >
                  <div>
                    <h1
                      className="text-lg font-semibold py-1 px-4 mb-8 rounded"
                      style={{ background: k.group.color || "#ddd" }}
                    >
                      {k.group.title || "Un-categorized"}
                    </h1>
                  </div>
                  <Templates
                    data={k}
                    setInView={() => setCurrentView(k.group.slug)}
                    onSelect={onSelect}
                  />
                </div>
              </Fragment>
            ))}
      </div>
    </div>
  );
};

function Templates({
  data,
  setInView,
  onSelect,
}: {
  data: NonNullable<AwaitedReturn<typeof getPublicTemplates>["data"]>[0];
  setInView: () => void;
  onSelect?: (slug: string) => void;
}) {
  const ref = useRef(null);

  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) return setInView();
  }, [isInView]);

  const CustomLink = ({
    children,
    slug,
  }: {
    children: ReactNode;
    slug: string;
  }) => {
    if (onSelect) {
      <a
        onClick={() => onSelect(slug)}
        className="block"
        style={{ width: "12rem" }}
      >
        {children}
      </a>;
    }
    return (
      <Link
        href={"/document/create/?template=" + slug}
        className="block"
        style={{ width: "12rem" }}
      >
        {children}
      </Link>
    );
  };
  return (
    <div className="flex flex-wrap gap-8" ref={ref}>
      {data.templates.map((t, idx) => (
        <CustomLink slug={t.slug} key={idx}>
          <div
            className="border rounded-md overflow-hidden mb-1 relative"
            style={{
              height: "16rem",
            }}
          >
            <Image
              key={idx}
              src={t.thumbnail || "/docs.png"}
              alt=""
              fill
              quality={100}
            />
          </div>
          <p className="block w-full font-medium text-muted-foreground break-words capitalize">
            {t.title}
          </p>
        </CustomLink>
      ))}
    </div>
  );
}

export function SearchTemplateList({
  onSelect,
  searchQuery,
  setSearchQuery,
  className,
  popupTrigger,
  idPrefix,
}: {
  searchQuery: string;
  idPrefix?: string;
  setSearchQuery: (val: string) => void;
  onSelect: (string) => void;
  className?: string;
  popupTrigger?: ReactNode;
}) {
  const [search] = useDebounce(searchQuery, 300);

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

  const List = (
    <TemplatesList search={search} onSelect={onSelect} idPrefix={idPrefix} />
  );
  if (popupTrigger)
    return (
      <Sheet>
        <SheetTrigger>{popupTrigger}</SheetTrigger>
        <SheetContent className="sm:max-w-screen-lg p-0">
          <SheetHeader className="bg-background">
            <SheetTitle className="border-b">{InputComp}</SheetTitle>
          </SheetHeader>
          <div className="p-4 overflow-y-scroll h-[calc(100vh-65px)]">
            {List}
          </div>
        </SheetContent>
      </Sheet>
    );

  return (
    <>
      {InputComp}
      {List}
    </>
  );
}
