# Pediatric Clinical Practice Guidelines

A mobile-first, installable (PWA) navigator that turns the University of Missouri
Pediatric Service Line Clinical Practice Guidelines into guided, tap-through
interactive workflows with built-in scoring and weight-based dosing calculators.
The official source PDF is always one tap away.

> ⚠️ **Clinical safety.** Every guideline is transcribed from the official MU CPG
> and is a *convenience aid* — always verify against the source PDF. Guidelines
> ship as **DRAFT** (`verified: false`) until a physician spot-checks them.

## Run

Needs Node 22 or later (the test script passes a glob to Node's test runner).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # engine + guideline-data tests (Node's built-in runner)
npm run build      # production build into dist/ (runs the tests and the PDF check first)
npm run preview    # serve the production build locally
```

## Architecture — one engine, 18 data files

The app is a generic **workflow engine** that walks a graph of nodes defined in
plain data. Adding or editing a guideline is a **data-only** change — no React.

- `src/data/guidelines/*.js` — one object per guideline (auto-discovered via
  `import.meta.glob`). This is where all clinical content lives.
- `src/types.js` — the authoring contract (JSDoc typedefs).
- `src/engine/` — `scoring.js` (additive + rule-based), `dosing.js` (mg/kg with
  caps, ranges, weight/sex conditional tiers), `workflowReducer.js` (history
  stack → Back / breadcrumb / loops).
- `src/components/` — the data-driven UI (`NodeRenderer` switches on node type).
- `src/data/validateGuideline.js` — integrity checks. Errors (dangling pointers,
  missing fields or calculators) fail `npm test`, and so the build; warnings
  (unreachable nodes, missing footnotes, weight-based doses without a cap) are
  reported only. In dev both also print to the browser console.
- `tests/` — `engine.test.js` covers the reducer, weight entry, dose formulas and
  score answers. `guidelines.test.js` checks that:
  - every guideline passes the validator, and its `sourcePdf` is a file;
  - every dose uses only fields the engine reads, with usable numbers (a
    misspelled `maxMg` would otherwise be a dose with no cap);
  - every drug computes at every 0.01 kg from 0.5 to 150 kg, which is every
    weight a pound entry can produce;
  - every achievable total of an additive score has an interpretation, every
    score step using that score recommends a branch for it, and each of those
    branches is reachable.

  Rule-based scores are sampled: an outcome must never throw and must have a
  branch, but a branch the samples don't reach is reported for a person to
  check, not failed. The tests catch transcription slips, not clinical errors:
  a dose can be internally consistent and still wrong.
- `scripts/check-pdfs.mjs` — build-time guard: each `sourcePdf` written in a
  guideline file must exist in `public/pdfs/`, and no PDF there may exceed the
  6 MiB precache limit.
- `.github/workflows/ci.yml` — runs the build (and so the tests) on every push
  to `main` and every pull request. It never deploys.

### Editing or adding a guideline

1. Edit/create a file in `src/data/guidelines/` following an existing one
   (`croup.js` is the reference template).
2. Put the source PDF in `public/pdfs/` (filename must match `sourcePdf`).
3. Run `npm test` (the dev console prints the same validator findings). The
   build refuses to run while it fails. Then walk every branch against the PDF —
   the tests cannot check a value against its source.
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

Built with `vite-plugin-pwa`. The app shell, all guideline data, and every
source PDF are precached, so the whole app — each guideline's official PDF
included — works offline once the service worker has installed, normally
during the first visit. Each PDF is precached by its content, and its URL
carries a content hash (`?v=`, computed in `vite.config.js`), so a replaced PDF
reaches installed phones with the next app update, and the updated app is
never served the old copy. `check-pdfs.mjs` fails the build if a PDF is too
large to precache. Fonts are self-hosted
(`@fontsource`) so typography works offline. Test "Add to Home Screen" and
offline mode on a real device.

## Icons

PWA icons are generated from `public/icon-source.svg`:

```bash
node scripts/gen-icons.mjs   # regenerate pwa-192/512 + apple-touch-icon
```
