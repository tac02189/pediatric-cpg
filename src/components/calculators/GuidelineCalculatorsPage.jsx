import { useParams, Link, Navigate } from "react-router-dom";
import { getGuideline } from "../../data/index.js";
import { Icon } from "../../lib/icons.jsx";
import StandaloneCalculator, { calculatorName } from "../shared/StandaloneCalculator.jsx";
import PdfButton from "../shared/PdfButton.jsx";

export default function GuidelineCalculatorsPage() {
  const { id } = useParams();
  const guideline = getGuideline(id);
  if (!guideline) return <Navigate to="/" replace />;

  const calcs = Object.entries(guideline.calculators || {});

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
      <p className="mb-5 text-sm text-slate-500">
        Quick access to this guideline’s tools without walking the pathway.
      </p>

      {calcs.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          This guideline has no standalone calculators.
        </div>
      ) : (
        <div className="space-y-4">
          {calcs.map(([calcId, calc]) => (
            <section key={calcId} className="rounded-xl2 border border-slate-200 bg-white p-4 shadow-card">
              <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-bold text-slate-900">
                <Icon name={calc.kind === "dosing" ? "Pill" : "ListChecks"} size={17} className="text-primary-600" />
                {calculatorName(calc, calcId)}
              </h2>
              <StandaloneCalculator calc={calc} />
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
