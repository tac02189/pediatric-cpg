import { useReducer } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getGuideline } from "../../data/index.js";
import { workflowReducer, initWorkflowState } from "../../engine/workflowReducer.js";
import { WorkflowContext } from "./workflowContext.js";

// Owns one guideline's workflow state for as long as the user stays inside that
// guideline. The pathway and the guideline's Calculators page are both child
// routes of this one, so moving between them keeps the resident's place and the
// patient's details. Leaving the guideline (Home, another guideline) unmounts the
// session and discards everything — no patient carries over by accident.
export default function GuidelineSession() {
  const { id } = useParams();
  const guideline = getGuideline(id);
  if (!guideline) return <Navigate to="/" replace />;
  // key: jumping straight to a different guideline starts a fresh session.
  return <Session key={guideline.id} guideline={guideline} />;
}

function Session({ guideline }) {
  const [state, dispatch] = useReducer(workflowReducer, guideline, initWorkflowState);
  const startNodeId = guideline.startNodeId;

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
    // Same patient: start the pathway over, keep weight/sex/age.
    restart: () => dispatch({ type: "RESTART", startNodeId }),
    // New patient: start over and clear the patient's details too.
    newPatient: () => dispatch({ type: "NEW_PATIENT", startNodeId }),
  };

  return (
    <WorkflowContext.Provider value={value}>
      <Outlet />
    </WorkflowContext.Provider>
  );
}
