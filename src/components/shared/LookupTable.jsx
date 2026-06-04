// Reference lookup table (e.g. RSI age-indexed ETT / blade / LMA sizing).
// Display-only — horizontally scrollable on small screens, first column pinned.
export default function LookupTable({ table }) {
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-left">
            {table.columns.map((col, i) => (
              <th
                key={i}
                className={`whitespace-nowrap px-3 py-2 font-display text-xs font-bold uppercase tracking-wide text-slate-600 ${
                  i === 0 ? "sticky left-0 bg-slate-100" : ""
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r} className="border-t border-slate-100 even:bg-slate-50/60">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`whitespace-nowrap px-3 py-2 tabular-nums text-slate-700 ${
                    c === 0 ? "sticky left-0 bg-inherit font-semibold text-slate-900" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
