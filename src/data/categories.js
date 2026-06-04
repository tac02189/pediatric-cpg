// Clinical category taxonomy for the home page. `accent` is a Tailwind color
// family; the exact utility classes are safelisted in tailwind.config.js so the
// dynamic `bg-${accent}-50` etc. survive purge.

export const CATEGORIES = [
  {
    id: "respiratory",
    label: "Respiratory & Airway",
    icon: "Wind",
    accent: "sky",
    blurb: "Breathing, stridor, and airway emergencies",
  },
  {
    id: "abdominal-gi",
    label: "Abdominal & GI",
    icon: "Soup",
    accent: "amber",
    blurb: "Belly pain, obstruction, and feeding-tube issues",
  },
  {
    id: "infectious",
    label: "Infectious Disease",
    icon: "Bug",
    accent: "emerald",
    blurb: "Infections, fever, and antibiotic pathways",
  },
  {
    id: "trauma-critical",
    label: "Trauma & Critical Care",
    icon: "Activity",
    accent: "rose",
    blurb: "Resuscitation, intubation, and burns",
  },
  {
    id: "child-protection",
    label: "Child Protection",
    icon: "ShieldAlert",
    accent: "violet",
    blurb: "Non-accidental trauma and abuse management",
  },
];

const BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id) {
  return BY_ID[id] || null;
}

export function categoryOrder(id) {
  const i = CATEGORIES.findIndex((c) => c.id === id);
  return i === -1 ? CATEGORIES.length : i;
}

// Centralized accent class strings (all members are safelisted).
export function accentClasses(accent) {
  return {
    text: `text-${accent}-700`,
    textStrong: `text-${accent}-800`,
    bgSoft: `bg-${accent}-50`,
    bgChip: `bg-${accent}-100`,
    bgSolid: `bg-${accent}-600`,
    border: `border-${accent}-200`,
    borderHover: `hover:border-${accent}-300`,
    ring: `ring-${accent}-200`,
  };
}
