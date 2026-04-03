# EPR Migration & Archiving — ROI Calculator

## Quick start

```bash
npm install
npm run dev     # dev server on localhost:3000
npm run build   # production build → dist/
```

## Architecture

Single-component React app. All logic lives in `src/ROICalculator.jsx`.

### Key sections

| Section | Description |
|---------|-------------|
| **Model constants** (top) | `STAFF_PER_BED`, `BLENDED_HOURLY_RATE`, etc. All tuneable assumptions extracted as named constants. |
| **SCENARIO / CX / DQ** | Scenario multipliers (Conservative/Expected/Stretch), complexity and data quality scaling factors. |
| **PRESETS** | Quick-start templates (Small/Typical/Large/Regional) with pre-filled inputs. |
| **`calc()`** | Pure function. Takes inputs + overrides + flagships, returns all derived values. No side effects. |
| **Helper components** | `Card`, `AnimatedSlider`, `TogglePill`, `ResultCard`, `OverridableStat`, etc. |
| **`ROICalculator`** | Main component. Manages state, renders input wizard → calculating animation → results page. |
| **`generatePDF()`** | Builds a styled A4 HTML document and opens it in a new tab for print-to-PDF. |

### Fonts

The component references **National 2 Condensed Bold** (header) and **FK Grotesk Neue** (body). These are proprietary fonts — you'll need to host them and add `@font-face` declarations to `styles.css` or `index.html`. System fallbacks are included (`Arial Narrow`, `Inter`, `Helvetica Neue`).

### Colours

Corporate palette defined in the `C` constant object:

- Dark Teal: `#0F4146` (primary)
- Pale Green: `#EEF7F1` (card backgrounds)
- Light Seafoam: `#BEFAF0` (accents)
- Seafoam: `#80F8E4` (header highlight)
- Blue: `#73D2E1` (secondary, with 75%/50%/25% opacity variants)

### Styles

- `src/styles.css` — All animations, hover effects, touch/mobile overrides.
- Hover interactions use `.roi-*` class names applied to components.
- `@media (hover: none)` disables transform-based hovers on touch devices.
- `@media (max-width: 480px)` handles narrow-screen layout adjustments.

### Overrides & flagships

Users can override any calculated value (tier costs, staff count, minutes wasted, etc.) on both the input and results pages. "Named high-cost systems" (flagships) sit outside the tier model for outlier systems like a legacy PAS at £500k/yr.

### PDF output

The "Download PDF report" button generates a self-contained HTML document with inline styles, opened in a new tab. The browser's print dialog handles PDF conversion. No server-side dependencies.

## Evidence base

All model assumptions are documented in the methodology report (`roi-methodology-report.docx`), classifying each as evidence-based, industry benchmark, or modelled estimate. Every figure is user-overridable.
