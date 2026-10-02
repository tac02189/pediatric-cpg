// Every guideline's data, exercised the way a resident would: the validator's
// integrity rules, every drug at every weight a pound entry can produce, and
// every score total reaching an interpretation and a recommended branch. These
// catch transcription slips the validator can't (a dose that prints NaN, a gap
// between score bands); they cannot tell whether a dose or threshold matches the
// source PDF.
import { test } from "node:test";
import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadGuidelines } from "./load-guidelines.js";
import { validateGuideline } from "../src/data/validateGuideline.js";
import { computeDrug, WEIGHT_MIN_KG, WEIGHT_MAX_KG } from "../src/engine/dosing.js";
import { bandForTotal, groupForBand, evaluateScore } from "../src/engine/scoring.js";
import { branchForScore } from "../src/engine/resolveNext.js";

const loaded = await loadGuidelines();
const guidelines = loaded.map((l) => l.module.default).filter(Boolean);
const PDF_DIR = fileURLToPath(new URL("../public/pdfs/", import.meta.url));

// Engine-generated text (computed doses, rule results) must never leak a broken
// value. Source text (labels, display-only doses) only has to be present.
const present = (s) => typeof s === "string" && s.trim() !== "";
const leaks = (s) => !present(s) || /\b(NaN|undefined|null|Infinity)\b/.test(s);

const calculators = (kind) =>
  guidelines.flatMap((g) =>
    Object.entries(g.calculators || {})
      .filter(([, c]) => kind(c))
      .map(([cid, calc]) => ({ g, cid, calc }))
  );
const isAdditive = (c) => c.kind === "score" && c.engine !== "rule";
const isRule = (c) => c.kind === "score" && c.engine === "rule";
const scoreSteps = (g, calcId) =>
  Object.values(g.nodes || {}).filter((n) => n.type === "score" && n.calculatorId === calcId);
// A score step's branches that a result can recommend (others are manual choices).
const routedBranches = (n) => (n.branches || []).filter((b) => b.group != null || b.bandId != null);

test("every guideline file exports a guideline, each with a unique id", () => {
  assert.ok(loaded.length > 0, "no guideline files found — every data test below would pass vacuously");
  const missing = loaded.filter((l) => !l.module.default).map((l) => l.file);
  assert.deepEqual(missing, [], "a file without a default export is silently left out of the app");
  const ids = guidelines.map((g) => g.id);
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], "duplicate guideline ids");
});

const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

test("every guideline's source PDF is a file in public/pdfs/", () => {
  const failures = guidelines
    .filter((g) => !(typeof g.sourcePdf === "string" && /^[^/\\]+\.pdf$/.test(g.sourcePdf) && isFile(PDF_DIR + g.sourcePdf)))
    .map((g) => `${g.id}: ${JSON.stringify(g.sourcePdf)}`);
  assert.deepEqual(failures, [], "a missing PDF leaves a transcribed dose with no source to check it against");
});

