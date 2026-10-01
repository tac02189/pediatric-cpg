#!/usr/bin/env node
// Build-time guard: every guideline data file references a `sourcePdf`, and that
// file must actually exist under public/pdfs/. A missing source PDF would let a
// clinician reach a transcribed dose with no way to verify it against the chart —
// so we fail the build rather than ship that.
//
// Decoupled from the React data layer on purpose: scans the guideline source
// files with a regex so it runs in plain Node with no bundler.

import { readdir, readFile, access, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const guidelinesDir = join(root, "src", "data", "guidelines");
const pdfsDir = join(root, "public", "pdfs");

// Every PDF is precached by the service worker so it opens offline. Workbox
// skips a file over maximumFileSizeToCacheInBytes with only a build warning,
// which would quietly make that PDF unavailable offline again — so fail here
// instead. Keep in step with PRECACHE_LIMIT_BYTES in vite.config.js.
const PRECACHE_LIMIT_BYTES = 6 * 1024 * 1024;

const exists = (p) =>
  access(p).then(
    () => true,
    () => false
  );

async function main() {
  if (!(await exists(guidelinesDir))) {
    console.log("[check-pdfs] No guideline data yet — skipping.");
    return;
  }

  const files = (await readdir(guidelinesDir)).filter(
    (f) => f.endsWith(".js") && f !== "index.js"
  );

  const missing = [];
  let referenced = 0;

  for (const file of files) {
    const src = await readFile(join(guidelinesDir, file), "utf8");
    const matches = [...src.matchAll(/sourcePdf:\s*["'`]([^"'`]+)["'`]/g)];
    for (const m of matches) {
      referenced += 1;
      const pdf = m[1];
      if (!(await exists(join(pdfsDir, pdf)))) {
        missing.push({ file, pdf });
      }
    }
  }

  if (missing.length) {
    console.error("\n[check-pdfs] FAILED — referenced PDFs not found in public/pdfs/:");
    for (const { file, pdf } of missing) {
      console.error(`  • ${pdf}  (referenced by ${file})`);
    }
    console.error("");
    process.exit(1);
  }

  const pdfs = (await readdir(pdfsDir)).filter((f) => f.endsWith(".pdf"));
  const tooBig = [];
  for (const pdf of pdfs) {
    const { size } = await stat(join(pdfsDir, pdf));
    if (size > PRECACHE_LIMIT_BYTES) tooBig.push({ pdf, size });
  }

  if (tooBig.length) {
    console.error("\n[check-pdfs] FAILED — PDFs too large to precache for offline use:");
    for (const { pdf, size } of tooBig) {
      console.error(`  • ${pdf}  (${(size / 1048576).toFixed(1)} MB > ${PRECACHE_LIMIT_BYTES / 1048576} MB)`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(
    `[check-pdfs] OK — ${referenced} sourcePdf reference(s) all resolve; ` +
      `${pdfs.length} PDF(s) fit the offline precache.`
  );
}

main().catch((err) => {
  console.error("[check-pdfs] error:", err);
  process.exit(1);
});
