// Inline footnotes cited by a node — rendered right where they're referenced so
// the clinician doesn't lose context. Footnote content may be a string or a
// nested string[] (the child-protection guidelines have multi-level notes).

function Body({ content }) {
  if (Array.isArray(content)) {
    return (
      <ul className="space-y-0.5">
        {content.map((line, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <span>{content}</span>;
}

export default function FootnoteList({ footnotes, refs }) {
  const items = (refs || [])
    .map((marker) => ({ marker, content: footnotes?.[marker] }))
    .filter((x) => x.content != null);

  if (items.length === 0) return null;

  return (
    <div className="mt-3 space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
      {items.map(({ marker, content }) => (
        <div key={marker} className="flex gap-1.5 text-xs leading-relaxed text-slate-600">
          <span className="font-bold text-slate-400">{marker}.</span>
          <div className="min-w-0 flex-1">
            <Body content={content} />
          </div>
        </div>
      ))}
    </div>
  );
}
