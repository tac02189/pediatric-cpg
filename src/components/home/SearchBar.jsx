import { Icon } from "../../lib/icons.jsx";

export default function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <Icon name="Search" size={19} />
      </span>
      <input
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search guidelines, e.g. stridor, RLQ pain, fever…"
        aria-label="Search guidelines"
        className="focus-ring w-full rounded-xl2 border border-slate-200 bg-white py-3 pl-11 pr-10 text-base text-slate-800 shadow-card placeholder:text-slate-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="focus-ring absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
        >
          <Icon name="X" size={18} />
        </button>
      )}
      {value && (
        <p className="mt-2 pl-1 text-xs text-slate-500" aria-live="polite">
          {resultCount} {resultCount === 1 ? "guideline" : "guidelines"} found
        </p>
      )}
    </div>
  );
}
