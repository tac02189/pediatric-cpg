import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../lib/icons.jsx";

// Opens the official source PDF in a full-screen in-app overlay. This keeps the
// clinician inside the app (preserving their place in the workflow underneath)
// and works in installed/standalone PWA mode, where a target=_blank link to a
// same-origin file silently fails (there is no browser tab to open into).
export default function PdfButton({
  sourcePdf,
  title,
  variant = "ghost",
  label = "Official PDF",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const href = `${import.meta.env.BASE_URL}pdfs/${sourcePdf}`;
  const styles =
    variant === "solid"
      ? "bg-primary-600 text-white hover:bg-primary-700"
      : variant === "outline"
      ? "border border-primary-300 bg-white text-primary-700 hover:bg-primary-50"
      : "text-primary-700 hover:bg-primary-50";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`focus-ring tap-target inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${styles} ${className}`}
      >
        <Icon name="FileText" size={16} />
        {label}
      </button>
      {open && (
        <PdfOverlay href={href} title={title || "Official guideline PDF"} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function PdfOverlay({ href, title, onClose }) {
  const [loading, setLoading] = useState(true);
  const pushedRef = useRef(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Push a history entry so the device Back button / swipe-back closes the
    // viewer instead of leaving the page. (Guarded against StrictMode double-run.)
    if (!pushedRef.current) {
      window.history.pushState({ pdfViewer: true }, "");
      pushedRef.current = true;
    }
    const onPop = () => onClose();
    const onKey = (e) => {
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    const safety = setTimeout(() => setLoading(false), 6000);

    return () => {
      clearTimeout(safety);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Close through history so the pushed entry is consumed (no orphan back-press).
  const close = () => window.history.back();

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-slate-900"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex items-center gap-1 border-b border-white/10 bg-brand-black px-2 py-2"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={close}
          className="focus-ring tap-target inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
        >
          <Icon name="ArrowLeft" size={18} />
          Back
        </button>
        <span className="min-w-0 flex-1 truncate px-1 text-center text-sm font-semibold text-white">
          {title}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in a new tab"
          title="Open in a new tab"
          className="focus-ring tap-target inline-flex items-center rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Icon name="ExternalLink" size={18} />
        </a>
        <a
          href={href}
          download
          aria-label="Download PDF"
          title="Download PDF"
          className="focus-ring tap-target inline-flex items-center rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Icon name="Download" size={18} />
        </a>
      </div>

      <div className="relative flex-1 bg-white">
        {loading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            Loading PDF…
          </div>
        )}
        <iframe
          src={href}
          title={title}
          onLoad={() => setLoading(false)}
          className="h-full w-full border-0"
        />
      </div>
    </div>,
    document.body
  );
}
