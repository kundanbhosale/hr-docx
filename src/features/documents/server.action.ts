"use server";

import { db } from "@/_server/db";
import { action } from "@/lib/error";
import {
  generateDocumentSchema,
  GenerateDocumentSchema,
  singleDocumentSchema,
  SingleDocumentSchema,
} from "./schema";
import { Documents } from "@/_server/db/types";
import { hasPermission } from "../auth/server/actions";
import { Selectable } from "kysely";

export const generateDocument = async (props: GenerateDocumentSchema) => {
  const { template } = generateDocumentSchema.parse(props);
  const { session, user } = await hasPermission(
    {
      permission: {
        documents: ["create"],
      },
    },
    "external"
  );
  const templateData = await db
    .selectFrom("templates")
    .selectAll()
    .where("slug", "=", template)
    .executeTakeFirstOrThrow();

  return {
    id: "new",
    content: templateData.content,
    created_by: user.id,
    downloads: 0,
    org: session.activeOrganizationId!,
    template: templateData.id,
    title: templateData.title,
    schema: templateData.schema,
    starred: false,
    deleted_at: null,
    template_version: templateData.template_version,
    created_at: new Date().toISOString() as any,
    updated_at: new Date().toISOString() as any,
  } satisfies Selectable<Documents>;
};

export const getSingleDocument = action(
  async (props: SingleDocumentSchema & GenerateDocumentSchema) => {
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
      return await generateDocument(props);
    }
  }
);
