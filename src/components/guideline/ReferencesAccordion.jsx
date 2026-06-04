import { Icon } from "../../lib/icons.jsx";

function FootnoteBody({ content }) {
  if (Array.isArray(content)) {
    return (
      <ul className="mt-0.5 space-y-0.5 pl-3">
        {content.map((line, i) => (
          <li key={i} className="list-disc">
            {line}
          </li>
        ))}
      </ul>
    );
  }
  return <span>{content}</span>;
}

// Collapsed-by-default disclosure with the guideline's footnotes and citations.
export default function ReferencesAccordion({ guideline }) {
  const footnotes = guideline.footnotes ? Object.entries(guideline.footnotes) : [];
  const refs = guideline.references || [];
  if (footnotes.length === 0 && refs.length === 0) return null;

  return (
    <details className="group mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <summary className="focus-ring flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700">
        <Icon name="BookOpen" size={16} className="text-slate-400" />
        References &amp; notes
        <Icon
          name="ChevronDown"
          size={16}
          className="ml-auto text-slate-400 transition group-open:rotate-180"
        />
      </summary>
      <div className="space-y-4 border-t border-slate-100 px-4 py-3">
        {footnotes.length > 0 && (
          <div>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">Notes</h4>
            <dl className="space-y-1.5 text-xs leading-relaxed text-slate-600">
              {footnotes.map(([marker, content]) => (
                <div key={marker} className="flex gap-1.5">
                  <dt className="font-bold text-slate-400">{marker}.</dt>
                  <dd className="min-w-0 flex-1">
                    <FootnoteBody content={content} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {refs.length > 0 && (
          <div>
            <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
              References
            </h4>
            <ol className="space-y-1.5 text-xs leading-relaxed text-slate-600">
              {refs.map((r, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="font-bold text-slate-400">{i + 1}.</span>
                  <span className="min-w-0 flex-1">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </details>
  );
}
