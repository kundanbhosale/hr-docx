import { env } from "@/app/env";
import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  organizationClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL, // the base url of your auth server
  plugins: [organizationClient(), magicLinkClient()],
});
