import { Icon } from "../../lib/icons.jsx";
import { WEIGHT_MIN_KG, WEIGHT_MAX_KG, isValidWeight } from "../../engine/dosing.js";

// Collects the patient inputs a dosing calculator needs. Controlled — values
// live in the workflow reducer (or local state in the standalone hub) and are
// never persisted (no PHI).
export default function WeightInput({ need = ["weightKg"], weightKg, sex, ageMonths, onChange }) {
  const wNum = typeof weightKg === "number" ? weightKg : "";
  const weightTouchedInvalid = weightKg != null && weightKg !== "" && !isValidWeight(Number(weightKg));

  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary-800">
        <Icon name="Scale" size={15} />
        Patient
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col">
          <span className="mb-1 text-[11px] font-medium text-slate-600">Weight (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            min={WEIGHT_MIN_KG}
            max={WEIGHT_MAX_KG}
            step="0.1"
            value={wNum}
            onChange={(e) =>
              onChange("weightKg", e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="—"
            className="focus-ring w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg font-bold tabular-nums text-slate-900"
          />
        </label>

        {need.includes("sex") && (
          <div className="flex flex-col">
            <span className="mb-1 text-[11px] font-medium text-slate-600">Sex</span>
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              {["female", "male"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange("sex", s)}
                  className={`tap-target px-3 text-sm font-semibold capitalize transition ${
                    sex === s ? "bg-primary-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {need.includes("ageMonths") && (
          <label className="flex flex-col">
            <span className="mb-1 text-[11px] font-medium text-slate-600">Age (months)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={264}
              step="1"
              value={typeof ageMonths === "number" ? ageMonths : ""}
              onChange={(e) =>
                onChange("ageMonths", e.target.value === "" ? null : Number(e.target.value))
              }
              placeholder="—"
              className="focus-ring w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg font-bold tabular-nums text-slate-900"
            />
          </label>
        )}
      </div>
      {weightTouchedInvalid && (
        <p className="mt-2 text-xs font-medium text-rose-600">
          Enter a weight between {WEIGHT_MIN_KG} and {WEIGHT_MAX_KG} kg.
        </p>
      )}
    </div>
  );
}
