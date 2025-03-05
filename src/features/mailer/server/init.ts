import { env } from "@/app/env";
import { CreateEmailOptions, Resend } from "resend";

export const mailer = new Resend(env.RESEND_KEY);

export const sendTransactionalEmail = async (
  props: Pick<CreateEmailOptions, "to" | "subject" | "html">
) => {
  return await mailer.emails.send({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(props as any),
    from: "HR Docx <noreply@hrdocx.com>",
  });
};
