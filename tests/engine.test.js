// The workflow engine: rewinding, restarting and new patients; pound and kilogram
// weight entry and the doses computed from it; score answers; and reassessments.
// Pure functions — no React, no browser.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as R from "../src/engine/workflowReducer.js";
import * as D from "../src/engine/dosing.js";
import * as S from "../src/engine/scoring.js";

// One session, walked step by step: these tests run in order and share it.
describe("a session rewound with Back and the breadcrumb", () => {
  const g = { startNodeId: "start" };
  let s = R.initWorkflowState(g);
  const step = (a) => (s = R.workflowReducer(s, a));

  it("starts with kg and no patient", () => {
    assert.equal(s.weightUnit, "kg");
    assert.equal(R.hasPatientDetails(s), false);
  });

  it("Back restores the step's own answers and drops the abandoned step's", () => {
    // start: answer the shared score "w" (item i1 = 1), then advance.
    step({ type: "SET_CALC_INPUT", calcId: "w", key: "i1", value: 1 });
    step({ type: "ADVANCE", toNodeId: "n2", choiceLabel: "go" });
    // n2 reuses the same calculator: change it, record, tick a box, enter a weight.
    step({ type: "SET_CALC_INPUT", calcId: "w", key: "i1", value: 3 });
    step({ type: "RECORD_SCORE", calcId: "w", result: { total: 3 } });
    step({ type: "TOGGLE_CHECK", nodeId: "n2", idx: 0 });
    step({ type: "SET_PATIENT", key: "weightKg", value: 15 });
    step({ type: "ADVANCE", toNodeId: "n3", choiceLabel: "next" });
    // n3: answers on what becomes an abandoned branch.
    step({ type: "SET_CALC_INPUT", calcId: "x", key: "k", value: 9 });

    step({ type: "BACK" });
    assert.equal(s.currentNodeId, "n2");
    assert.equal(s.calcInputs.w.i1, 3);
    assert.equal(s.scores.w.total, 3);
    assert.equal(s.checklist.n2[0], true);
    assert.equal(s.calcInputs.x, undefined);
    assert.equal(s.weightKg, 15, "patient weight survives rewind");
    assert.equal(s.history.length, 1);
  });

  it("Back to the start restores the start's answer (1, not n2's 3)", () => {
    step({ type: "BACK" });
    assert.equal(s.currentNodeId, "start");
    assert.equal(s.calcInputs.w.i1, 1);
    assert.equal(s.scores.w, undefined);
    assert.equal(s.checklist.n2, undefined);
    assert.equal(s.weightKg, 15);
    assert.equal(s.history.length, 0);
  });

  it("Back at the start changes nothing", () => {
    const before = structuredClone(s);
    step({ type: "BACK" });
    assert.deepEqual(s, before);
  });

  it("a breadcrumb jump restores the target step's saved answers", () => {
    step({ type: "ADVANCE", toNodeId: "n2" }); // history[0] = start (w.i1 = 1)
    step({ type: "SET_CALC_INPUT", calcId: "w", key: "i1", value: 2 });
    step({ type: "ADVANCE", toNodeId: "n3" }); // history[1] = n2 (w.i1 = 2)
    step({ type: "SET_CALC_INPUT", calcId: "w", key: "i1", value: 5 });
    step({ type: "ADVANCE", toNodeId: "n4" }); // history[2] = n3 (w.i1 = 5)
    step({ type: "GOTO_CRUMB", index: 1 });
    assert.equal(s.currentNodeId, "n2");
    assert.equal(s.calcInputs.w.i1, 2);
    assert.equal(s.history.length, 1);
    step({ type: "GOTO_CRUMB", index: 0 });
    assert.equal(s.currentNodeId, "start");
    assert.equal(s.calcInputs.w.i1, 1);
    assert.equal(s.history.length, 0);
  });

  it("a breadcrumb jump out of range changes nothing", () => {
    const before = structuredClone(s);
    step({ type: "GOTO_CRUMB", index: 3 });
    step({ type: "GOTO_CRUMB", index: -1 });
    assert.deepEqual(s, before);
  });

  it("Restart keeps the patient (typed entry and unit included), clears path and answers", () => {
    step({ type: "SET_PATIENT", key: "weightText", value: "33" });
    step({ type: "SET_PATIENT", key: "weightUnit", value: "lb" });
    step({ type: "SET_PATIENT", key: "weightKg", value: D.entryToKg("33", "lb") });
    step({ type: "SET_PATIENT", key: "sex", value: "female" });
    step({ type: "ADVANCE", toNodeId: "n2" });
    step({ type: "RESTART", startNodeId: "start" });
    assert.equal(s.currentNodeId, "start");
    assert.deepEqual(s.history, []);
    assert.deepEqual(s.calcInputs, {});
    assert.deepEqual(s.scores, {});
    assert.deepEqual(s.checklist, {});
    assert.equal(s.weightKg, 14.97);
    assert.equal(s.weightText, "33");
    assert.equal(s.weightUnit, "lb");
    assert.equal(s.sex, "female");
    assert.equal(R.hasPatientDetails(s), true);
  });

  it("the patient summary shows the typed weight, unrounded", () => {
    assert.equal(R.describePatient(s), "33 lb · female");
    assert.equal(
      R.describePatient({ weightText: "33.25", weightUnit: "lb", weightKg: D.entryToKg("33.25", "lb") }),
      "33.25 lb"
    );
    assert.equal(
      R.describePatient({ weightText: "9.999", weightUnit: "kg", weightKg: 9.999, ageMonths: 24 }),
      "9.999 kg · 24 mo"
    );
    assert.equal(R.describePatient({ weightText: "", weightUnit: "kg", weightKg: 15 }), "15 kg", "falls back to kg");
  });

  it("New patient clears everything and resets the unit to kg", () => {
    step({ type: "NEW_PATIENT", startNodeId: "start" });
    assert.deepEqual(s, R.initWorkflowState(g));
    assert.equal(R.hasPatientDetails(s), false);
  });
});

