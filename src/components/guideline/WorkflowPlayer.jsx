import { useReducer } from "react";
import { workflowReducer, initWorkflowState } from "../../engine/workflowReducer.js";
import { WorkflowContext } from "./workflowContext.js";
import NodeRenderer from "./NodeRenderer.jsx";
import Breadcrumb from "./Breadcrumb.jsx";
import BackBar from "./BackBar.jsx";
import ReferencesAccordion from "./ReferencesAccordion.jsx";

// Owns the workflow state machine and exposes it (plus action helpers) to the
// node components via context. Generic — never references a specific guideline.
export default function WorkflowPlayer({ guideline }) {
  const [state, dispatch] = useReducer(workflowReducer, guideline, initWorkflowState);

  const value = {
    guideline,
    state,
    dispatch,
    advance: (toNodeId, choiceLabel) => dispatch({ type: "ADVANCE", toNodeId, choiceLabel }),
    setPatient: (key, val) => dispatch({ type: "SET_PATIENT", key, value: val }),
    setCalcInput: (calcId, key, val) =>
      dispatch({ type: "SET_CALC_INPUT", calcId, key, value: val }),
    recordScore: (calcId, result) => dispatch({ type: "RECORD_SCORE", calcId, result }),
    toggleCheck: (nodeId, idx) => dispatch({ type: "TOGGLE_CHECK", nodeId, idx }),
    restart: () => dispatch({ type: "RESTART", startNodeId: guideline.startNodeId }),
  };

  const node = guideline.nodes[state.currentNodeId];

  return (
    <WorkflowContext.Provider value={value}>
      <Breadcrumb />
      <div
        className="mx-auto max-w-3xl px-4 pt-4"
        style={{ paddingBottom: "calc(var(--app-backbar-h, 5.5rem) + 0.75rem)" }}
      >
        <NodeRenderer node={node} guideline={guideline} />
        <ReferencesAccordion guideline={guideline} />
      </div>
      <BackBar />
    </WorkflowContext.Provider>
  );
}
