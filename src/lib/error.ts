import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

export class ClientError extends Error {}

export function action<T extends any[], U>(
  fn: (...args: T) => Promise<U>
): (
  ...args: T
) => Promise<{ error: string; data?: never } | { error?: never; data: U }> {
  return async (...args: T) => {
    try {
      return { data: await fn(...args) };
    } catch (err: unknown) {
      console.log("Error typeof:", typeof err);
      console.log(
        "Error instance:",
        err instanceof Error ? err.constructor.name : "Not an instance of Error"
      );

      if (err?.cause === "no-credits") {
        throw err;
      }

      if (err instanceof ZodError) {
        const validationError = fromError(err);
        return redirect(
          "/error?state=" +
            btoa(JSON.stringify({ message: validationError.toString() }))
        );
      }

      if (err instanceof ClientError) {
        return redirect(
          "/error?state=" + btoa(JSON.stringify({ message: err.message }))
        );
      }

      console.log("Throwing error!", err);
      throw err;
    }
  };
}
