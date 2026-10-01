import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Workbox drops any file over this size from the precache with only a build
// warning; scripts/check-pdfs.mjs fails the build for an oversized PDF instead.
// Keep the two values in step.
const PRECACHE_LIMIT_BYTES = 6 * 1024 * 1024;

// A short content hash per source PDF, exposed to the app as __PDF_VERSIONS__.
// PdfButton appends it as ?v=, so a PDF's URL changes exactly when its bytes do.
// Computed when Vite starts — in dev, restart the server after replacing a PDF.
const pdfDir = fileURLToPath(new URL("./public/pdfs/", import.meta.url));
const pdfVersions = Object.fromEntries(
  readdirSync(pdfDir)
    .filter((f) => f.endsWith(".pdf"))
    .map((f) => [
      f,
      createHash("sha256").update(readFileSync(join(pdfDir, f))).digest("hex").slice(0, 12),
    ])
);

// Deployed at the domain root on Firebase Hosting -> base "/".
// HashRouter is used so deep links survive refresh with zero server config.
export default defineConfig({
  base: "/",
  define: {
    __PDF_VERSIONS__: JSON.stringify(pdfVersions),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-16.png", "favicon-32.png", "apple-touch-icon.png"],
      manifest: {
        name: "Pediatric Clinical Practice Guidelines",
        short_name: "Peds CPG",
        description:
          "University of Missouri Pediatric Service Line clinical practice guidelines as guided, tap-through workflows.",
        theme_color: "#1a1a1a",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache the app shell AND every source PDF, so each guideline's official
        // PDF opens offline from the first install — not only after it has been
        // viewed once while online. Workbox keys each precached file by a content
        // revision and re-downloads only the files whose bytes changed.
        globPatterns: ["**/*.{js,mjs,css,html,svg,png,woff2,pdf}"],
        // og-image is only fetched by external link-unfurlers — no need to
        // precache it into every user's offline cache.
        globIgnores: ["og-image.png"],
        // PDFs can exceed the default 2 MiB precache limit; bump it.
        maximumFileSizeToCacheInBytes: PRECACHE_LIMIT_BYTES,
        // PDF URLs carry ?v=<content hash> (PdfButton) to defeat plain HTTP caches.
        // The precache already holds exactly one revision of each PDF, so ignore v
        // when matching a request to it. (utm_ and fbclid are Workbox's defaults.)
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^v$/],
        // No runtime cache for /pdfs/ any more: every PDF is precached above. A
        // runtime CacheFirst could also have stored the SPA's index.html under a
        // missing PDF's URL. (The old "cpg-pdfs" cache on installed devices is
        // simply left unused.)
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.googleapis.com" ||
              url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});
