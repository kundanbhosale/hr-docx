import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createSchema("auth").ifNotExists().execute();
  await db.schema
    .createTable("auth.user")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("emailVerified", "timestamptz")
    .addColumn("image", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable("auth.account")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("userId", "uuid", (col) =>
      col.references("auth.user.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable("auth.session")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("userId", "uuid", (col) =>
      col.references("auth.user.id").onDelete("cascade").notNull()
    )
    .addColumn("sessionToken", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("auth.verification_token")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("Account_userId_index")
    .on("auth.account")
    .column("userId")
    .execute();

  await db.schema
    .createIndex("Session_userId_index")
    .on("auth.session")
    .column("userId")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("auth.account").ifExists().execute();
  await db.schema.dropTable("auth.session").ifExists().execute();
  await db.schema.dropTable("auth.user").ifExists().execute();
  await db.schema.dropTable("auth.verification_token").ifExists().execute();
}
