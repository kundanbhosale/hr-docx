import { createAuthMiddleware } from "better-auth/plugins";
import { redirect, RedirectType } from "next/navigation";

export const authMiddleware = createAuthMiddleware(async (ctx) => {
  const newSession = ctx.context.newSession;
  if (!newSession) return;

  if (!newSession.session.activeOrganizationId)
    return redirect("/app/org", RedirectType.replace);

  return;
});
