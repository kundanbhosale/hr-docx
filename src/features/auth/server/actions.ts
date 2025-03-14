"use server";
import { headers } from "next/headers";
import { auth } from "./init";
import { cache } from "react";
import { env } from "@/app/env";
import { redirect } from "next/navigation";
import { ClientError } from "@/lib/error";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const hasPermission = cache(
  async (
    body: Parameters<typeof auth.api.hasPermission>[0]["body"] | undefined,
    type: "internal" | "external-public" | "external-org" = "external-org"
  ) => {
    const session = await getSession();
    const url = headers().get("x-current-path") || "";

    if (!session?.user.id) {
      redirect("/login?cb=" + url);
    }
    if (
      (["external-public", "external-org"].includes(type) && !body) ||
      (type === "external-org" && !session.session.activeOrganizationId)
    ) {
      redirect("/org?cb=" + url);
    }

    if (session.session.activeOrganizationId && body) {
      body.organizationId = session.session.activeOrganizationId;
    }

    if (type === "internal") {
      const domain = session.user.email.split("@")[1];
      if (env.STAFF_DOMAIN === "ignore") {
        return session;
      } else if (!env.STAFF_DOMAIN?.includes(domain))
        throw new ClientError("Permission denied!");
    } else {
      const result = await auth.api.hasPermission({
        headers: await headers(),
        body: body!,
      });
      if (!result.success) throw new ClientError("Permission denied!");
    }

    return session;
  }
);
