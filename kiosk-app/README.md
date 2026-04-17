# ROI Calculator — US Kiosk (Touchscreen)

Conference kiosk app for RLDatix Galen Clinical Archive ROI estimation.  
Portrait 1080×1920 (9:16), dark theme, touch-optimized.

## Deploy to Netlify

**Option 1 — Drag & drop:**
1. Run `npm install && npm run build`
2. Drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

**Option 2 — Git deploy:**
1. Push this folder to a GitHub repo
2. Connect the repo in Netlify
3. Build settings are in `netlify.toml` (auto-detected)

**Option 3 — Netlify CLI:**
```bash
npm install
npm run build
npx netlify-cli deploy --prod --dir=dist
```

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Use browser DevTools to set viewport to 1080×1920 for kiosk preview.

## Architecture

```
src/
  main.jsx              Entry point
  App.jsx               State management, routing, calibrating screen
  theme.js              Colors, fonts, formatters, step labels
  calc/
    engine.js           Calc function + 50+ US model constants
    presets.js           Provider presets, multipliers
    vendors.js           29 US legacy systems + cost function
  components/
    index.jsx           Card, StepIndicator, NavButtons, TouchSlider,
                        Stepper, InfoTip, BigChoice, SegmentedControl
  steps/
    index.jsx           ProviderStep, JourneyStep, FacilitiesStep,
                        SystemsStep, FineTuneStep
  results/
    ResultsPage.jsx     KPIs, breakdown, methodology, Galen case
```

Build: ~189KB (59KB gzip). Fully offline-capable.
