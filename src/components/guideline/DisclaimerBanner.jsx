import { Icon } from "../../lib/icons.jsx";

// Compact, always-visible safety line on every guideline. Stronger wording when
// the guideline hasn't been physician-verified yet.
export default function DisclaimerBanner({ guideline }) {
  const draft = !guideline.verified;
  return (
    <div
      className={`border-b px-4 py-2 ${
        draft ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-start gap-1.5 text-[11px] leading-relaxed">
        <Icon name={draft ? "TriangleAlert" : "Info"} size={13} className="mt-0.5 shrink-0" />
        <p>
          {draft && <span className="font-bold">Draft — not yet physician-verified. </span>}
          Transcribed from the official MU CPG
          {guideline.version ? ` (${guideline.version}` : ""}
          {guideline.lastEdited ? `, ${guideline.lastEdited})` : guideline.version ? ")" : ""}. A
          convenience aid — always verify against the source PDF and your clinical judgment.
        </p>
      </div>
    </div>
  );
}
