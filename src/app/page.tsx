import NavBar from "@/components/common/nav";
import { getTemplates } from "@/features/templates/action";
import TemplateList from "@/features/templates/components/list";
import { createLoader, parseAsString, SearchParams } from "nuqs/server";
import { Suspense } from "react";
type PageProps = {
  searchParams: Promise<SearchParams>;
};
export default async function Page({ searchParams }: PageProps) {
  return (
    <>
      <NavBar />

      <Suspense>
        {" "}
        <TemplateList />
      </Suspense>
    </>
  );
}
