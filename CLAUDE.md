# Pediatric Clinical Practice Guidelines — project instructions

Extends the root `CLAUDE.md` (`$OneDrive/[3] Claude/CLAUDE.md`); read both. The
README covers running, architecture and authoring a guideline. This file holds
what a session must not get wrong.

## What it is

A mobile-first PWA that turns the University of Missouri Pediatric Service Line
CPGs into tap-through workflows with scoring and weight-based dosing. Residents
use it at the bedside, so treat any change under `src/data/guidelines/` or
`src/engine/` as a clinical change.

| | |
|---|---|
| Live | https://pediatric-cpg.web.app — Firebase project and site `pediatric-cpg`, Hosting only (no Firebase SDK in the app) |
| Repo | https://github.com/tac02189/pediatric-cpg (public), `main` |
| Deploy | `npm run deploy` = `npm run build` (tests → PDF check → `vite build`) + `firebase deploy --only hosting` |
| Verify a deploy | Compare the live `index-*.js`, CSS and `sw.js` with `dist/` by sha256. "Deploy complete" is not verification |
| Preview | `.claude/launch.json`: `dev` (5173) and `preview` (4173), both through `.claude/npm-run.cjs` |

## Clinical content

- Each guideline is a data file in `src/data/guidelines/`, auto-discovered. Its
  doses, thresholds and wording are transcribed from its PDF in `public/pdfs/`.
  The originals at the folder root are gitignored.
- A guideline ships as a DRAFT (`verified: false`) until a physician has checked
  it against the PDF. As of 2026-10-01, DKA and Asthma are drafts; `asthma.js`
  lists its open transcription questions at the top.
- Never change a dose, cutoff, band or branch without the source in hand. Neither
  the tests nor a peer review can confirm a clinical value; flag it for a human
  (root `CLAUDE.md`, Codex rules).
- `npm test` must pass before a commit, and the build refuses to run while it
  fails. Validator warnings don't fail it. Some, such as "weight-based drug
  without a max cap", can be faithful to the PDF, so never invent a value to
  silence one.

## Invariants — each was a deliberate decision; don't undo one silently

- **Weight entry** (`src/engine/dosing.js`, `WeightInput.jsx`): the typed text
  and unit are stored, and `entryToKg` derives the dosing weight. Kilograms are
  used exactly as typed. Pounds convert at 0.45359237 and round to 0.01 kg, so
  the kg shown is the kg dosed. The accepted range is 0.5–150 kg. In pounds it
  is 1.1–330.7 lb: the outermost 0.1-lb entries whose rounded dosing weight
  falls inside that range. Thiago signed this off on 2026-10-01.
- **Doses show their math.** The formula prints the exact weight used, a
  weight-based dose always applies the guideline's cap and floor (a fixed dose
  has none), and a weight-tiered rule never picks a tier without a valid weight.
- **Score answers are option indices, not points** (`selectionsFromChoices`).
  Options can share point values; PRAS respiratory rate has four age bands.
- **Reassessments start blank.** Moving forward onto a score step clears that
  calculator's answers and its recorded score (`advance()` in
  `GuidelineSession.jsx` sends `ADVANCE` with `freshCalcId`). Back and the
  breadcrumb restore each step's saved snapshot. Asthma's PRAS is used at 5
  steps and croup's Westley at 2. Thiago's decision, 2026-10-01.
- **One session per guideline.** `GuidelineSession` is the parent route of the
  pathway and of its Calculators page, so both share one patient. Restart offers
  New patient or Same patient.
- **PDFs** carry `?v=<content hash>` (`__PDF_VERSIONS__`, computed in
  `vite.config.js`). The service worker precaches every PDF and ignores `?v=`
  when matching. `scripts/check-pdfs.mjs` fails the build if a `sourcePdf`
  written in a guideline file is missing, or a PDF in `public/pdfs/` exceeds
  6 MiB; keep that limit in step with `PRECACHE_LIMIT_BYTES` in
  `vite.config.js`. The tests also check every loaded guideline's `sourcePdf`.
- **PDF viewer history** (`src/components/shared/PdfButton.jsx`): the policy in
  its comment block came out of five Codex review rounds and one Gemini round
  (2026-10-01). Thiago accepted one remaining risk: a browser that delays a
  requested Back by more than 1.5 s, masked by the user's own Back and followed
  by a reopen and close, can step back twice. Don't propose "one requested Back
  per session" again unless he asks. Any change to this file needs a peer
  review, with its scenarios re-run in the browser.

## Testing

- `npm test` uses Node's built-in runner and needs no dependencies.
  - `tests/engine.test.js` covers the reducer, weight entry, dose formulas and
    score answers.
  - `tests/guidelines.test.js` runs the validator and checks each `sourcePdf`
    is a file. It checks that every dose uses only the fields `dosing.js` reads,
    with usable numbers, since a misspelled `maxMg` is a dose with no cap. It
    computes every drug at every 0.01 kg from 0.5 to 150 kg, which is every
    weight a pound entry can produce. It checks that every achievable total of
    an additive score has an interpretation, that every score step using that
    score recommends a branch for it, and that each such branch is reachable.
  - Rule-based scores are sampled. An outcome must never throw and must have a
    branch, but a branch the samples don't reach is only reported ("check by
    hand"), because samples can miss an outcome that needs a narrow input.
  - Every calculator must be a kind the tests know (`dosing`, or `score` with
    an `additive` or `rule` engine), used by steps of the same kind, so a new
    kind fails loudly instead of going unchecked. A new dose field fails the
    same way. Extend the tests along with the engine.
- These tests catch transcription slips, not clinical errors: a dose can be
  internally consistent and still wrong.
- CI (`.github/workflows/ci.yml`) runs `npm ci` and `npm run build` on pushes to
  `main` and on pull requests. It never deploys.
- UI behaviour has no automated tests, so verify it in the preview. React
  StrictMode is on, so effects run twice in dev; the PDF viewer reuses its
  history entry for exactly that reason.
