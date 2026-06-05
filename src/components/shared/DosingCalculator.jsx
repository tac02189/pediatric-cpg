import { computeCalculator, requiredInputs } from "../../engine/dosing.js";
import { Icon } from "../../lib/icons.jsx";
import WeightInput from "./WeightInput.jsx";

// Renders a dosing calculator: collects patient inputs, then shows each drug's
// computed dose with the math and any cap applied.
export default function DosingCalculator({ calc, ctx = {}, onPatientChange, showInputs = true }) {
  const need = requiredInputs(calc);
  const results = computeCalculator(calc, ctx);

  return (
    <div className="space-y-3">
      {showInputs && (
        <WeightInput
          need={need}
          weightKg={ctx.weightKg}
          sex={ctx.sex}
          ageMonths={ctx.ageMonths}
          onChange={onPatientChange}
        />
      )}
      <div className="space-y-2.5">
        {results.map((r, i) => (
          <DrugRow key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

function DrugRow({ r }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <span className="font-display text-[15px] font-bold text-slate-900">{r.name}</span>
        {r.route && (
          <span className="max-w-full rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
            {r.route}
          </span>
        )}
      </div>

      {r.ruleLabel && <p className="mt-0.5 text-xs font-medium text-primary-700">{r.ruleLabel}</p>}

      {r.needsWeight ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-400">
          <Icon name="Scale" size={15} /> Enter weight to calculate
        </p>
      ) : r.unmatched ? (
        <p className="mt-1.5 text-sm text-slate-400">Enter patient details to select a regimen</p>
      ) : r.displayOnly ? (
        <p className="mt-1.5 text-base font-bold text-slate-900">{r.text}</p>
      ) : (
        <div className="mt-1.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-display text-xl font-extrabold tabular-nums text-primary-700">
              {r.computed.text}
            </span>
            {r.computed.frequency && (
              <span className="text-sm font-medium text-slate-500">{r.computed.frequency}</span>
            )}
            {r.computed.capped && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                Max dose
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs tabular-nums text-slate-500">{r.computed.formula}</p>
          {r.computed.volume && (
            <p className="text-xs tabular-nums text-slate-500">≈ {r.computed.volume}</p>
          )}
        </div>
      )}

      {r.formulation && <p className="mt-1.5 text-xs text-slate-500">{r.formulation}</p>}
      {r.note && <p className="mt-1 text-xs italic text-slate-500">{r.note}</p>}
      {r.contraindications?.length > 0 && (
        <p className="mt-1 flex items-start gap-1 text-xs text-rose-600">
          <Icon name="TriangleAlert" size={13} className="mt-0.5 shrink-0" />
          <span>Avoid: {r.contraindications.join(", ")}</span>
        </p>
      )}
    </div>
  );
}
