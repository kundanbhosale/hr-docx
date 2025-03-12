import { ZodError } from "zod";

export class ClientError extends Error {}
import { fromError } from "zod-validation-error";

export function action<T extends any[], U>(
  fn: (...args: T) => Promise<U>
): (
  ...args: T
) => Promise<{ error: string; data?: never } | { error?: never; data: U }> {
  return async (...args: T) => {
    try {
      return { data: await fn(...args) };
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const validationError = fromError(err);
        return { error: validationError.toString() };
      }

      if (err instanceof ClientError) return { error: err.message };
      throw err;
    }
  };
}
