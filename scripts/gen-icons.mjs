// One-off: rasterize public/icon-source.svg into the PWA PNG icons referenced by
// the manifest. Run with `node scripts/gen-icons.mjs` (requires sharp).
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pub = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const src = await readFile(join(pub, "icon-source.svg"));

const targets = [
  { size: 192, file: "pwa-192.png" },
  { size: 512, file: "pwa-512.png" },
  { size: 180, file: "apple-touch-icon.png" },
];

for (const { size, file } of targets) {
  await sharp(src, { density: 384 }).resize(size, size).png().toFile(join(pub, file));
  console.log(`wrote public/${file} (${size}×${size})`);
}
