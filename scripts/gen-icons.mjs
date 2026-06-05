// Generate all app icons from assets/icon-source.png (the Mizzou tiger clinician).
// Run with `node scripts/gen-icons.mjs` (requires sharp). Outputs into public/.
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets", "icon-source.png");
const pub = join(root, "public");
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 }; // matches the icon's own background

// Full-bleed square icons — the source already carries its own margin.
const square = [
  { size: 192, file: "pwa-192.png" },
  { size: 512, file: "pwa-512.png" },
  { size: 180, file: "apple-touch-icon.png" },
  { size: 32, file: "favicon-32.png" },
  { size: 16, file: "favicon-16.png" },
];
for (const { size, file } of square) {
  await sharp(src).resize(size, size, { fit: "cover" }).png().toFile(join(pub, file));
  console.log(`wrote public/${file} (${size}x${size})`);
}

// Maskable icon: shrink to the ~80% safe zone on a black canvas so launcher
// circle/squircle masks don't clip the tiger's ears or the book.
{
  const size = 512;
  const inner = Math.round(size * 0.8);
  const resized = await sharp(src)
    .resize(inner, inner, { fit: "contain", background: BLACK })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BLACK } })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(join(pub, "pwa-maskable-512.png"));
  console.log("wrote public/pwa-maskable-512.png (512x512, maskable safe-zone)");
}

// Social share image for link previews (og:image / twitter:image): 1200x630,
// tiger centered on black.
{
  const w = 1200,
    h = 630;
  const inner = Math.round(h * 0.86);
  const resized = await sharp(src)
    .resize(inner, inner, { fit: "contain", background: BLACK })
    .toBuffer();
  await sharp({ create: { width: w, height: h, channels: 4, background: BLACK } })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(join(pub, "og-image.png"));
  console.log("wrote public/og-image.png (1200x630)");
}

console.log("done.");
