export const C = {
  bg: "#0a0f1a", surface: "#141b2d", border: "#2a3548", borderLight: "#1e2840",
  text: "#e8edf5", textMid: "#a0b0c0", textMuted: "#8494a8",
  accent: "#00d4aa", accentLight: "#003328", accentPale: "#0a2520",
  green: "#00d4aa", greenPale: "#0a2520",
  amber: "#f0a040", amberLight: "#2a2010",
  teal: "#00d4aa", tealLight: "#00ffc8", tealPale: "#0a2a22",
  rose: "#ff4f7a", rosePale: "#2a1020",
  blue: "#40b0ff", purple: "#c090f0",
};
export const F = { hero: 108, h1: 40, h2: 28, h3: 22, body: 18, small: 16, tiny: 14, label: 15 };
export const W = 1080, H = 1920;
export const fmt = n => typeof n === "number" ? n.toLocaleString("en-US") : n;
export const fmtK = n => n >= 1e6 ? `$${(n/1e6).toFixed(1)}m` : n >= 1000 ? `$${Math.round(n/1000).toLocaleString("en-US")}k` : `$${fmt(n)}`;
export const fmtNum = n => typeof n === "number" ? n.toLocaleString("en-US") : n;
export const KIOSK_STEPS = ["Scope", "Journey", "Facilities", "Systems", "Fine-tune", "Results"];

export const FACILITY_TYPES = [
  { key: "hospitals", label: "Hospitals", iconKey: "hospital", hasBeds: true },
  { key: "ambulatory_surgery", label: "Ambulatory Surgery Centers", iconKey: "surgery" },
  { key: "physician_practices", label: "Physician Practices", iconKey: "physician" },
  { key: "urgent_care", label: "Urgent Care Centers", iconKey: "urgentCare" },
  { key: "imaging_centers", label: "Imaging Centers", iconKey: "imaging" },
  { key: "dialysis", label: "Dialysis Centers", iconKey: "dialysis" },
  { key: "snf", label: "Skilled Nursing Facilities", iconKey: "snf" },
  { key: "home_health", label: "Home Health Agencies", iconKey: "homeHealth" },
  { key: "behavioral", label: "Behavioral Health", iconKey: "behavioral" },
  { key: "rehab", label: "Rehabilitation Centers", iconKey: "rehab" },
  { key: "ltach", label: "Long-Term Acute Care", iconKey: "ltach" },
];
