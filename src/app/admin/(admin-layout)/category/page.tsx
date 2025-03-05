import { redirect, RedirectType } from "next/navigation";

const Page = async () => {
  return redirect("category/" + "un-categorized", RedirectType.replace);
};

export default Page;
