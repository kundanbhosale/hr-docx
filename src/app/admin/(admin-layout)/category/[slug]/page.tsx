import { buttonVariants } from "@/components/ui/button";
import { getSingleCategory } from "@/features/categories/server.action";
import { getTemplates } from "@/features/templates/server.action";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import TemplatesTable from "./table";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const data = await getTemplates({
    group: slug,
  });
  const { data: cat } =
    slug === "un-categorized"
      ? { data: { title: "Un Categorized", color: "#ddd" } }
      : await getSingleCategory({ slug }).catch(() => {
          return notFound();
        });
  return (
    <div className="p-4">
      <div
        className="flex gap-4 items-center mb-4 border-b-4 pb-2"
        style={{ borderColor: cat?.color || "#eee" }}
      >
        <div className="px-4 flex-1 h-10 flex items-center space-x-2">
          <h1 className="text-xl font-semibold truncate">{cat?.title}</h1>
          <span className="text-lg">({data.data?.length || 0} Templates)</span>
        </div>
        <Link
          href={"/admin/template/new"}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Plus />
          Create Template
        </Link>
      </div>
      {/* {data.data?.map((d, i) => (
        <div
          key={i}
          className="flex justify-between border-b last:border-none p-2"
        >
          <Link
            href={"/admin/template/" + d.id}
            key={i}
            className="hover:bg-muted block"
          >
            <p>{d.title}</p>
          </Link>
          <Button variant={"outline"} size="icon" className="size-8">
            <Trash />
          </Button>
        </div>
      ))} */}
      <TemplatesTable data={data} />
    </div>
  );
};

export default Page;
