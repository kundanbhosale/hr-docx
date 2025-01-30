"use server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

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
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
  });
  await browser.close();

  return Buffer.from(pdfBuffer).toString("base64");
}