describe("patient details", () => {
  it("count as entered once any of weight, sex or age is set", () => {
    const base = R.initWorkflowState({ startNodeId: "start" });
    assert.equal(R.hasPatientDetails({ ...base, weightKg: 0 }), true);
    assert.equal(R.hasPatientDetails({ ...base, sex: "male" }), true);
    assert.equal(R.hasPatientDetails({ ...base, ageMonths: 0 }), true);
    assert.equal(R.hasPatientDetails({ ...base, weightUnit: "lb" }), false);
  });
});

describe("weight entry", () => {
  it("converts pounds and kilograms exactly, both ways", () => {
    assert.equal(D.KG_PER_LB, 0.45359237);
    assert.ok(Math.abs(D.lbToKg(33) - 14.96854821) < 1e-8);
    assert.ok(Math.abs(D.kgToLb(D.lbToKg(33)) - 33) < 1e-12);
    assert.ok(Math.abs(D.lbToKg(2.2046226218) - 1) < 1e-9);
  });

  it("uses kg exactly as typed and rounds pounds to 0.01 kg", () => {
    assert.equal(D.entryToKg("9.999", "kg"), 9.999);
    assert.equal(D.entryToKg("33", "lb"), 14.97);
    assert.equal(D.entryToKg("44", "lb"), 19.96);
    assert.equal(D.entryToKg("44.1", "lb"), 20, "20.0034 kg doses as exactly 20");
    assert.equal(D.entryToKg("44.2", "lb"), 20.05);
    assert.equal(D.entryToKg("", "lb"), null);
    assert.equal(D.entryToKg("  ", "kg"), null);
    assert.equal(D.entryToKg(null, "kg"), null);
    assert.equal(D.entryToKg("abc", "kg"), null);
  });

  it("puts a pound weight in the band matching the kg shown (the 20 kg edge)", () => {
    const q2 = {
      name: "q2",
      rules: [
        { when: (c) => typeof c.weightKg === "number" && c.weightKg <= 20, label: "≤ 20 kg", dose: { flatMg: 2.5 } },
        { when: (c) => typeof c.weightKg === "number" && c.weightKg > 20, label: "> 20 kg", dose: { flatMg: 5 } },
      ],
    };
    assert.equal(D.computeDrug(q2, { weightKg: D.entryToKg("44.1", "lb") }).ruleLabel, "≤ 20 kg");
    assert.equal(D.computeDrug(q2, { weightKg: D.entryToKg("44.2", "lb") }).ruleLabel, "> 20 kg");
  });

  it("accepts exactly the pound range it shows (1.1–330.7 lb, signed off 2026-10-01)", () => {
    assert.equal(D.WEIGHT_MIN_LB, 1.1);
    assert.equal(D.WEIGHT_MAX_LB, 330.7);
    assert.equal(D.isValidWeight(D.entryToKg(String(D.WEIGHT_MIN_LB), "lb")), true);
    assert.equal(D.isValidWeight(D.entryToKg(String(D.WEIGHT_MAX_LB), "lb")), true);
    assert.equal(D.isValidWeight(D.entryToKg("1", "lb")), false, "1.0 lb is under 0.5 kg");
    assert.equal(D.isValidWeight(D.entryToKg("330.8", "lb")), false, "330.8 lb is over 150 kg");
  });

  it("rejects pound entries outside the shown range, even finer than 0.1 lb", () => {
    assert.equal(D.isValidWeight(D.entryToKg("1.095", "lb")), false, "1.095 lb < 1.1 shown minimum");
    assert.equal(D.isValidWeight(D.entryToKg("330.75", "lb")), false, "330.75 lb > 330.7 shown maximum");
    assert.equal(D.entryToKg("1.1", "lb"), 0.5);
    assert.equal(D.entryToKg("1.15", "lb"), 0.52);
    assert.equal(D.entryToKg("330.7", "lb"), 150);
    assert.ok(Number.isNaN(D.entryToKg("1.095", "lb")), "rejected entries are NaN, never a weight");
    assert.equal(D.entryToKg("200", "kg"), 200, "kg entries untouched (rejected later by isValidWeight)");
  });
});