test("every calculator is a kind these tests check, used by steps of the same kind", () => {
  // So a renamed kind or engine fails here instead of being skipped below, and a
  // score step can't point at a dosing calculator that no score test examines.
  const failures = [];
  for (const g of guidelines) {
    for (const [cid, c] of Object.entries(g.calculators || {})) {
      if (!(c.kind === "dosing" || (c.kind === "score" && [undefined, "additive", "rule"].includes(c.engine)))) {
        failures.push(`${g.id}/${cid}: kind ${JSON.stringify(c.kind)}, engine ${JSON.stringify(c.engine)}`);
      }
    }
    for (const n of Object.values(g.nodes || {})) {
      const c = g.calculators?.[n.calculatorId];
      if ((n.type === "score" || n.type === "dosing") && c && c.kind !== n.type) {
        failures.push(`${g.id}/${n.id}: a ${n.type} step uses ${n.calculatorId}, a ${c.kind} calculator`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

// The dose fields the engine reads (src/engine/dosing.js). Anything else is a typo
// the engine would silently ignore — a misspelled maxMg is a dose with no cap.
const PER_KG = ["mgPerKg", "mcgPerKg"];
const AMOUNTS = ["maxMg", "maxMcg", "minMg", "minMcg", "flatMg", "flatMcg", "concentrationMgPerMl"];
// JSON, except NaN and Infinity print as themselves rather than as null.
const show = (v) => JSON.stringify(v, (_, x) => (typeof x === "number" && !Number.isFinite(x) ? String(x) : x));

test("every dose uses only fields the engine reads, with usable numbers", () => {
  const failures = [];
  for (const { g, cid, calc } of calculators((c) => c.kind === "dosing")) {
    for (const drug of calc.drugs || []) {
      const specs = [["dose", drug.dose], ...(drug.rules || []).map((r, i) => [`rule ${i + 1} dose`, r.dose])];
      for (const [which, dose] of specs) {
        if (dose == null) continue;
        const where = `${g.id}/${cid}/${drug.name} ${which}`;
        for (const [key, v] of Object.entries(dose)) {
          if (PER_KG.includes(key)) {
            const ends = Array.isArray(v) ? v : [v];
            const ok = (ends.length === 1 || ends.length === 2) && ends.every((x) => Number.isFinite(x) && x > 0);
            if (!ok || (ends.length === 2 && ends[0] > ends[1])) failures.push(`${where}: ${key} ${show(v)}`);
          } else if (AMOUNTS.includes(key)) {
            if (!(Number.isFinite(v) && v > 0)) failures.push(`${where}: ${key} ${show(v)}`);
          } else if (key === "frequency") {
            if (!present(v)) failures.push(`${where}: frequency ${show(v)}`);
          } else {
            failures.push(`${where}: unknown field "${key}" — the engine ignores it`);
          }
        }
      }
    }
  }
  assert.deepEqual(failures, []);
});

test("every guideline passes the validator", (t) => {
  const errors = [];
  for (const g of guidelines) {
    const r = validateGuideline(g);
    for (const e of r.errors) errors.push(`${g.id}: ${e}`);
    // Warnings are hygiene, not safety: reported, never fatal. Some, such as a
    // weight-based drug without a max cap, can be faithful to the source PDF.
    for (const w of r.warnings) t.diagnostic(`warning — ${g.id}: ${w}`);
  }
  assert.deepEqual(errors, []);
});

// The drug or matched rule computeDrug used — the same first-match lookup.
function selectedSpec(drug, ctx) {
  if (!Array.isArray(drug.rules)) return drug;
  return drug.rules.find((r) => {
    try {
      return r.when(ctx);
    } catch {
      return false;
    }
  });
}

test("every drug gives a dose, or its own source text, at every 0.01 kg from 0.5 to 150 kg", (t) => {
  // 0.01 kg is the grid every pound entry lands on, so this is every weight a
  // pound entry can produce, and every kg entry to two decimals.
  const failures = [];
  let evaluations = 0;
  for (const { g, cid, calc } of calculators((c) => c.kind === "dosing")) {
    if (!(calc.drugs || []).length) failures.push(`${g.id}/${cid}: a dosing calculator with no drugs`);
    // A calculator that asks for sex always gets one; otherwise try without too.
    const sexes = (calc.inputs || []).includes("sex") ? ["male", "female"] : [undefined, "male", "female"];
    for (const drug of calc.drugs || []) {
      for (const sex of sexes) {
        const problems = new Map(); // reason -> weights it occurred at
        const note = (reason, kg) => problems.set(reason, [...(problems.get(reason) || []), kg]);
        for (let centi = Math.round(WEIGHT_MIN_KG * 100); centi <= Math.round(WEIGHT_MAX_KG * 100); centi++) {
          const weightKg = centi / 100;
          evaluations++;
          let r;
          try {
            r = computeDrug(drug, { weightKg, sex });
          } catch (e) {
            note(`threw ${e.message}`, weightKg);
            continue;
          }
          if (r.needsWeight) note("asked for the weight it was given", weightKg);
          else if (r.unmatched) note("no dosing rule matched", weightKg);
          else if (r.displayOnly) {
            // Without text of its own, a drug with no computable dose falls back to
            // the engine's "See guideline": a gap in the data, not a dose.
            if (!present(r.text) || !present(selectedSpec(drug, { weightKg, sex })?.displayDose)) {
              note(`no dose and no text of its own (${JSON.stringify(r.text)})`, weightKg);
            }
          } else {
            const c = r.computed;
            if (!c || leaks(c.text) || !/\d/.test(c.text) || leaks(c.formula) || (c.volume != null && leaks(c.volume))) {
              note(`broken output ${JSON.stringify(c)}`, weightKg);
            }
          }
        }
        for (const [reason, kgs] of problems) {
          const at = kgs.length === 1 ? `${kgs[0]} kg` : `${kgs.length} weights, ${kgs[0]}–${kgs.at(-1)} kg`;
          failures.push(`${g.id}/${cid}/${drug.name}${sex ? ` (${sex})` : ""}: ${reason} — at ${at}`);
        }
      }
    }
  }
  t.diagnostic(`${evaluations} dose evaluations`);
  assert.deepEqual(failures, []);
});

// Every total the items can add up to, one option per item.
function achievableTotals(calc) {
  let totals = new Set([0]);
  for (const item of calc.items || []) {
    const next = new Set();
    for (const total of totals) for (const o of item.options || []) next.add(total + o.value);
    totals = next;
  }
  return [...totals].sort((a, b) => a - b);
}

test("every score total has an interpretation, and every score step recommends a branch for it", (t) => {
  const failures = [];
  let totals = 0;
  for (const { g, cid, calc } of calculators(isAdditive)) {
    for (const item of calc.items || []) {
      if (!item.options?.length) failures.push(`${g.id}/${cid}: item "${item.id}" has no options`);
      for (const o of item.options || []) {
        if (!Number.isFinite(o.value)) failures.push(`${g.id}/${cid}: "${item.id}" option "${o.label}" has no points`);
      }
    }
    const steps = scoreSteps(g, cid);
    const recommended = new Map(steps.map((n) => [n, new Set()]));
    for (const total of achievableTotals(calc)) {
      totals++;
      const band = bandForTotal(calc, total);
      if (!band || !present(band.label)) {
        failures.push(`${g.id}/${cid}: total ${total} has no interpretation${band ? ` (band "${band.id}" has no label)` : ""}`);
        continue;
      }
      const evaluation = { complete: true, total, band, groupId: groupForBand(calc, band) };
      for (const n of steps) {
        const b = branchForScore(n, evaluation);
        if (b) recommended.get(n).add(b);
        else failures.push(`${g.id}/${n.id}: no branch recommended for ${cid} total ${total} (${band.label})`);
      }
    }
    for (const [n, hit] of recommended) {
      for (const b of routedBranches(n)) {
        if (!hit.has(b)) failures.push(`${g.id}/${n.id}: branch "${b.label}" is never recommended by any ${cid} total`);
      }
    }
  }
  t.diagnostic(`${totals} achievable score totals`);
  assert.deepEqual(failures, []);
});

// Each criterion unanswered, or at a spread of representative values. Samples can
// miss an outcome that needs a narrow input, so only what holds for every input is
// fatal (never throwing; a branch for every outcome produced). A score that never
// completes, or a branch never reached, on these samples is reported for a person
// to check, not failed.
const SAMPLES = {
  bool: [undefined, true, false],
  number: [undefined, 0, 0.5, 1, 2, 5, 10, 20, 50, 100, 1000, 10000],
};

test("rule-based scores never fail, and every outcome they produce has a branch", (t) => {
  const failures = [];
  let combinations = 0;
  for (const { g, cid, calc } of calculators(isRule)) {
    let combos = [{}];
    for (const c of calc.criteria || []) {
      const values = SAMPLES[c.type];
      if (!values) {
        failures.push(`${g.id}/${cid}: criterion "${c.id}" has a type this test doesn't sample ("${c.type}")`);
        continue;
      }
      combos = combos.flatMap((inputs) => values.map((v) => (v === undefined ? inputs : { ...inputs, [c.id]: v })));
    }
    const steps = scoreSteps(g, cid);
    const recommended = new Map(steps.map((n) => [n, new Set()]));
    let completed = 0;
    for (const inputs of combos) {
      combinations++;
      const where = `${g.id}/${cid} with ${JSON.stringify(inputs)}`;
      let r;
      try {
        r = evaluateScore(calc, { inputs });
      } catch (e) {
        failures.push(`${where}: threw ${e.message}`);
        continue;
      }
      if (!r.complete) continue;
      completed++;
      if (leaks(r.label)) failures.push(`${where}: result label ${JSON.stringify(r.label)}`);
      for (const n of steps) {
        const b = branchForScore(n, r);
        if (b) recommended.get(n).add(b);
        else failures.push(`${g.id}/${n.id}: no branch for ${cid} outcome "${r.groupId}"`);
      }
    }
    if (!completed) t.diagnostic(`check by hand — ${g.id}/${cid}: no sampled input completes the score`);
    for (const [n, hit] of recommended) {
      for (const b of routedBranches(n)) {
        if (!hit.has(b)) t.diagnostic(`check by hand — ${g.id}/${n.id}: no sampled input recommends "${b.label}"`);
      }
    }
  }
  t.diagnostic(`${combinations} rule-score input combinations`);
  assert.deepEqual([...new Set(failures)], []); // a missing branch repeats per combination
});
