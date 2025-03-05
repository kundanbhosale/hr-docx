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
      if (err instanceof ClientError) return { error: err.message };
      throw err;
    }
  };
}
