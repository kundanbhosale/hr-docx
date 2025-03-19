import { auth } from "@/features/auth/server";
import { getPath } from "@/lib/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const head = headers();
  const data = await auth.api.getSession({
    headers: head,
  });
  const path = await getPath();
  if (!data?.session) {
    return redirect("/login");
  } else if (
    data?.session &&
    !data?.session.activeOrganizationId &&
    path !== "/org"
  ) {
    return redirect("/org");
  } else {
    return children;
  }
}
