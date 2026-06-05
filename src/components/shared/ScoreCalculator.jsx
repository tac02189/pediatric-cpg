import { evaluateScore } from "../../engine/scoring.js";
import { tone } from "../../lib/tones.js";
import { Icon } from "../../lib/icons.jsx";

// Controlled scoring tool — additive (point-tally) or rule (boolean/numeric).
// Inputs live in the caller's state; this component renders the items and a live
// result readout. The score node computes routing separately from the same inputs.
export default function ScoreCalculator({ calc, inputs = {}, onInput }) {
  const result =
    calc.engine === "rule"
      ? evaluateScore(calc, { inputs })
      : evaluateScore(calc, { selections: inputs });

  return (
    <div className="space-y-3">
      {calc.engine === "rule" ? (
        <RuleItems calc={calc} inputs={inputs} onInput={onInput} />
      ) : (
        <AdditiveItems calc={calc} inputs={inputs} onInput={onInput} />
      )}
      <ResultReadout calc={calc} result={result} />
    </div>
  );
}

function AdditiveItems({ calc, inputs, onInput }) {
  return (
    <div className="space-y-2.5">
      {calc.items.map((item) => {
        const selected = inputs[item.id];
        return (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800">{item.label}</span>
              {typeof selected === "number" && (
                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold tabular-nums text-slate-600">
                  +{selected}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.options.map((opt, oi) => {
                const on = selected === opt.value;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => onInput(item.id, opt.value)}
                    className={`focus-ring inline-flex min-h-[42px] items-center rounded-lg border px-3 py-2 text-left text-[13px] font-medium transition ${
                      on
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {opt.label}
                    <span className={`ml-1 tabular-nums ${on ? "text-white/80" : "text-slate-400"}`}>
                      ({opt.value >= 0 ? "+" : ""}
                      {opt.value})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RuleItems({ calc, inputs, onInput }) {
  return (
    <div className="space-y-2">
      {calc.criteria.map((c) => {
        if (c.type === "number") {
          return (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-800">{c.label}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={typeof inputs[c.id] === "number" ? inputs[c.id] : ""}
                  onChange={(e) =>
                    onInput(c.id, e.target.value === "" ? null : Number(e.target.value))
                  }
                  placeholder="—"
                  className="focus-ring w-28 rounded-lg border border-slate-300 px-3 py-2 text-base font-bold tabular-nums text-slate-900"
                />
              </label>
              {c.help && <p className="mt-1 text-xs text-slate-500">{c.help}</p>}
            </div>
          );
        }
        const on = inputs[c.id] === true;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onInput(c.id, !on)}
            className={`focus-ring tap-target flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
              on ? "border-primary-300 bg-primary-50" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                on ? "border-primary-600 bg-primary-600 text-white" : "border-slate-300 bg-white"
              }`}
            >
              {on && <Icon name="CheckCheck" size={13} strokeWidth={3} />}
            </span>
            <span className="text-sm text-slate-800">
              {c.label}
              {c.help && <span className="mt-0.5 block text-xs font-normal text-slate-500">{c.help}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ResultReadout({ calc, result }) {
  const bandTone = result.band?.tone || (result.complete ? "info" : "neutral");
  const t = tone(bandTone);

  return (
    <div className={`rounded-xl border p-3 ${result.complete ? t.card : "border-slate-200 bg-slate-50 text-slate-500"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
          {calc.name}
        </span>
        {calc.engine !== "rule" && (
          <span className="font-display text-2xl font-extrabold tabular-nums">
            {result.total}
          </span>
        )}
      </div>
      <div className="mt-0.5 text-sm font-bold">
        {result.complete ? result.label || "—" : "Answer all items to score"}
      </div>
      {result.complete && result.detail && (
        <p className="mt-1 text-[13px] leading-relaxed opacity-90">{result.detail}</p>
      )}
    </div>
  );
}
