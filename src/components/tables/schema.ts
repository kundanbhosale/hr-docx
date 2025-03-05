import { z } from "zod";

export const columnFilterSchema = <
  T extends z.ZodObject<{
    id: z.ZodEnum<[string, ...string[]]> | z.ZodString;
    value: never;
  }>
>(
  obj: T
) =>
  z.preprocess(
    (v) => (v ? JSON.parse(decodeURIComponent(v as never)) : undefined),
    z.array(obj).catch([])
  );

export const sortingSchema = (
  ids: z.ZodEnum<[string, ...string[]]> | z.ZodString
) =>
  z.preprocess(
    (v) => (v ? JSON.parse(decodeURIComponent(v as never)) : undefined),
    z.array(z.object({ id: ids, desc: z.boolean() })).catch([])
  );

export const listQueryStateSchema = <
  T extends z.ZodObject<{
    id: z.ZodEnum<[string, ...string[]]> | z.ZodString;
    value: never;
  }>
>({
  sortIds,
  filterObj,
}: {
  sortIds: z.ZodEnum<[string, ...string[]]> | z.ZodString;
  filterObj: T;
}) =>
  z.object({
    search: z.string().optional().catch(undefined),
    filters: columnFilterSchema(filterObj),
    sort: sortingSchema(sortIds),
    page: z.coerce.number().int().min(0).catch(0),
    limit: z.coerce.number().int().min(0).max(100).catch(100),
  });
