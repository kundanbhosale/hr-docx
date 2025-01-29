import { env } from "../app/env";
import { DB } from "../_server/db";
import { readFileSync, writeFileSync } from "fs";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const pool = new Pool({ connectionString: env.DATABASE_URL });

const dialect = new PostgresDialect({
  pool,
});

const db = new Kysely<DB>({
  dialect,
  log: ["query", "error"],
});

const transformFile = async () => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("No file path provided!");
    return;
  }

  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let dbInterfaceLineIndex = lines.findIndex((line) => {
    return line === "export interface DB {";
  });

  if (dbInterfaceLineIndex === -1) {
    console.warn("Couldn't find `export interface DB");
  }

  const tableMap: Record<string, string> = {};

  Array.from(lines)
    .filter((t, i) => i > dbInterfaceLineIndex && t !== "}")
    .forEach((l) => {
      const splitted = l.replace(/"/g, "").replaceAll(";", "").split(":");
      tableMap[splitted[1]?.trim().toLocaleLowerCase()] = splitted[0].trim();
    });

  const tables = await db.introspection.getTables();
  db.destroy();

  let tableName: string;

  const transformedLines = lines.flatMap((line) => {
    if (line.includes("export interface")) {
      const tableId = line
        .split("export interface")[1]
        .split("{")[0]
        .trim()
        .toLowerCase();

      tableName = tableMap[tableId];
    }

    const matches = [
      ": Json | null;",
      ": Json;",
      ": ArrayType<Json> | null;",
      ": ArrayType<Json>",
    ];

    const matchIdx = matches.findIndex((m) => line.includes(m));
    if (matchIdx !== -1) {
      const match = matches[matchIdx];
      console.log(match);
      const columnName = line.split(match)[0].trim();
      if (tableName && columnName) {
        const table = tables.find((table) => {
          const name =
            (table.schema && `${table.schema}.${table.name}`) || table.name;
          return name === tableName;
        });
        const column = table?.columns.find(
          (column) => column.name == columnName
        );
        const type = column?.comment?.split("@type:")[1];

        if (type) return line.replace(match.split(": ")[1], type);
      }

      return line;
    }

    return line;
  });

  writeFileSync(filePath, transformedLines.join("\n"), "utf-8");
};

transformFile();
