import { headers } from "next/headers";
import { auth } from "./init";
import { cache } from "react";
import { env } from "@/app/env";
import { redirect } from "next/navigation";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const hasPermission = cache(
  async (
    body: Parameters<typeof auth.api.hasPermission>[0]["body"] | undefined,
    type: "internal" | "external" = "external"
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      const url = headers().get("x-current-path") || "";
      return redirect("/login?cb=" + url);
    }
    if (type === "external" && !body) throw Error("Unauthenticated!");
    if (session.session.activeOrganizationId && body) {
      body.organizationId = session.session.activeOrganizationId;
    }

    if (type === "internal") {
      const domain = session.user.email.split("@")[1];
      console.log("Is a staff?", env.STAFF_DOMAIN, domain);
      if (env.STAFF_DOMAIN === "ignore") {
        return session;
      } else if (!env.STAFF_DOMAIN?.includes(domain))
        throw Error("Permission denied!");
    } else {
      const result = await auth.api.hasPermission({
        headers: await headers(),
        body: body!,
      });
      if (!result.success) throw Error("Permission denied!");
    }

    return session;
  }
);
