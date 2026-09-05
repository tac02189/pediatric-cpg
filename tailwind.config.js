/** @type {import('tailwindcss').Config} */

// Category accent palettes are applied dynamically (one per clinical category),
// so the exact utility classes must be safelisted or Tailwind's purge will drop them.
const accentColors = ["sky", "amber", "emerald", "rose", "violet", "indigo"];
const accentShades = {
  bg: [50, 100, 500, 600],
  text: [600, 700, 800],
  border: [200, 300],
  ring: [200, 400],
};

const safelist = [];
for (const color of accentColors) {
  for (const shade of accentShades.bg) safelist.push(`bg-${color}-${shade}`);
  for (const shade of accentShades.text) safelist.push(`text-${color}-${shade}`);
  for (const shade of accentShades.border) safelist.push(`border-${color}-${shade}`);
  for (const shade of accentShades.ring) safelist.push(`ring-${color}-${shade}`);
  safelist.push(`hover:bg-${color}-100`);
  safelist.push(`hover:border-${color}-300`);
}
// Tone classes used by outcome/callout cards (success/info/warning/danger).
const toneColors = ["emerald", "sky", "amber", "rose"];
for (const color of toneColors) {
  safelist.push(`bg-${color}-50`, `border-${color}-200`, `text-${color}-700`, `text-${color}-800`);
}

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist,
  theme: {
    extend: {
      fontFamily: {
        // Clinical Index redesign: one workhorse face for everything. `display`
        // is kept as a token (headings differ by weight, not family) so the
        // existing font-display call sites stay valid.
        display: ['"Source Sans 3 Variable"', "system-ui", "sans-serif"],
        sans: ['"Source Sans 3 Variable"', "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // Mizzou brand gold — reserved for the header/brand bar only.
        brand: {
          gold: "#F1B82D",
          deepgold: "#B8860B",
          black: "#1a1a1a",
        },
        // Primary clinical accent — calm teal.
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
    },
  },
  plugins: [],
};
