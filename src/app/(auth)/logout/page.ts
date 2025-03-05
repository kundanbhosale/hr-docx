import { auth } from "@/features/auth/server";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

const Page = async () => {
  await auth.api.signOut({ headers: await headers() });
  return redirect("/", RedirectType.replace);
};

export default Page;
