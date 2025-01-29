"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AwaitedReturn } from "@/lib/types";
import { ArrowRight, Plus, Search, Squirrel } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { getTemplates } from "../action";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

export default function TemplateList({
  data,
}: {
  data: AwaitedReturn<typeof getTemplates>;
}) {
  const [q, setQ] = useQueryState("q", { shallow: false });
  const debounced = useDebouncedCallback((value) => {
    setQ(value);
  }, 500);

  return (
    <div className="max-w-screen-xl m-auto py-14 space-y-12" key={q}>
      <div className="flex justify-center h-40 items-center">
        <Input
          name="search"
          icon={<Search />}
          defaultValue={q || ""}
          onChange={(e) => debounced(e.currentTarget.value)}
          className="h-16 w-full text-xl px-6 max-w-xl m-auto"
          placeholder="Search Documents"
        >
          <Button size={"icon"}>
            <ArrowRight />
          </Button>
        </Input>
      </div>
      {data.length === 0 ? (
        <div className="w-full max-w-xl flex flex-col items-center justify-center m-auto">
          <Squirrel className="size-32 mb-8" strokeWidth={1.5} />
          <h1 className="text-4xl mb-4"> No Documents found!</h1>
          <p className="text-base text-center text-muted-foreground">
            No results were found for your search term &quot;{q}&quot;! Try
            searching different document.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,200px))] justify-center gap-8">
          {data.map((a, i) => (
            <Link href={`/documents/${a.slug}`} key={i} className="">
              <div className="w-full h-72 bg-muted flex p-4 flex-col justify-between bg-emerald-500">
                <span className="font-bold text-start p-2 bg-black text-white">
                  HR DOCX
                </span>
                <span className="text-start font-semibold text-lg capitalize bottom-0">
                  {a?.title || ""}
                </span>
              </div>
              <p className="truncate text-base mt-2">{a.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
