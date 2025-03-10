import { authClient } from "../client";

export const signIn = async (
  type: "google" | "microsoft" | "magic-link",
  opts?: { email?: string; callbackURL?: string }
) => {
  console.log(opts);
  if (!opts?.callbackURL) {
    opts.callbackURL = "/org";
  }
  switch (type) {
    case "magic-link":
      return await authClient.signIn
        .magicLink({
          email: opts!.email!,
          callbackURL: opts!.callbackURL,
        })
        .then((r) => {
          if (r.data?.status === false) {
            throw Error("Failed to send login link");
          }
          return true;
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
      throw Error("Invalid signin action");
  }
};

export const verifyMagicLink = async (token: string) => {
  return await authClient.magicLink.verify({
    query: {
      token,
    },
  });
};
