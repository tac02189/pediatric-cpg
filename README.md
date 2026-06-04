# Pediatric Clinical Practice Guidelines

A mobile-first, installable (PWA) navigator that turns the University of Missouri
Pediatric Service Line Clinical Practice Guidelines into guided, tap-through
interactive workflows with built-in scoring and weight-based dosing calculators.
The official source PDF is always one tap away.

> ⚠️ **Clinical safety.** Every guideline is transcribed from the official MU CPG
> and is a *convenience aid* — always verify against the source PDF. Guidelines
> ship as **DRAFT** (`verified: false`) until a physician spot-checks them.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/ (runs the PDF check first)
npm run preview    # serve the production build locally
```

## Architecture — one engine, 16 data files

The app is a generic **workflow engine** that walks a graph of nodes defined in
plain data. Adding or editing a guideline is a **data-only** change — no React.

- `src/data/guidelines/*.js` — one object per guideline (auto-discovered via
  `import.meta.glob`). This is where all clinical content lives.
- `src/types.js` — the authoring contract (JSDoc typedefs).
- `src/engine/` — `scoring.js` (additive + rule-based), `dosing.js` (mg/kg with
  caps, ranges, weight/sex conditional tiers), `workflowReducer.js` (history
  stack → Back / breadcrumb / loops).
- `src/components/` — the data-driven UI (`NodeRenderer` switches on node type).
- `src/data/validateGuideline.js` — dev-time integrity checks (run automatically
  in dev; problems print to the browser console).
- `scripts/check-pdfs.mjs` — build-time guard: every `sourcePdf` must exist in
  `public/pdfs/`.

### Editing or adding a guideline

1. Edit/create a file in `src/data/guidelines/` following an existing one
   (`croup.js` is the reference template).
2. Put the source PDF in `public/pdfs/` (filename must match `sourcePdf`).
3. The dev console prints validation errors (dangling pointers, missing dose
   caps, unreachable nodes). Walk every branch against the PDF.
4. After a physician confirms accuracy, set `verified: true` to drop the DRAFT
   ribbon.

Node types: `start`, `info`, `action`, `decision`, `branch`, `score`, `dosing`,
`checklist`, `lookup`, `reference`, `outcome`. Calculators are defined once per
guideline and referenced by id (so they appear both inline and in the
per-guideline / global **Calculators** hubs).

## Deploy (Firebase Hosting)

```bash
firebase login
# create / select the Firebase project named in .firebaserc (pediatric-cpg)
npm run deploy     # build + firebase deploy --only hosting
```

`firebase.json` sets SPA rewrites and cache headers (long cache for hashed
assets, short cache for PDFs and `index.html` so re-issued guidelines
propagate). Routing uses `HashRouter`, so deep links survive refresh with no
server config.

## PWA / offline

Built with `vite-plugin-pwa`. The app shell + all guideline data are precached
(works fully offline after first load); source PDFs are cached on first view.
Fonts are self-hosted (`@fontsource`) so typography works offline. Test
"Add to Home Screen" and offline mode on a real device.

## Icons

PWA icons are generated from `public/icon-source.svg`:

```bash
node scripts/gen-icons.mjs   # regenerate pwa-192/512 + apple-touch-icon
```
