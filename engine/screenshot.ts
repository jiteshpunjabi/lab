#!/usr/bin/env npx tsx
// CLI: npx tsx engine/screenshot.ts <html-path> [output-png-path]
// Screenshots an HTML file using headless Chromium and saves as PNG.

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

const htmlPath = process.argv[2];
const outputPath = process.argv[3];

if (!htmlPath) {
  console.error("Usage: npx tsx engine/screenshot.ts <html-path> [output-png-path]");
  process.exit(1);
}

const absolutePath = path.resolve(htmlPath);
if (!fs.existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`);
  process.exit(1);
}

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

await page.goto(`file://${absolutePath}`, {
  waitUntil: "domcontentloaded",
  timeout: 15000,
}).catch(() => {});

// Simulate mouse in center for interactive experiments
await page.mouse.move(640, 360);

// Wait for rendering
await new Promise((r) => setTimeout(r, 5000));

const buffer = await page.screenshot({ type: "png" });
const buf = Buffer.from(buffer);

const out = outputPath
  ? path.resolve(outputPath)
  : absolutePath.replace(/\.html$/, ".png");

fs.writeFileSync(out, buf);
console.log(out);

await browser.close();
