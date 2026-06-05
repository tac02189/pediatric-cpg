import { Link } from "react-router-dom";
import { Icon } from "../../lib/icons.jsx";
import { getCategory, accentClasses } from "../../data/categories.js";
import PdfButton from "../shared/PdfButton.jsx";

export default function GuidelineHeader({ guideline }) {
  const cat = getCategory(guideline.category);
  const a = accentClasses(cat?.accent || "sky");

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 pb-3 pt-3">
        <Link
          to="/"
          className="focus-ring -ml-1 mb-2 inline-flex items-center gap-1 rounded px-1 py-0.5 text-sm font-medium text-slate-500 hover:text-primary-700"
        >
          <Icon name="ChevronLeft" size={16} />
          All guidelines
        </Link>

        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.bgChip} ${a.text}`}>
            <Icon name={guideline.icon} size={23} strokeWidth={2.1} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-extrabold leading-tight text-slate-900">
                {guideline.fullTitle || guideline.title}
              </h1>
              {!guideline.verified && (
                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                  Draft
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              {cat && <span className={`font-semibold ${a.text}`}>{cat.label}</span>}
              {guideline.version && <span>· {guideline.version}</span>}
              {guideline.lastEdited && <span>· Edited {guideline.lastEdited}</span>}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <PdfButton
            sourcePdf={guideline.sourcePdf}
            title={guideline.fullTitle || guideline.title}
            variant="outline"
          />
          <Link
            to={`/guideline/${guideline.id}/calculators`}
            className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Icon name="Calculator" size={16} className="text-primary-600" />
            Calculators
          </Link>
        </div>
      </div>
    </div>
  );
}
