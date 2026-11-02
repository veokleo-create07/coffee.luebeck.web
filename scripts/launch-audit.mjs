import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3010";
const outputDir = path.resolve(process.env.AUDIT_OUTPUT_DIR ?? "test-results/launch-audit");
const viewports = [320, 375, 390, 430, 768, 1024, 1440, 1920];
const routes = ["/", "/en", "/faq", "/en/faq", "/menu", "/en/menu", "/reservation", "/en/reservation", "/impressum", "/en/legal-notice", "/datenschutz", "/en/privacy"];
const screenshotWidths = new Set([390, 768, 1440]);
const results = [];

await fs.mkdir(outputDir, { recursive: true });

function safeName(value) {
  return value.replace(/^\//, "home").replaceAll("/", "-") || "home";
}

async function checkPage(browser, route, width) {
  const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(250);
  await page.waitForTimeout(250);
  let diagnostics;
  try {
    diagnostics = await page.evaluate(() => ({
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      title: document.title,
      lang: document.documentElement.lang,
      heroVideoPaused: document.querySelector("[data-matcha-video]")?.paused ?? null,
    }));
  } catch {
    await page.waitForTimeout(500);
    diagnostics = await page.evaluate(() => ({
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      title: document.title,
      lang: document.documentElement.lang,
      heroVideoPaused: document.querySelector("[data-matcha-video]")?.paused ?? null,
    }));
  }
  if (screenshotWidths.has(width) && (route === "/" || route === "/en" || route === "/faq" || route === "/en/faq" || route === "/reservation" || route === "/en/reservation")) {
    await page.screenshot({ path: path.join(outputDir, `${safeName(route)}-${width}.png`), fullPage: true });
  }
  results.push({ route, width, status: response?.status() ?? 0, ...diagnostics, consoleErrors });
  await page.close();
}

const browser = await chromium.launch({ headless: true });
if (!process.env.AUDIT_INTERACTIONS_ONLY) {
  for (const width of viewports) {
    for (const route of routes) await checkPage(browser, route, width);
  }
}

async function interactionChecks() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${baseURL}/en`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await page.locator('button[aria-controls="navigation-menu"]').click();
  await page.locator("#navigation-menu").waitFor({ state: "visible", timeout: 10000 });
  const menuLinks = await page.locator("#navigation-menu a").evaluateAll((links) => links.map((link) => ({ text: link.textContent?.trim(), href: link.getAttribute("href") })));
  await page.locator("#navigation-menu a").nth(3).click({ force: true });
  await page.waitForLoadState("domcontentloaded");
  const faqRow = page.locator("button[aria-controls^='faq-answer-']").first();
  await faqRow.click();
  const faqExpanded = await faqRow.getAttribute("aria-expanded");
  await page.goto(`${baseURL}/en/reservation`, { waitUntil: "domcontentloaded" });
  const reservationStep1 = await page.locator("#visit-date").count();
  await page.locator("#visit-date").fill("2026-11-02");
  await page.waitForTimeout(100);
  const mondayMessage = await page.getByRole("status").first().textContent().catch(() => null);
  await page.screenshot({ path: path.join(outputDir, "reservation-monday-390.png"), fullPage: true });
  await page.goto(`${baseURL}/en`, { waitUntil: "domcontentloaded" });
  await page.close();
  return { menuLinks, faqExpanded, reservationStep1, mondayMessage, consoleErrors: errors };
}

const interactions = await interactionChecks();
await browser.close();
await fs.writeFile(path.join(outputDir, "results.json"), JSON.stringify({ baseURL, viewports, routes, results, interactions }, null, 2));
console.log(JSON.stringify({ outputDir, pages: results.length, interactions }, null, 2));
