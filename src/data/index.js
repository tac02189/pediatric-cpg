// Guideline registry. Auto-discovers every module in ./guidelines/ via Vite's
// import.meta.glob, so adding a new guideline file is all it takes to register it
// — no edits here. Also builds the category grouping and the search index.

import { CATEGORIES, getCategory, categoryOrder } from "./categories.js";

const modules = import.meta.glob("./guidelines/*.js", { eager: true });

export const GUIDELINES = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => {
    const c = categoryOrder(a.category) - categoryOrder(b.category);
    return c !== 0 ? c : a.title.localeCompare(b.title);
  });

const BY_ID = Object.fromEntries(GUIDELINES.map((g) => [g.id, g]));

export function getGuideline(id) {
  return BY_ID[id] || null;
}

// Category -> guidelines, in taxonomy order, omitting empty categories.
export function guidelinesByCategory() {
  return CATEGORIES.map((cat) => ({
    category: cat,
    guidelines: GUIDELINES.filter((g) => g.category === cat.id),
  })).filter((group) => group.guidelines.length > 0);
}

// ---- search ----
const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SEARCH_INDEX = GUIDELINES.map((g) => {
  const cat = getCategory(g.category);
  return {
    id: g.id,
    haystack: normalize(
      [g.title, g.fullTitle, cat?.label, g.shortDescription, ...(g.keywords || [])].join(" ")
    ),
  };
});

/**
 * AND-of-tokens substring search. Returns guideline objects, best title matches
 * first. Empty query returns all guidelines (caller can group them).
 */
export function searchGuidelines(query) {
  const q = normalize(query);
  if (!q) return GUIDELINES;
  const tokens = q.split(" ");
  const hits = SEARCH_INDEX.filter((rec) => tokens.every((t) => rec.haystack.includes(t)));
  return hits.map((h) => BY_ID[h.id]);
}

// Dev-only: surface schema problems (dangling pointers, missing caps, orphan
// nodes) in the browser console as guidelines are authored.
if (import.meta.env.DEV) {
  import("./validateGuideline.js").then(({ validateAll }) => {
    const report = validateAll(GUIDELINES);
    let clean = true;
    for (const [id, r] of Object.entries(report)) {
      if (r.errors.length) {
        clean = false;
        console.error(`[validate:${id}] ERRORS`, r.errors);
      }
      if (r.warnings.length) {
        clean = false;
        console.warn(`[validate:${id}] warnings`, r.warnings);
      }
    }
    if (clean) console.info(`[validate] all ${GUIDELINES.length} guideline(s) OK`);
  });
}

// Every calculator across all guidelines, for the global calculators hub.
export function allCalculators() {
  const out = [];
  for (const g of GUIDELINES) {
    for (const [calcId, calc] of Object.entries(g.calculators || {})) {
      out.push({ guideline: g, calcId, calc });
    }
  }
  return out;
}
