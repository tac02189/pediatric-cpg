import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Deployed at the domain root on Firebase Hosting -> base "/".
// HashRouter is used so deep links survive refresh with zero server config.
export default defineConfig({
  base: "/",
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
        // Cache the app shell + the source guideline PDFs for offline bedside use.
        globPatterns: ["**/*.{js,mjs,css,html,svg,png,woff2}"],
        // og-image is only fetched by external link-unfurlers — no need to
        // precache it into every user's offline cache.
        globIgnores: ["og-image.png"],
        // PDFs can exceed the default 2 MiB precache limit; bump it.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/pdfs/"),
            handler: "CacheFirst",
            options: {
              cacheName: "cpg-pdfs",
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
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
