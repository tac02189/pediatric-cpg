import { useState } from "react";
import ScoreCalculator from "./ScoreCalculator.jsx";
import DosingCalculator from "./DosingCalculator.jsx";

// A calculator used outside a workflow (the hubs). Manages its own ephemeral
// input state — nothing is persisted.
export default function StandaloneCalculator({ calc }) {
  const [inputs, setInputs] = useState({});
  const [patient, setPatient] = useState({ weightKg: null, sex: null, ageMonths: null });

  if (calc.kind === "dosing") {
    return (
      <DosingCalculator
        calc={calc}
        ctx={patient}
        onPatientChange={(k, v) => setPatient((p) => ({ ...p, [k]: v }))}
      />
    );
  }
  return (
    <ScoreCalculator
      calc={calc}
      inputs={inputs}
      onInput={(k, v) => setInputs((s) => ({ ...s, [k]: v }))}
    />
  );
}

export function calculatorName(calc, fallback) {
  return calc.name || fallback;
}
