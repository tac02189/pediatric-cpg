// The workflow state machine. State is the path actually taken through the graph
// (a history stack) plus per-session scratch (weight/sex/age, calculator inputs,
// checklist toggles). Keeping history as a stack makes Back and breadcrumb rewind
// correct even when branches converge or loop backward.

export function initWorkflowState(guideline) {
  return {
    currentNodeId: guideline.startNodeId,
    history: [], // [{ nodeId, choiceLabel }] — nodes already left behind
    weightKg: null,
    sex: null,
    ageMonths: null,
    calcInputs: {}, // calcId -> { key: value }
    scores: {}, // calcId -> last evaluation result
    checklist: {}, // nodeId -> { idx: bool }
  };
}

export function workflowReducer(state, action) {
  switch (action.type) {
    case "ADVANCE": {
      if (!action.toNodeId) return state; // dead-end label: ignore
      return {
        ...state,
        history: [...state.history, { nodeId: state.currentNodeId, choiceLabel: action.choiceLabel || "" }],
        currentNodeId: action.toNodeId,
      };
    }
    case "BACK": {
      if (state.history.length === 0) return state;
      const last = state.history[state.history.length - 1];
      return {
        ...state,
        history: state.history.slice(0, -1),
        currentNodeId: last.nodeId,
      };
    }
    case "GOTO_CRUMB": {
      const { index } = action;
      if (index < 0 || index >= state.history.length) return state;
      return {
        ...state,
        currentNodeId: state.history[index].nodeId,
        history: state.history.slice(0, index),
      };
    }
    case "RESTART": {
      return {
        ...state,
        currentNodeId: action.startNodeId,
        history: [],
        calcInputs: {},
        scores: {},
        checklist: {},
        // Patient weight/sex/age intentionally preserved across a restart.
      };
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
