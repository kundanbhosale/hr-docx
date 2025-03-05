"use client";
import { Input } from "@/components/ui/input";
import { Search, Squirrel } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getTemplates } from "../server.action";
import { AwaitedReturn } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateList() {
  const [list, setList] = useState<AwaitedReturn<typeof getTemplates> | null>(
    null
  );
  const [q, setQ] = useState("");
  const [pending, startTrans] = useTransition();

  const getList = useDebouncedCallback(() => {
    console.log("hit");

    startTrans(() => {
      getTemplates(q).then((t) => setList(t));
    });
  }, 500);

  useEffect(() => {
    getList();
  }, [q]);

  return (
    <div className="max-w-screen-xl m-auto py-14 space-y-12">
      <div className="flex justify-center h-40 items-center" id="search-input">
        <Input
          name="search"
          defaultValue={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
          autoCorrect="false"
          icon={<Search />}
          className="h-16 w-full text-xl px-6 m-auto max-w-xl"
          placeholder="Search Documents"
        >
          {/* <Button size={"icon"}>
            <ArrowRight />
          </Button> */}
        </Input>
      </div>
      <div id="search-results">
        {list && list.length === 0 ? (
          <div className="w-full max-w-xl flex flex-col items-center justify-center m-auto">
            <Squirrel className="size-32 mb-8" strokeWidth={1.5} />
            <h1 className="text-4xl mb-4">No Documents found!</h1>
            <p className="text-base text-center text-muted-foreground">
              No results were found for your search term &quot;{q}&quot;! Try
              searching different document.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,200px))] justify-center gap-8">
            {!list || pending ? (
              <>
                {[...Array(10)].map((k, i) => (
                  <Skeleton
                    key={i}
                    id={`docs-${i}`}
                    className="w-full h-72 flex p-4 flex-col justify-between "
                  ></Skeleton>
                ))}
              </>
            ) : (
              list.map((a, i) => (
                <Link
                  href={`/documents/${a.slug}`}
                  key={i}
                  className=""
                  id={`docs-${i}`}
                >
                  <div className="w-full h-72 flex p-4 flex-col justify-between bg-emerald-500">
                    <span className="font-bold text-start p-2 bg-black text-white">
                      HR DOCX
                    </span>
                    <span className="text-start font-semibold text-lg capitalize bottom-0">
                      {a?.title || ""}
                    </span>
                  </div>
                  <p className="truncate text-base mt-2">{a.title}</p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
