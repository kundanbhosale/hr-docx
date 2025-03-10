// import "server-only";

import { pool } from "@/_server/db";
import { env } from "@/app/env";
import { sendTransactionalEmail } from "@/features/mailer/server";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { magicLink, organization } from "better-auth/plugins";
import { ac, admin, member, owner } from "./permission";
import { afterAuthMiddleware } from "./middleware";

const organizationPlugin = organization({
  schema: {
    organization: {
      modelName: "orgs.list",
    },
    member: {
      modelName: "orgs.member",
    },
    invitation: {
      modelName: "orgs.invitation",
    },
  },
  ac: ac,
  roles: {
    owner,
    admin,
    member,
  },
});

const magicLinkPlugin = magicLink({
  sendMagicLink: async ({ email, url }) => {
    const data = await sendTransactionalEmail({
      to: [email],
      subject: "Login to HRDocx",
      html: `Hello,\nlogin to HRDocx using this link:\n${url}`,
    });
    console.log(data);
  },
});

const socialProviders: BetterAuthOptions["socialProviders"] = {
  google: {
    clientId: env.GOOGLE_CLIENT_ID as string,
    clientSecret: env.GOOGLE_CLIENT_SECRET as string,
  },
  microsoft: {
    clientId: env.MICROSOFT_CLIENT_ID as string,
    clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
  },
};

export const auth = betterAuth({
  database: pool,
  socialProviders,
  plugins: [organizationPlugin, magicLinkPlugin],
  hooks: {
    // after: afterAuthMiddleware,
  },
  user: {
    modelName: "auth.users",
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    modelName: "auth.sessions",
  },
  account: {
    modelName: "auth.accounts",
  },
  verification: {
    modelName: "auth.verifications",
  },
});
