import { createAuthMiddleware } from "better-auth/plugins";
import { auth } from "./init";
import { headers } from "next/headers";
import { generateSlug } from "@/lib/id";
import { db } from "@/_server/db";

export const afterAuthMiddleware = createAuthMiddleware(async (ctx) => {
  try {
    const newSession = ctx.context.newSession;

    if (!newSession) return;

    console.log("New Session");
    if (!newSession.session.activeOrganizationId) {
      console.log("No active organization");
      let orgSlug = "";

      await db
        .selectFrom("orgs.list")
        .innerJoin("orgs.member", "orgs.member.organizationId", "orgs.list.id")
        .innerJoin("auth.users", "auth.users.id", "orgs.member.userId")
        .where("auth.users.id", "=", newSession!.user.id)
        .select("orgs.list.slug")
        .limit(1)
        .executeTakeFirst()
        .then((o) => {
          o?.slug && (orgSlug = o?.slug);
        });

      if (!orgSlug) {
        console.log("Creating new org");

        const slug = generateSlug();
        await auth.api
          .createOrganization({
            headers: ctx.headers,
            body: {
              name: slug,
              slug,
            },
          })
          .then((o) => {
            if (o) {
              orgSlug = o.slug;
            }
          });
      }
      console.log("Activating org - ", orgSlug);
      await auth.api.setActiveOrganization({
        headers: ctx.headers,
        body: {
          organizationSlug: orgSlug,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
  return;
});
