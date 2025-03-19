import { env } from "@/app/env";
import { auth } from "@/features/auth/server";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

const Page = async () => {
  await auth.api.signOut({ headers: await headers() });
  return redirect(env.WWW_URL, RedirectType.replace);
};

export default Page;
