import React from 'react';

// White outlined SVG icons — stroke-based, no fill
const I = ({ d, size = 24, stroke = "currentColor", sw = 1.8, viewBox = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
);

// ── Provider types ──
export const IconHospital = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="3" y="7" width="18" height="14" rx="2" />
  <path d="M12 7V3M9 3h6" />
  <path d="M12 11v4M10 13h4" />
</I>;

export const IconCommunity = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="4" y="6" width="16" height="15" rx="2" />
  <path d="M12 2v4M9 2h6" />
  <path d="M12 10v4M10 12h4" />
  <path d="M4 17h16" />
</I>;

export const IconRegional = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="2" y="8" width="20" height="13" rx="2" />
  <path d="M7 8V5a2 2 0 012-2h6a2 2 0 012 2v3" />
  <path d="M12 12v3M10 13.5h4" />
  <path d="M6 17h12" />
  <path d="M2 13h3M19 13h3" />
</I>;

export const IconAcademic = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M12 3L2 9l10 6 10-6-10-6z" />
  <path d="M6 11.5v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
  <path d="M20 9v7" />
</I>;

export const IconIDN = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="2" y="10" width="7" height="11" rx="1" />
  <rect x="15" y="10" width="7" height="11" rx="1" />
  <rect x="8" y="4" width="8" height="17" rx="1" />
  <path d="M12 8v3M11 9.5h2" />
  <path d="M5.5 14v2" />
  <path d="M18.5 14v2" />
</I>;

// ── Facility types ──
export const IconSurgery = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="12" cy="12" r="9" />
  <path d="M12 8v8M8 12h8" />
</I>;

export const IconPhysician = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M4.8 13.4a7 7 0 0010.4 4.6" />
  <path d="M9 3c-1.5 1-2.5 3-2.5 5s2 3.5 3.5 3.5S13.5 10 13.5 8 12 3.5 12 3.5" />
  <circle cx="18" cy="16" r="3" />
  <path d="M18 14.5v3M16.5 16h3" />
</I>;

export const IconUrgentCare = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="12" cy="12" r="10" />
  <path d="M12 7v10M7 12h10" />
</I>;

export const IconImaging = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="3" y="6" width="18" height="14" rx="2" />
  <circle cx="12" cy="13" r="4" />
  <circle cx="12" cy="13" r="1.5" />
  <path d="M3 10h18" />
</I>;

export const IconDialysis = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M12 3c-3 0-6 2.5-6 6.5S9 16 12 21c3-5 6-8 6-11.5S15 3 12 3z" />
  <path d="M12 8v5M10 10.5h4" />
</I>;

export const IconSNF = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M3 21V10l9-7 9 7v11" />
  <path d="M9 21v-6h6v6" />
  <path d="M12 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
</I>;

export const IconHomeHealth = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M3 21V10l9-7 9 7v11" />
  <path d="M12 13v4M10 15h4" />
</I>;

export const IconBehavioral = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M12 2a7 7 0 017 7c0 2.5-1.5 4-3 5s-2 2.5-2 4" />
  <path d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4 3 5s2 2.5 2 4" />
  <path d="M12 18v3" />
  <path d="M9 9.5c1 1 2 1 3 0" />
</I>;

export const IconRehab = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="12" cy="5" r="2" />
  <path d="M12 7v5" />
  <path d="M8 10l4 2 4-2" />
  <path d="M10 12l-3 9M14 12l3 9" />
</I>;

export const IconLTACH = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M3 18h18" />
  <path d="M5 18V9h14v9" />
  <path d="M3 12h4M17 12h4" />
  <path d="M9 13h6" />
  <path d="M9 15.5h4" />
</I>;

// ── Results / KPI icons ──
export const IconUnlock = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="5" y="11" width="14" height="10" rx="2" />
  <path d="M8 11V7a4 4 0 018 0" />
  <circle cx="12" cy="16" r="1" />
</I>;

export const IconClock = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="12" cy="12" r="10" />
  <path d="M12 6v6l4 2" />
</I>;

export const IconDollar = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M12 2v20" />
  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
</I>;

export const IconShield = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M12 2l8 4v5c0 5.25-3.5 9.75-8 11-4.5-1.25-8-5.75-8-11V6l8-4z" />
  <path d="M9 12l2 2 4-4" />
</I>;

export const IconNetwork = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="12" cy="5" r="2.5" />
  <circle cx="4.5" cy="19" r="2.5" />
  <circle cx="19.5" cy="19" r="2.5" />
  <path d="M12 7.5v4M7 18l3.5-6.5M17 18l-3.5-6.5" />
</I>;

export const IconGraduation = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M12 3L2 9l10 6 10-6-10-6z" />
  <path d="M6 11.5v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
  <path d="M20 9v7" />
</I>;

export const IconCalendar = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <rect x="3" y="5" width="18" height="16" rx="2" />
  <path d="M8 3v4M16 3v4M3 10h18" />
  <path d="M8 14h2M11 14h2M14 14h2" />
  <path d="M8 17h2M11 17h2" />
</I>;

export const IconLightbulb = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <path d="M9 18h6M10 21h4" />
  <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
</I>;

export const IconCheck = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="12" cy="12" r="10" />
  <path d="M8 12l3 3 5-6" />
</I>;

export const IconSearch = ({ size, stroke }) => <I size={size} stroke={stroke}>
  <circle cx="11" cy="11" r="7" />
  <path d="M16 16l5 5" />
</I>;

// Lookup map for dynamic usage
export const ICONS = {
  hospital: IconHospital,
  community: IconCommunity,
  regional: IconRegional,
  academic: IconAcademic,
  idn: IconIDN,
  surgery: IconSurgery,
  physician: IconPhysician,
  urgentCare: IconUrgentCare,
  imaging: IconImaging,
  dialysis: IconDialysis,
  snf: IconSNF,
  homeHealth: IconHomeHealth,
  behavioral: IconBehavioral,
  rehab: IconRehab,
  ltach: IconLTACH,
  unlock: IconUnlock,
  clock: IconClock,
  dollar: IconDollar,
  shield: IconShield,
  network: IconNetwork,
  graduation: IconGraduation,
  calendar: IconCalendar,
  lightbulb: IconLightbulb,
  check: IconCheck,
  search: IconSearch,
};

export function Icon({ name, size = 24, stroke = "currentColor" }) {
  const Comp = ICONS[name];
  return Comp ? <Comp size={size} stroke={stroke} /> : null;
}
