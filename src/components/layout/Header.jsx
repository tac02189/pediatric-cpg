import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../../lib/icons.jsx";

// Brand bar. Mizzou gold accent over near-black is the one place gold is used
// prominently (the rest of the app stays calm/clinical).
export default function Header() {
  const { pathname } = useLocation();
  const onCalculators = pathname === "/calculators";
  const ref = useRef(null);

  // Publish the header's real height as a CSS variable so sticky elements below
  // it (the workflow breadcrumb) can offset correctly at any breakpoint / after
  // font reflow — no brittle magic numbers.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--app-header-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-30 border-b-4 border-brand-gold bg-brand-black/95 backdrop-blur supports-[backdrop-filter]:bg-brand-black/85"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="focus-ring flex min-w-0 items-center gap-2.5 rounded-lg">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold text-brand-black shadow-sm">
            <Icon name="Stethoscope" size={20} strokeWidth={2.4} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-bold text-white">
              Pediatric Guidelines
            </span>
            <span className="hidden truncate text-[11px] text-brand-gold sm:block">
              University of Missouri · Pediatric Service Line
            </span>
          </span>
        </Link>

        <Link
          to="/calculators"
          aria-current={onCalculators ? "page" : undefined}
          className={`focus-ring tap-target ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
            onCalculators ? "bg-brand-gold text-brand-black" : "text-white/90 hover:bg-white/10"
          }`}
        >
          <Icon name="Calculator" size={17} strokeWidth={2.2} />
          <span>Calculators</span>
        </Link>
      </div>
    </header>
  );
}
