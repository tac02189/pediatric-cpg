// Every guideline module, loaded the way src/data/index.js loads them in the app —
// which it does with Vite's import.meta.glob, unavailable under plain Node.
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DIR = new URL("../src/data/guidelines/", import.meta.url);

export async function loadGuidelines() {
  const files = readdirSync(fileURLToPath(DIR))
    .filter((f) => f.endsWith(".js"))
    .sort();
  return Promise.all(
    files.map(async (file) => ({ file, module: await import(new URL(file, DIR).href) }))
  );
}
