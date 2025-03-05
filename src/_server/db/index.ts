import { DB } from "./types";
import { env } from "@/app/env";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export const pool = new Pool({ connectionString: env.DATABASE_URL });

const dialect = new PostgresDialect({
  pool,
});

export const db = new Kysely<DB>({
  dialect,
  // log: ["query", "error"],
});
