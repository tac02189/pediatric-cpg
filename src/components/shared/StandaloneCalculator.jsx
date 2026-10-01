import { useState } from "react";
import ScoreCalculator from "./ScoreCalculator.jsx";
import DosingCalculator from "./DosingCalculator.jsx";

const NO_PATIENT = { weightText: "", weightUnit: "kg", weightKg: null, sex: null, ageMonths: null };

// A calculator used outside the pathway (the hubs). Score inputs are its own
// ephemeral state. Patient details are too — unless the caller passes `patient`
// and `onPatientChange`: a guideline's Calculators page does, so its calculators
// and the pathway all dose the same, single patient. Nothing is persisted.
export default function StandaloneCalculator({ calc, patient: sharedPatient, onPatientChange }) {
  const [inputs, setInputs] = useState({});
  const [localPatient, setLocalPatient] = useState(NO_PATIENT);
  const patient = sharedPatient || localPatient;
  const setPatient =
    onPatientChange || ((k, v) => setLocalPatient((p) => ({ ...p, [k]: v })));

  if (calc.kind === "dosing") {
    return <DosingCalculator calc={calc} ctx={patient} onPatientChange={setPatient} />;
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
