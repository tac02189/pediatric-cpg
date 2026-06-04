import { Icon } from "../../lib/icons.jsx";

// Links to the official source PDF. Opens in the device's native viewer/new tab
// (most reliable on mobile). BASE_URL keeps the path correct under any deploy base.
export default function PdfButton({ sourcePdf, variant = "ghost", label = "Official PDF", className = "" }) {
  const href = `${import.meta.env.BASE_URL}pdfs/${sourcePdf}`;
  const styles =
    variant === "solid"
      ? "bg-primary-600 text-white hover:bg-primary-700"
      : variant === "outline"
      ? "border border-primary-300 bg-white text-primary-700 hover:bg-primary-50"
      : "text-primary-700 hover:bg-primary-50";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`focus-ring tap-target inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${styles} ${className}`}
    >
      <Icon name="FileText" size={16} />
      {label}
    </a>
  );
}
