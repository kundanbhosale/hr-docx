import React from "react";
import DocPage from "../docPage";

export default async function page({
  params,
}: Promise<{ params: { id: string } }>) {
  const id = await params.id;
  return <DocPage documentId={id} />;
}
