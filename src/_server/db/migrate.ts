import { FileMigrationProvider, Kysely, Migrator, sql } from "kysely";
import path from "path";
import { promises as fs } from "fs";
import { db } from ".";

export async function executeMigration() {
  const migrationFolder = path.join(__dirname, "../db/migrations");
  console.log("Migration Folder: ", migrationFolder);
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  const args = process.argv.slice(2);
  const { error, results } =
    args[0] === "down"
      ? await migrator.migrateDown()
      : await migrator.migrateUp();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

executeMigration();
