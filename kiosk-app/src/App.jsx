import React, { useState, useMemo, useCallback } from 'react';
import { C, KIOSK_STEPS } from './theme';
import { calc } from './calc/engine';
import { PRESETS, PROVIDER_PRESET_MAP, PROVIDER_MULTIPLIERS, REIMBURSE_MULTIPLIERS } from './calc/presets';
import { StepIndicator, NavButtons } from './components';
import { ProviderStep, JourneyStep, OrgScaleStep, SystemsStep, FineTuneStep } from './steps';
import { ResultsPage } from './results/ResultsPage';

export default function App() {
  // ── State ──
  const [kioskStep, setKioskStep] = useState(0);
  const [providerType, setProviderType] = useState("community");
  const [reimbursementModel, setReimbursementModel] = useState("mixed");
  const [occupancyRate, setOccupancyRate] = useState(0.65);
  const [galenMigrationCost, setGalenMigrationCost] = useState(0);
  const [galenAnnualCost, setGalenAnnualCost] = useState(0);
  const [scenarioMode, setScenarioMode] = useState("EXPECTED");

  const [inputs, setInputs] = useState({
    ...PRESETS.TYPICAL.data,
    data_types: { ...PRESETS.TYPICAL.data.data_types },
    tiers: { ...PRESETS.TYPICAL.data.tiers },
  });

  const [flagships] = useState([]);

  // ── Updaters ──
  const update = useCallback((key, val) => {
    setInputs(p => ({ ...p, [key]: val }));
  }, []);

  const updateTier = useCallback((tier, val) => {
    setInputs(p => ({ ...p, tiers: { ...p.tiers, [tier]: val } }));
  }, []);

  const applyPreset = useCallback((key) => {
    const p = PRESETS[key];
    if (!p) return;
    setInputs({
      ...p.data,
      data_types: { ...p.data.data_types },
      tiers: { ...p.data.tiers },
    });
  }, []);

  const selectProvider = useCallback((key) => {
    setProviderType(key);
    const pk = PROVIDER_PRESET_MAP[key];
    if (pk) applyPreset(pk);
  }, [applyPreset]);

  // ── Calc inputs ──
  const calcInputs = useMemo(() => {
    const pm = PROVIDER_MULTIPLIERS[providerType] || PROVIDER_MULTIPLIERS.community;
    const rm = REIMBURSE_MULTIPLIERS[reimbursementModel] || REIMBURSE_MULTIPLIERS.mixed;
    return {
      ...inputs,
      _abfPct: pm.abf_pct || 0.72,
      _privateWeight: rm.private_weight || 1.0,
      _efficiencyWeight: rm.efficiency_weight || 1.0,
      _medicareDrgRevenue: 0,
      _occupancy: occupancyRate,
      _providerType: providerType,
      _lhdCount: 0,
      _privatePct: pm.private_pct || 0.15,
      _portfolioSystems: 0,
      _portfolioStaff: 0,
      _portfolioCost: 0,
    };
  }, [inputs, providerType, reimbursementModel, occupancyRate]);

  // ── Results ──
  const r = useMemo(() => calc(calcInputs, scenarioMode, {}, flagships), [calcInputs, scenarioMode, flagships]);

  // ── Navigation ──
  const handleNext = () => setKioskStep(p => p + 1);
  const handleBack = () => setKioskStep(p => p - 1);
  const handleCalculate = () => setKioskStep(KIOSK_STEPS.length - 1);
  const handleReset = () => { setKioskStep(0); };

  // ── Render ──
  const renderStep = () => {
    switch (kioskStep) {
      case 0: return <ProviderStep providerType={providerType} onSelect={selectProvider} />;
      case 1: return <JourneyStep journey={inputs.journey} onSelect={v => update("journey", v)} />;
      case 2: return <OrgScaleStep inputs={inputs} update={update}
                reimbursementModel={reimbursementModel} setReimbursementModel={setReimbursementModel} />;
      case 3: return <SystemsStep inputs={inputs} updateTier={updateTier} />;
      case 4: return <FineTuneStep inputs={inputs} update={update}
                galenMigrationCost={galenMigrationCost} setGalenMigrationCost={setGalenMigrationCost}
                galenAnnualCost={galenAnnualCost} setGalenAnnualCost={setGalenAnnualCost}
                occupancyRate={occupancyRate} setOccupancyRate={setOccupancyRate} />;
      case 5: return <ResultsPage r={r}
                galenMigrationCost={galenMigrationCost} galenAnnualCost={galenAnnualCost}
                onReset={handleReset} />;
      default: return null;
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", background: C.bg, height: "100vh",
      color: C.text, lineHeight: 1.55, display: "flex", flexDirection: "column", overflow: "hidden"
    }}>
      {/* Step indicator */}
      <div style={{ padding: "36px 60px 0", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <StepIndicator steps={KIOSK_STEPS} current={kioskStep} onJump={setKioskStep} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <NavButtons
        step={kioskStep}
        totalSteps={KIOSK_STEPS.length}
        onBack={handleBack}
        onNext={handleNext}
        onCalculate={handleCalculate}
      />
    </div>
  );
}