describe("dose formulas", () => {
  const drug = { name: "t", dose: { mgPerKg: 0.6, maxMg: 10 } };

  it("dose a pound entry at exactly the kg shown", () => {
    const r = D.computeDrug(drug, { weightKg: D.entryToKg("22", "lb") }); // 9.98 kg
    assert.equal(r.computed.formula, "0.6 mg/kg × 9.98 kg (max 10 mg)");
    assert.equal(r.computed.text, "5.99 mg"); // 0.6 × 9.98 = 5.988
  });

  it("print the exact weight used, never rounded", () => {
    assert.equal(D.computeDrug(drug, { weightKg: 9.999 }).computed.formula, "0.6 mg/kg × 9.999 kg (max 10 mg)");
    assert.equal(D.computeDrug(drug, { weightKg: 15 }).computed.formula, "0.6 mg/kg × 15 kg (max 10 mg)");
    assert.equal(
      D.computeDrug(drug, { weightKg: D.entryToKg("33", "lb") }).computed.formula,
      "0.6 mg/kg × 14.97 kg (max 10 mg)"
    );
    assert.equal(
      D.computeDrug(drug, { weightKg: 20.00000000001 }).computed.formula,
      "0.6 mg/kg × 20.00000000001 kg (max 10 mg)",
      "no rounding even past 12 significant digits"
    );
  });
});

describe("score answers", () => {
  // Two options can carry the same points (PRAS respiratory rate has four age bands).
  const pras = {
    items: [
      {
        id: "rr",
        options: [
          { label: "<2mo ≤50", value: 0 },
          { label: "<2mo 51–60", value: 1 },
          { label: "2–12mo ≤40", value: 0 },
          { label: "2–12mo 41–50", value: 1 },
        ],
      },
      { id: "wh", options: [{ label: "none", value: 0 }, { label: "exp", value: 2 }] },
    ],
    bands: [{ id: "mild", min: 0, max: 1, label: "Mild" }, { id: "mod", min: 2, label: "Moderate" }],
  };

  it("are stored as option indices, so options sharing points stay distinct", () => {
    assert.deepEqual(S.selectionsFromChoices(pras, { rr: 3, wh: 1 }), { rr: 1, wh: 2 });
    assert.deepEqual(S.selectionsFromChoices(pras, { rr: 1 }), { rr: 1 }, "same points, different option");
    const r = S.evaluateScore(pras, { choices: { rr: 3, wh: 1 } });
    assert.equal(r.total, 3);
    assert.equal(r.complete, true);
    assert.equal(r.label, "Moderate");
    assert.equal(S.evaluateScore(pras, { choices: { rr: 3 } }).complete, false, "unanswered item");
    assert.deepEqual(S.selectionsFromChoices(pras, { rr: 9, wh: -1, x: 0 }), {}, "out-of-range indices ignored");
    assert.equal(S.evaluateScore(pras, { selections: { rr: 1, wh: 2 } }).total, 3, "points API still works");
  });
});

describe("reassessments", () => {
  it("start blank when moving forward onto a score step; Back restores the earlier answers", () => {
    let t = R.initWorkflowState({ startNodeId: "initial" });
    const st = (a) => (t = R.workflowReducer(t, a));
    st({ type: "SET_CALC_INPUT", calcId: "westley", key: "stridor", value: 1 }); // initial score
    st({ type: "SET_CALC_INPUT", calcId: "dose", key: "x", value: 7 }); // another calculator
    st({ type: "RECORD_SCORE", calcId: "westley", result: { total: 3, label: "Moderate croup" } });
    st({ type: "ADVANCE", toNodeId: "dosing" }); // not a score step
    assert.equal(t.calcInputs.westley.stridor, 1, "plain advance keeps answers");
    st({ type: "ADVANCE", toNodeId: "rescore", freshCalcId: "westley" }); // reassessment
    assert.equal(t.calcInputs.westley, undefined, "reassessment starts blank");
    assert.equal(t.scores.westley, undefined, "and so does its recorded result");
    assert.equal(t.calcInputs.dose.x, 7, "other calculators untouched");
    assert.equal(t.history.at(-1).saved.scores.westley.total, 3, "the step left behind keeps its result");
    st({ type: "SET_CALC_INPUT", calcId: "westley", key: "stridor", value: 0 }); // rescored
    st({ type: "BACK" });
    assert.equal(t.currentNodeId, "dosing");
    assert.equal(t.calcInputs.westley.stridor, 1, "Back restores the initial answers");
    assert.equal(t.scores.westley.total, 3, "and the initial result");
    st({ type: "ADVANCE", toNodeId: "rescore", freshCalcId: "westley" });
    assert.equal(t.calcInputs.westley, undefined, "re-entering the reassessment starts blank again");
    const before = structuredClone(t);
    st({ type: "ADVANCE", toNodeId: "rescore2", freshCalcId: "never-answered" });
    assert.deepEqual(t.calcInputs, before.calcInputs, "a never-answered calculator leaves other answers alone");
    assert.deepEqual(t.scores, before.scores, "and other results");
  });
});
