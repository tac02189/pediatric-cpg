// Global footer with the standing safety disclaimer.
export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center">
        <p className="text-xs leading-relaxed text-slate-500">
          A bedside convenience tool transcribed from the official University of Missouri
          Pediatric Service Line Clinical Practice Guidelines. Always verify against the source
          document and your clinical judgment. Not a substitute for institutional policy.
        </p>
        <p className="mt-2 text-[11px] text-slate-400">
          For use by qualified clinicians · No patient data is stored
        </p>
      </div>
    </footer>
  );
}
