import { tone } from "../../lib/tones.js";
import { Icon } from "../../lib/icons.jsx";

// Side-note pinned to a node (e.g. "Consider bacterial tracheitis", discharge
// criteria). Not part of the decision path.
export default function CalloutCard({ callout }) {
  const t = tone(callout.tone);
  const body = Array.isArray(callout.body) ? callout.body : [callout.body];

  return (
    <div className={`rounded-xl border p-3 ${t.card}`}>
      <div className="flex items-center gap-1.5 text-sm font-bold">
        <Icon name={t.icon} size={16} className="shrink-0" />
        {callout.title}
      </div>
      {body.length === 1 ? (
        <p className="mt-1 text-[13px] leading-relaxed">{body[0]}</p>
      ) : (
        <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed">
          {body.map((line, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
