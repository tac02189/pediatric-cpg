import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../lib/icons.jsx";
import { useWorkflow } from "../guideline/workflowContext.js";
import { hasPatientDetails, describePatient } from "../../engine/workflowReducer.js";
import StandaloneCalculator, { calculatorName } from "../shared/StandaloneCalculator.jsx";
import PdfButton from "../shared/PdfButton.jsx";

// A guideline's calculators, inside its session (GuidelineSession is the parent
// route). There is one patient per session: every dosing calculator here reads
// and writes the same weight, sex and age as the pathway, so a weight corrected
// here is the weight the pathway doses with, and "New patient" here clears both.
export default function GuidelineCalculatorsPage() {
  const { guideline, state, setPatient, newPatient } = useWorkflow();
  // Score answers on this page are each calculator's own; remounting them on
  // "New patient" makes sure no previous patient's answers survive either.
  const [resetKey, setResetKey] = useState(0);
  const hasPatient = hasPatientDetails(state);

  const calcs = Object.entries(guideline.calculators || {});
  const patient = {
    weightText: state.weightText,
    weightUnit: state.weightUnit,
    weightKg: state.weightKg,
    sex: state.sex,
    ageMonths: state.ageMonths,
  };

  const startNewPatient = () => {
    newPatient();
    setResetKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Link
        to={`/guideline/${guideline.id}`}
        className="focus-ring -ml-1 mb-2 inline-flex items-center gap-1 rounded px-1 py-0.5 text-sm font-medium text-slate-500 hover:text-primary-700"
      >
        <Icon name="ChevronLeft" size={16} />
        {guideline.title} pathway
      </Link>

      <div className="mb-1 flex items-center gap-2">
        <Icon name="Calculator" size={22} className="text-primary-600" />
        <h1 className="font-display text-xl font-extrabold text-slate-900">
          {guideline.title} calculators
        </h1>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Quick access to this guideline’s tools without walking the pathway. Patient
        details are shared with the pathway.
      </p>

      {/* Always shown — even when only score answers have been entered here, the
          next patient needs a way to clear them. The button stays mounted, so
          keyboard focus survives the reset. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary-200 bg-primary-50/60 px-3 py-2">
        <span className="flex items-center gap-1.5 text-sm text-primary-900">
          <Icon name="Scale" size={15} className="shrink-0" />
          {hasPatient ? (
            <span>
              Patient: <span className="font-semibold">{describePatient(state)}</span>
            </span>
          ) : (
            <span className="text-primary-800/80">No patient details entered</span>
          )}
        </span>
        <button
          type="button"
          onClick={startNewPatient}
          className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Icon name="UserPlus" size={16} />
          New patient
        </button>
      </div>

      {calcs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          This guideline has no standalone calculators.
        </div>
      ) : (
        <div className="space-y-4">
          {calcs.map(([calcId, calc]) => (
            <section key={`${calcId}-${resetKey}`} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-bold text-slate-900">
                <Icon name={calc.kind === "dosing" ? "Pill" : "ListChecks"} size={17} className="text-primary-600" />
                {calculatorName(calc, calcId)}
              </h2>
              <StandaloneCalculator calc={calc} patient={patient} onPatientChange={setPatient} />
              {calc.reference && <p className="mt-3 text-xs text-slate-400">{calc.reference}</p>}
            </section>
          ))}
        </div>
      )}

      <div className="mt-6">
        <PdfButton
          sourcePdf={guideline.sourcePdf}
          title={guideline.fullTitle || guideline.title}
          variant="outline"
          label="Official PDF"
        />
      </div>
    </div>
  );
}
