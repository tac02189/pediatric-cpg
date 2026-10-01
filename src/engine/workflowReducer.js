// The workflow state machine. State is the path actually taken through the graph
// (a history stack) plus per-session scratch (patient details, calculator inputs,
// checklist toggles). Keeping history as a stack makes Back and breadcrumb rewind
// correct even when branches converge or loop backward.
//
// The two kinds of scratch are deliberately treated differently:
//  • Patient details (the weight as typed, its unit, the derived dosing weight in
//    kg, sex, age) describe the patient, not the path. Rewinding keeps them; only
//    "New patient" clears them.
//  • Step answers (calculator inputs, recorded scores, checklist ticks) belong to
//    the path. Each history entry saves them as they stood when that step was
//    left, and rewinding restores exactly that — so answers given on a branch the
//    user backed out of never resurface on the step they returned to.

import { fmt } from "./dosing.js";

function freshSession(startNodeId) {
  return {
    currentNodeId: startNodeId,
    history: [], // [{ nodeId, choiceLabel, saved }] — nodes already left behind
    weightText: "", // the weight exactly as typed, shown back in every weight box
    weightUnit: "kg", // unit of weightText
    weightKg: null, // dosing weight derived from the two above (entryToKg)
    sex: null,
    ageMonths: null,
    calcInputs: {}, // calcId -> { key: value }
    scores: {}, // calcId -> last evaluation result
    checklist: {}, // nodeId -> { idx: bool }
  };
}

export function initWorkflowState(guideline) {
  return freshSession(guideline.startNodeId);
}

// True once any patient detail has been entered. Restart must then ask whether
// the next run is for the same patient rather than silently carrying them over.
export function hasPatientDetails(state) {
  return state.weightKg != null || state.sex != null || state.ageMonths != null;
}

// What a same-patient restart would carry over, exactly as the user entered it,
// e.g. "33.25 lb · female".
export function describePatient(state) {
  const parts = [];
  if (typeof state.weightKg === "number") {
    const typed = Number(state.weightText);
    parts.push(
      state.weightText !== "" && Number.isFinite(typed)
        ? `${typed} ${state.weightUnit === "lb" ? "lb" : "kg"}`
        : `${fmt(state.weightKg)} kg`
    );
  }
  if (state.sex) parts.push(state.sex);
  if (typeof state.ageMonths === "number") parts.push(`${state.ageMonths} mo`);
  return parts.join(" · ");
}

export function workflowReducer(state, action) {
  switch (action.type) {
    case "ADVANCE": {
      if (!action.toNodeId) return state; // dead-end label: ignore
      const saved = {
        calcInputs: state.calcInputs,
        scores: state.scores,
        checklist: state.checklist,
      };
      return {
        ...state,
        history: [
          ...state.history,
          { nodeId: state.currentNodeId, choiceLabel: action.choiceLabel || "", saved },
        ],
        currentNodeId: action.toNodeId,
      };
    }
    case "BACK": {
      if (state.history.length === 0) return state;
      const last = state.history[state.history.length - 1];
      return {
        ...state,
        ...last.saved,
        history: state.history.slice(0, -1),
        currentNodeId: last.nodeId,
      };
    }
    case "GOTO_CRUMB": {
      const { index } = action;
      if (index < 0 || index >= state.history.length) return state;
      const target = state.history[index];
      return {
        ...state,
        ...target.saved,
        currentNodeId: target.nodeId,
        history: state.history.slice(0, index),
      };
    }
    case "RESTART": {
      // Same patient: the path and every step answer reset; patient details stay.
      return {
        ...freshSession(action.startNodeId),
        weightText: state.weightText,
        weightUnit: state.weightUnit,
        weightKg: state.weightKg,
        sex: state.sex,
        ageMonths: state.ageMonths,
      };
    }
    case "NEW_PATIENT": {
      return freshSession(action.startNodeId);
    }
    case "SET_PATIENT": {
      return { ...state, [action.key]: action.value };
    }
    case "SET_CALC_INPUT": {
      const prev = state.calcInputs[action.calcId] || {};
      return {
        ...state,
        calcInputs: {
          ...state.calcInputs,
          [action.calcId]: { ...prev, [action.key]: action.value },
        },
      };
    }
    case "RECORD_SCORE": {
      return { ...state, scores: { ...state.scores, [action.calcId]: action.result } };
    }
    case "TOGGLE_CHECK": {
      const prev = state.checklist[action.nodeId] || {};
      return {
        ...state,
        checklist: {
          ...state.checklist,
          [action.nodeId]: { ...prev, [action.idx]: !prev[action.idx] },
        },
      };
    }
    default:
      return state;
  }
}
