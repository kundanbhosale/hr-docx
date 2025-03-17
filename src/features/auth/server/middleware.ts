import { createAuthMiddleware } from "better-auth/plugins";
import { generateSlug } from "@/lib/id";
import { db } from "@/_server/db";
import { sql } from "kysely";

export const afterAuthMiddleware = createAuthMiddleware(async (ctx) => {
  try {
    const newSession = ctx.context.newSession;
    // const cookie = await ctx
    // .getSignedCookie("better-auth.session_token", ctx.context.secret)
    // .then((t) => {
    //   console.log(ctx.context.authCookies[c].name, t);
    // });

    if (!newSession) return;

    console.log("New Session");
    if (!newSession.session.activeOrganizationId) {
      console.log("No active organization");
      let orgId = "";

      await db
        .selectFrom("orgs.list")
        .innerJoin("orgs.member", "orgs.member.organizationId", "orgs.list.id")
        .innerJoin("auth.users", "auth.users.id", "orgs.member.userId")
        .where("auth.users.id", "=", newSession!.user.id)
        .select("orgs.list.id")
        .limit(1)
        .executeTakeFirst()
        .then((o) => {
          if (o?.id) {
            orgId = o?.id;
          }
        });

      console.log("found org id : " + orgId);

      if (!orgId) {
        console.log("Creating new org");

        const slug = generateSlug();
        const splitted = Array.from(slug.split("-"));
        splitted.pop();
        const name = splitted.join(" ");
        await db.transaction().execute(async (trx) => {
          const org = await trx
            .insertInto("orgs.list")
            .values({
              id: ctx.context.generateId({ model: "organization" }),
              name,
              slug,
              createdAt: sql`now()`,
              metadata: {
                subscription: null,
                credits: {
                  download: 0,
                },
              },
            })
            .returning(["id", "slug"])
            .executeTakeFirstOrThrow();

          orgId = org.id;

          await trx
            .insertInto("orgs.member")
            .values({
              id: ctx.context.generateId({ model: "member" }),
              organizationId: org.id,
              userId: newSession.user.id,
              role: "owner",
              createdAt: sql`now()`,
            })
            .execute();
          console.log("Created new org & member add");
        });
      }
      await db
        .updateTable("auth.sessions")
        .where("auth.sessions.id", "=", newSession.session.id)
        .set({ activeOrganizationId: orgId })
        .execute();
      console.log("Session updated...", newSession.session.id);
    }
  } catch (err) {
    console.log(err);
  }
  return;
});
