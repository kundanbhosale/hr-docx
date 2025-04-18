import { ClientError } from "@/lib/error";
import { authClient } from "../client";

export const signIn = async (
  type: "google" | "microsoft" | "otp" | "signin-otp",
  opts?: { email?: string; callbackURL?: string; otp?: string },
  routeCb?: (v: string) => void
) => {
  console.log(opts);
  if (!opts?.callbackURL) {
    opts = {
      ...opts,
      callbackURL: "/org",
    };
  }
  switch (type) {
    case "otp":
      return await authClient.emailOtp
        .sendVerificationOtp({
          email: opts!.email!,
          type: "sign-in",
          // callbackURL: opts!.callbackURL,
        })
        .then((r) => {
          if (r.data?.success === false) {
            throw new ClientError("Failed to send login OTP");
          }
          return true;
        })
        .catch((e) => {
          throw e;
        });
    case "signin-otp":
      return await authClient.signIn
        .emailOtp({
          email: opts.email!,
          otp: opts.otp!,
        })
        .then((r) => {
          // console.log({ r });
          if (!r.data?.user) {
            throw new ClientError("Failed to signin");
          }
          return routeCb && routeCb(opts.callbackURL || "/");
        })
        .catch((e) => {
          throw e;
        });
    case "google":
      return await authClient.signIn
        .social({
          provider: "google",
          callbackURL: opts!.callbackURL,
        })
        .then((_r) => true)
        .catch((e) => {
          throw e;
        });

    case "microsoft":
      return await authClient.signIn
        .social({
          provider: "microsoft",
          callbackURL: opts!.callbackURL,
        })
        .then((_r) => true)
        .catch((e) => {
          throw e;
        });

    default:
      throw new ClientError("Invalid signin action");
  }
};
