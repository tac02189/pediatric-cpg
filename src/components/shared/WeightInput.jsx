import { useId } from "react";
import { Icon } from "../../lib/icons.jsx";
import { radioTabIndex, onRadioKeyDown } from "../../lib/radioGroup.js";
import {
  WEIGHT_MIN_KG,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_LB,
  WEIGHT_MAX_LB,
  isValidWeight,
  entryToKg,
  kgToLb,
  fmt,
} from "../../engine/dosing.js";

const UNITS = ["kg", "lb"];
const SEXES = ["female", "male"];

const round1 = (n) => Math.round(n * 10) / 10;

// Collects the patient inputs a dosing calculator needs. Fully controlled — the
// weight as typed (weightText), its unit, and the derived dosing weight (weightKg)
// all live in the caller's state (the workflow session, or the standalone hub)
// and are never persisted (no PHI). Because the typed text is stored, every
// weight box — on any step, after any remount — shows exactly what was entered.
//
// Weight can be typed in kg or lb, but it is always dosed in kg (pounds converted
// by entryToKg), and the other unit is shown underneath at all times — so "33"
// typed into the kg box for a child whose parent said 33 pounds reads back as
// "≈ 72.8 lb", not silently as a 33 kg patient.
export default function WeightInput({
  need = ["weightKg"],
  weightKg,
  weightText,
  weightUnit = "kg",
  sex,
  ageMonths,
  onChange,
}) {
  const unit = weightUnit === "lb" ? "lb" : "kg";
  const text = weightText ?? "";
  const weightId = useId();
  const hintId = useId();
  const sexLabelId = useId();

  const onType = (value) => {
    onChange("weightText", value);
    onChange("weightKg", entryToKg(value, unit));
  };

  // The unit control states the unit of the number in the box: keep the number
  // and read it in the new unit. The usual reason to change it is realizing the
  // weight was given in pounds; the line underneath shows the resulting kg.
  const setUnit = (u) => {
    if (u === unit) return;
    onChange("weightUnit", u);
    onChange("weightKg", entryToKg(text, u));
  };

  const valid = isValidWeight(weightKg);
  const invalid = weightKg != null && !valid;
  // In lb mode the kg shown is exactly the kg dosed (entryToKg rounds pounds to
  // 0.01 kg, which fmt prints in full), so "=" is literal, not approximate.
  const hint = valid
    ? unit === "lb"
      ? `= ${fmt(weightKg)} kg — used for dosing`
      : `≈ ${round1(kgToLb(weightKg))} lb`
    : invalid
    ? unit === "lb"
      ? `Enter a weight between ${WEIGHT_MIN_LB} and ${WEIGHT_MAX_LB} lb (${WEIGHT_MIN_KG}–${WEIGHT_MAX_KG} kg).`
      : `Enter a weight between ${WEIGHT_MIN_KG} and ${WEIGHT_MAX_KG} kg.`
    : null;

  const unitIndex = UNITS.indexOf(unit);
  const sexIndex = SEXES.indexOf(sex);

  return (
    <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary-800">
        <Icon name="Scale" size={15} />
        Patient
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label htmlFor={weightId} className="mb-1 text-[11px] font-medium text-slate-600">
            Weight ({unit})
          </label>
          <div className="flex items-stretch gap-1.5">
            <input
              id={weightId}
              type="number"
              inputMode="decimal"
              min={unit === "lb" ? WEIGHT_MIN_LB : WEIGHT_MIN_KG}
              max={unit === "lb" ? WEIGHT_MAX_LB : WEIGHT_MAX_KG}
              step="0.1"
              value={text}
              onChange={(e) => onType(e.target.value)}
              placeholder="—"
              aria-describedby={hint ? hintId : undefined}
              aria-invalid={invalid || undefined}
              className="focus-ring w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg font-bold tabular-nums text-slate-900"
            />
            <div
              role="radiogroup"
              aria-label="Weight unit"
              onKeyDown={(e) => onRadioKeyDown(e, unitIndex, (i) => setUnit(UNITS[i]))}
              className="flex overflow-hidden rounded-lg border border-slate-300"
            >
              {UNITS.map((u, i) => (
                <button
                  key={u}
                  type="button"
                  role="radio"
                  aria-checked={unit === u}
                  tabIndex={radioTabIndex(i, unitIndex)}
                  onClick={() => setUnit(u)}
                  className={`focus-ring-inset tap-target px-3 text-sm font-semibold transition ${
                    unit === u ? "bg-primary-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {need.includes("sex") && (
          <div className="flex flex-col">
            <span id={sexLabelId} className="mb-1 text-[11px] font-medium text-slate-600">
              Sex
            </span>
            <div
              role="radiogroup"
              aria-labelledby={sexLabelId}
              onKeyDown={(e) => onRadioKeyDown(e, sexIndex, (i) => onChange("sex", SEXES[i]))}
              className="flex overflow-hidden rounded-lg border border-slate-300"
            >
              {SEXES.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={sex === s}
                  tabIndex={radioTabIndex(i, sexIndex)}
                  onClick={() => onChange("sex", s)}
                  className={`focus-ring-inset tap-target px-3 text-sm font-semibold capitalize transition ${
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
      {hint && (
        <p
          id={hintId}
          className={`mt-2 text-xs font-medium tabular-nums ${
            invalid ? "text-rose-600" : unit === "lb" ? "text-primary-800" : "text-slate-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
