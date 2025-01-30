"use server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

import { getHost } from "@/lib/host";

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

export async function createPDF(html: string) {
  const browser = await getBrowser();
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   executablePath:
  //     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  // });

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
  return Buffer.from(pdfBuffer).toString("base64");
}
