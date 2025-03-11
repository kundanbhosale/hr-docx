import { db } from "@/_server/db";
import { sql } from "kysely";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request) {
  // Extract query parameter from the URL

  // Query the database for templates with search and scoring
  try {
    const url = new URL(request.url);
    const search = z
      .string()
      .trim()
      .toLowerCase()
      .parse(url.searchParams.get("query") || ""); // Default to empty string if no query provided
    console.log({ search });
    const result = await db
      .selectFrom("templates")
      .select((eb) => ["id", "slug", "title", "thumbnail"])
      .where("deleted_at", "is", null)
      .where((eb) =>
        eb.or([
          eb("templates.title", "ilike", `%${search}%`),
          sql<boolean>`similarity(templates.title, ${sql.val(search)}) >= 0.3`,
          sql<boolean>`templates.title % ${sql.val(search)}`,
        ])
      )
      // Order by the similarity score in descending order
      .orderBy(sql`similarity(templates.title, ${sql.val(search)})`, "desc")
      .limit(20)
      .execute();

    return NextResponse.json({ data: result, error: null });
  } catch (err) {
    return NextResponse.json({
      data: null,
      error: { message: "Failed to load templates" },
    });
  }
}
