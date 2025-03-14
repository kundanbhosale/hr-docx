"use server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import { getHost } from "@/lib/headers";
import { hasPermission } from "../auth/server/actions";
import { db } from "@/_server/db";
import { sql } from "kysely";
import { action, ClientError } from "@/lib/error";

async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.NODE_ENV === "development"
        ? "/opt/homebrew/bin/chromium"
        : await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar`
          ),
    headless: true,
  });
}

export const createPDF = action(async (html: string) => {
  const { session } = await hasPermission({
    permission: {
      documents: ["read"],
    },
  });

  const org = await db
    .selectFrom("orgs.list")
    .where("id", "=", session.activeOrganizationId!)
    .selectAll()
    .executeTakeFirstOrThrow();

  if (org.metadata.credits.download <= 0)
    throw new ClientError("No credits left");

  const browser = await getBrowser();
  const page = await browser.newPage();
  const url = (await getHost()) + "/editor.css";
  await page.setContent(
    `<div class="-tiptap-editor"><div class="ProseMirror">${html}</div></div>`,
    {
      waitUntil: "networkidle0",
    }
  );

  await page.evaluate(async (url: string) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;

    const promise = new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
    });

    document.head.appendChild(link);
    await promise;
  }, url);

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
  });
  await browser.close();
  const creditsLeft =
    (org.metadata.credits && Number(org.metadata.credits) - 1) || 0;
  await db
    .updateTable("orgs.list")
    .set({
      metadata: sql`jsonb_set(metadata, '{credits,download}', ${sql.val(
        creditsLeft <= 0 ? 0 : creditsLeft
      )}::jsonb)`,
    })
    .where("id", "=", session.activeOrganizationId!)
    .execute();

  return Buffer.from(pdfBuffer).toString("base64");
});
