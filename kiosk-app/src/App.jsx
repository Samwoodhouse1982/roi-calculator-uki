import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { C, F, W, H, KIOSK_STEPS } from './theme';
import { calc } from './calc/engine';
import { PRESETS, PROVIDER_PRESET_MAP, PROVIDER_MULTIPLIERS, REIMBURSE_MULTIPLIERS } from './calc/presets';
import { systemCost } from './calc/vendors';
import { StepIndicator, NavButtons, PageTransition } from './components';
import { ProviderStep, JourneyStep, FacilitiesStep, SystemsStep, FineTuneStep } from './steps';
import { ResultsPage } from './results/ResultsPage';

function CalibratingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = ["Mapping your legacy estate", "Modelling decommission savings", "Estimating clinical capacity impact", "Calculating reimbursement recovery"];
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
      setTimeout(onDone, 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 60px" }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%,100% { opacity:.6; } 50% { opacity:1; } }`}</style>
    <div style={{ width: 80, height: 80, border: `4px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 40 }} />
    <div style={{ fontSize: F.h2, fontWeight: 700, color: C.accent, marginBottom: 32, animation: "pulse 1.5s ease-in-out infinite" }}>Calibrating your model</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 500 }}>
      {steps.map((label, i) => {
        const done = step > i, active = step === i;
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: done ? 1 : active ? 0.8 : 0.25, transition: "opacity .4s" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? C.accent : active ? C.accent + "40" : C.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {done && <span style={{ color: "#0a0f1a", fontSize: 16, fontWeight: 800 }}>✓</span>}
          </div>
          <span style={{ fontSize: F.body, fontWeight: active ? 700 : 400, color: done ? C.accent : C.textMid }}>{label}</span>
        </div>;
      })}
    </div>
  </div>;
}

export default function App() {
  const [kioskStep, setKioskStep] = useState(0);
  const [calibrating, setCalibrating] = useState(false);
  const [providerType, setProviderType] = useState("community");
  const [reimbursementModel, setReimbursementModel] = useState("mixed");
  const [occupancyRate, setOccupancyRate] = useState(0.65);
  const [galenMigrationCost, setGalenMigrationCost] = useState(0);
  const [galenAnnualCost, setGalenAnnualCost] = useState(0);
  const [flagships, setFlagships] = useState([]);
  const [facilities, setFacilitiesState] = useState({});
  const [costMode, setCostMode] = useState("estimate");
  const [knownSpend, setKnownSpend] = useState(0);
  const [inputs, setInputs] = useState({ ...PRESETS.TYPICAL.data, data_types: { ...PRESETS.TYPICAL.data.data_types }, tiers: { ...PRESETS.TYPICAL.data.tiers } });

  const update = useCallback((key, val) => setInputs(p => ({ ...p, [key]: val })), []);
  const updateTier = useCallback((tier, val) => setInputs(p => ({ ...p, tiers: { ...p.tiers, [tier]: val } })), []);
  const setFacility = useCallback((key, val) => setFacilitiesState(p => ({ ...p, [key]: val })), []);
  const applyPreset = useCallback((key) => { const p = PRESETS[key]; if (!p) return; setInputs({ ...p.data, data_types: { ...p.data.data_types }, tiers: { ...p.data.tiers } }); setFlagships([]); setFacilitiesState({}); }, []);
  const selectProvider = useCallback((key) => { setProviderType(key); const pk = PROVIDER_PRESET_MAP[key]; if (pk) applyPreset(pk); }, [applyPreset]);

  const addFlagship = useCallback((sys, tier) => {
    const cost = sys.baseCost ? systemCost(sys, inputs.bed_count) : (sys.cost || 250000);
    setFlagships(p => [...p, { name: sys.label || "", cost, retire: true, tier: tier || null }]);
    if (tier) updateTier(tier, Math.max(0, inputs.tiers[tier] - 1));
  }, [inputs.bed_count, inputs.tiers, updateTier]);

  const removeFlagship = useCallback((idx) => {
    setFlagships(p => { const f = p[idx]; if (f?.tier) updateTier(f.tier, (inputs.tiers[f.tier] || 0) + 1); return p.filter((_, j) => j !== idx); });
  }, [inputs.tiers, updateTier]);

  const calcInputs = useMemo(() => {
    const pm = PROVIDER_MULTIPLIERS[providerType] || PROVIDER_MULTIPLIERS.community;
    const rm = REIMBURSE_MULTIPLIERS[reimbursementModel] || REIMBURSE_MULTIPLIERS.mixed;
    return { ...inputs, _abfPct: pm.abf_pct || 0.72, _privateWeight: rm.private_weight || 1.0, _efficiencyWeight: rm.efficiency_weight || 1.0, _medicareDrgRevenue: 0, _occupancy: occupancyRate, _providerType: providerType, _lhdCount: 0, _privatePct: pm.private_pct || 0.15, _portfolioSystems: 0, _portfolioStaff: 0, _portfolioCost: 0 };
  }, [inputs, providerType, reimbursementModel, occupancyRate]);

  const r = useMemo(() => calc(calcInputs, "EXPECTED", {}, flagships), [calcInputs, flagships]);

  const handleCalculate = useCallback(() => { setCalibrating(true); }, []);
  const handleCalibrationDone = useCallback(() => { setCalibrating(false); setKioskStep(KIOSK_STEPS.length - 1); }, []);
  const handleAdjust = useCallback(() => { setKioskStep(4); }, []); // back to fine-tune

  const renderStep = () => {
    switch (kioskStep) {
      case 0: return <ProviderStep providerType={providerType} onSelect={selectProvider} reimbursementModel={reimbursementModel} setReimbursementModel={setReimbursementModel} />;
      case 1: return <JourneyStep journey={inputs.journey} onSelect={v => update("journey", v)} />;
      case 2: return <FacilitiesStep inputs={inputs} update={update} facilities={facilities} setFacility={setFacility} />;
      case 3: return <SystemsStep inputs={inputs} updateTier={updateTier} flagships={flagships} addFlagship={addFlagship} removeFlagship={removeFlagship} costMode={costMode} setCostMode={setCostMode} knownSpend={knownSpend} setKnownSpend={setKnownSpend} />;
      case 4: return <FineTuneStep inputs={inputs} update={update} galenMigrationCost={galenMigrationCost} setGalenMigrationCost={setGalenMigrationCost} galenAnnualCost={galenAnnualCost} setGalenAnnualCost={setGalenAnnualCost} occupancyRate={occupancyRate} setOccupancyRate={setOccupancyRate} />;
      case 5: return <ResultsPage r={r} galenMigrationCost={galenMigrationCost} galenAnnualCost={galenAnnualCost} onAdjust={handleAdjust} />;
      default: return null;
    }
  };

  if (calibrating) {
    return <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, width: W, height: H, color: C.text }}>
      <CalibratingScreen onDone={handleCalibrationDone} />
    </div>;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, width: W, height: H, color: C.text, lineHeight: 1.55, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "48px 56px 0" }}>
        <StepIndicator steps={KIOSK_STEPS} current={kioskStep} onJump={setKioskStep} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 56px 32px" }}>
        <PageTransition step={kioskStep}>{renderStep()}</PageTransition>
      </div>
      <NavButtons step={kioskStep} totalSteps={KIOSK_STEPS.length} onBack={() => setKioskStep(p => p - 1)} onNext={() => setKioskStep(p => p + 1)} onCalculate={handleCalculate} />
    </div>
  );
}
