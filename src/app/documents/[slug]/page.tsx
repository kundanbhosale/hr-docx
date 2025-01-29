import React from "react";
import DocPage from ".";
import { notFound } from "next/navigation";
import { getSingleTemplate } from "@/features/templates/action";

export default async function page({ params }: { params: { slug: string } }) {
  if (!params.slug) notFound();
  const data = await getSingleTemplate({ slug: params.slug });
  return <DocPage data={data} />;
}
