"use server";

import { db } from "@/_server/db";
import { action, ClientError } from "@/lib/error";
import {
  allDocumentsSchema,
  AllDocumentsSchema,
  createDocumentSchema,
  CreateDocumentSchema,
  generateDocumentSchema,
  GenerateDocumentSchema,
  singleDocumentSchema,
  updateDocumentSchema,
  UpdateDocumentSchema,
} from "./schema";
import { Documents, Templates } from "@/_server/db/types";
import { hasPermission } from "../auth/server/actions";
import { Expression, Selectable, sql, SqlBool } from "kysely";
import { randomUUID } from "crypto";
import { redirect, RedirectType } from "next/navigation";

export const generateDocument = async (props: GenerateDocumentSchema) => {
  const { template } = generateDocumentSchema.parse(props);

  const templateData = await db
    .selectFrom("templates")
    .selectAll()
    .where("slug", "=", template)
    .executeTakeFirstOrThrow();

  return {
    id: "new",
    content: templateData.content,
    created_by: "",
    downloads: 0,
    org: "",
    template: templateData.id,
    title: templateData.title,
    schema: templateData.schema,
    starred: false,
    deleted_at: null,
    template_version: templateData.template_version,
    created_at: new Date().toISOString() as any,
    updated_at: new Date().toISOString() as any,
    thumbnail: null,
  } satisfies Selectable<Documents>;
};

export const getSingleDocument = action(
  async (props: { id?: string; template?: string }) => {
    const { id } = singleDocumentSchema.parse(props);

    if (id && id !== "new") {
      await hasPermission({
        permission: {
          documents: ["read"],
        },
      });
      const document = await db
        .selectFrom("documents")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirstOrThrow();
      return document as Selectable<Documents>;
    } else {
      if (!props.template) throw new ClientError("No template provided");
      return await generateDocument({ template: props.template });
    }
  }
);

export const getAllDocuments = action(async (params: AllDocumentsSchema) => {
  const { search } = allDocumentsSchema.parse(params);
  const { session } = await hasPermission({
    permission: {
      documents: ["read"],
    },
  });

  const data = await db
    .selectFrom("documents")
    .select((eb) => [
      sql<Documents>`to_jsonb(documents)`.as("document"),
      sql<Templates>`to_jsonb(templates)`.as("template"),
    ])
    .where("org", "=", session.activeOrganizationId!)
    .innerJoin("templates", "templates.id", "documents.template")

    .where((eb) => {
      const filters: Expression<SqlBool>[] = [];

      if (search) {
        const searchConditions = [eb("title", "ilike", `%${search!}%`)];

        filters.push(eb.or(searchConditions));
      }
      return eb.and(filters);
    })

    .execute();
  return data;
});

export const createDocument = async (props: CreateDocumentSchema) => {
  const { template, schema, content, title, thumbnail } =
    createDocumentSchema.parse(props);

  const { session, user } = await hasPermission({
    permission: {
      documents: ["create"],
    },
  });

  const templateData = await db
    .selectFrom("templates")
    .selectAll()
    .where("id", "=", template)
    .executeTakeFirstOrThrow();

  const data = await db
    .insertInto("documents")
    .values({
      id: randomUUID(),
      title,
      schema,
      content,
      thumbnail,
      starred: false,
      org: session.activeOrganizationId!,
      created_by: user.id,
      updated_at: sql`now()`,
      downloads: 0,
      template: templateData.id,
      template_version: templateData.template_version,
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  return redirect(data.id, RedirectType.replace);
};

export const updateDocument = async (props: UpdateDocumentSchema) => {
  const { id, ...rest } = updateDocumentSchema.parse(props);

  await hasPermission({
    permission: {
      documents: ["update"],
    },
  });

  await db
    .updateTable("documents")
    .where("id", "=", id)
    .set({ ...rest, updated_at: sql`now()` })
    .execute();
  return true;
};
