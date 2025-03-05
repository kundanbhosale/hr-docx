import { getAllPublicCategories } from "@/features/categories/server.action";
import { notFound, redirect, RedirectType } from "next/navigation";

const Page = async () => {
  const { data } = await getAllPublicCategories({});
  if (!data) throw notFound();
  return redirect("category/" + data[0].slug, RedirectType.replace);
};

export default Page;
