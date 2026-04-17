// Dark kiosk theme — 1080x1920 portrait touchscreen
export const C = {
  bg: "#0a0f1a", surface: "#141b2d", border: "#2a3548", borderLight: "#1e2840",
  text: "#e8edf5", textMid: "#a0b0c0", textMuted: "#607080",
  accent: "#00d4aa", accentLight: "#003328", accentPale: "#0a2520",
  green: "#00d4aa", greenPale: "#0a2520",
  amber: "#f0a040", amberLight: "#2a2010",
  teal: "#00d4aa", tealLight: "#00ffc8", tealPale: "#0a2a22",
  rose: "#ff4f7a", rosePale: "#2a1020",
  blue: "#40b0ff",
  purple: "#c090f0",
};

// Portrait kiosk — taller screen, more vertical space
export const F = {
  hero: 108, h1: 40, h2: 28, h3: 22, body: 18, small: 16, tiny: 14, label: 15,
};

export const W = 1080; // native width
export const H = 1920; // native height

export const fmt = n => typeof n === "number" ? n.toLocaleString("en-US") : n;
export const fmtK = n => n >= 1e6 ? `$${(n/1e6).toFixed(1)}m` : n >= 1000 ? `$${Math.round(n/1000).toLocaleString("en-US")}k` : `$${fmt(n)}`;
export const fmtNum = n => typeof n === "number" ? n.toLocaleString("en-US") : n;

export const KIOSK_STEPS = [
  "Scope",
  "Journey",
  "Scale",
  "Systems",
  "Fine-tune",
  "Results"
];
