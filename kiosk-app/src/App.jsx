import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { C, F, W, H, KIOSK_STEPS } from './theme';
import { calc } from './calc/engine';
import { PRESETS, PROVIDER_PRESET_MAP, PROVIDER_MULTIPLIERS, REIMBURSE_MULTIPLIERS } from './calc/presets';
import { systemCost } from './calc/vendors';
import { StepIndicator, NavButtons, PageTransition } from './components';
import { ProviderStep, JourneyStep, FacilitiesStep, SystemsStep, FineTuneStep } from './steps';
import { ResultsPage } from './results/ResultsPage';

const IDN_FACILITIES = {
  ambulatory_surgery: 6, physician_practices: 20, urgent_care: 4,
  imaging_centers: 3, dialysis: 2, snf: 3, home_health: 2,
  behavioral: 1, rehab: 1, ltach: 0,
};

function CalibratingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [barW, setBarW] = useState(0);
  const steps = ['Mapping your legacy estate', 'Modeling decommission savings', 'Estimating clinical capacity impact', 'Calculating reimbursement recovery'];
  useEffect(() => {
    const t = [
      setTimeout(() => { setStep(1); setBarW(25); }, 600),
      setTimeout(() => { setStep(2); setBarW(50); }, 1400),
      setTimeout(() => { setStep(3); setBarW(75); }, 2200),
      setTimeout(() => setBarW(100), 2800),
      setTimeout(onDone, 3200),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes calSpin { to { transform: rotate(360deg); } }
        @keyframes calPulse { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.02); } }
      `}</style>
      <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 48 }}>
        <div style={{ position: 'absolute', inset: 0, border: '4px solid ' + C.border, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: C.accent, borderRightColor: C.accent, borderRadius: '50%', animation: 'calSpin .8s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 16, border: '3px solid transparent', borderTopColor: C.tealLight, borderRadius: '50%', animation: 'calSpin 1.4s linear infinite reverse' }} />
      </div>
      <div style={{ fontSize: F.h1, fontWeight: 800, color: C.accent, marginBottom: 12, animation: 'calPulse 2s ease-in-out infinite', textAlign: 'center' }}>Calibrating your model</div>
      <div style={{ fontSize: F.body, color: C.textMuted, marginBottom: 44, textAlign: 'center' }}>{'Analyzing ' + (step < 2 ? 'inputs' : 'clinical impact') + '...'}</div>
      <div style={{ width: 420, maxWidth: '80%', height: 6, background: C.border, borderRadius: 3, marginBottom: 40, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: barW + '%', background: 'linear-gradient(90deg, ' + C.accent + ', ' + C.tealLight + ')', borderRadius: 3, transition: 'width .5s ease-out' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420, maxWidth: '80%' }}>
        {steps.map((label, i) => {
          const done = step > i, active = step === i;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: done ? 1 : active ? 0.9 : 0.2, transform: done || active ? 'translateX(0)' : 'translateX(-8px)', transition: 'all .4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: done ? C.accent : active ? C.accent + '30' : C.border, border: active ? '2px solid ' + C.accent : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
                {done && <span style={{ color: '#0a0f1a', fontSize: 18, fontWeight: 800 }}>{'✓'}</span>}
                {active && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.accent }} />}
              </div>
              <span style={{ fontSize: F.body, fontWeight: active ? 700 : 400, color: done ? C.accent : active ? C.text : C.textMuted, transition: 'all .3s' }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
  const selectProvider = useCallback((key) => { setProviderType(key); const pk = PROVIDER_PRESET_MAP[key]; if (pk) applyPreset(pk); setFacilitiesState(key === 'multi_hospital' ? { ...IDN_FACILITIES } : {}); }, [applyPreset]);

  const addFlagship = useCallback((sys, tier) => {
    const cost = sys.baseCost ? systemCost(sys, inputs.bed_count) : (sys.cost || 250000);
    setFlagships(p => [...p, { name: sys.label || "", cost, retire: true, tier: tier || null }]);
    if (tier) updateTier(tier, Math.max(0, inputs.tiers[tier] - 1));
  }, [inputs.bed_count, inputs.tiers, updateTier]);

  const removeFlagship = useCallback((idx) => {
    setFlagships(p => { const f = p[idx]; if (f?.tier) updateTier(f.tier, (inputs.tiers[f.tier] || 0) + 1); return p.filter((_, j) => j !== idx); });
  }, [inputs.tiers, updateTier]);
  const updateFlagshipCost = useCallback((idx, cost) => {
    setFlagships(p => p.map((f, i) => i === idx ? { ...f, cost: Math.max(0, cost) } : f));
  }, []);

  const calcInputs = useMemo(() => {
    const pm = PROVIDER_MULTIPLIERS[providerType] || PROVIDER_MULTIPLIERS.community;
    const rm = REIMBURSE_MULTIPLIERS[reimbursementModel] || REIMBURSE_MULTIPLIERS.mixed;
    return { ...inputs, _medicareDrgRevenue: 0, _occupancy: occupancyRate, _providerType: providerType, _medicarePct: pm.medicare_pct || 0.42, _penaltyWeight: rm.penalty_weight || 1.0, _denialWeight: rm.denial_weight || 1.0, _qualityBonus: rm.quality_bonus || 0.5, _portfolioSystems: 0, _portfolioStaff: 0, _portfolioCost: 0 };
  }, [inputs, providerType, reimbursementModel, occupancyRate]);

  const r = useMemo(() => calc(calcInputs, "EXPECTED", {}, flagships), [calcInputs, flagships]);

  const handleCalculate = useCallback(() => setCalibrating(true), []);
  const handleCalibrationDone = useCallback(() => { setCalibrating(false); setKioskStep(KIOSK_STEPS.length - 1); }, []);
  const handleAdjust = useCallback(() => setKioskStep(4), []);
  const handleStartOver = useCallback(() => {
    setKioskStep(0);
    setProviderType("community");
    setReimbursementModel("mixed");
    setOccupancyRate(0.65);
    setGalenMigrationCost(0);
    setGalenAnnualCost(0);
    setFlagships([]);
    setFacilitiesState({});
    setCostMode("estimate");
    setKnownSpend(0);
    setInputs({ ...PRESETS.TYPICAL.data, data_types: { ...PRESETS.TYPICAL.data.data_types }, tiers: { ...PRESETS.TYPICAL.data.tiers } });
  }, []);

  const renderStep = () => {
    switch (kioskStep) {
      case 0: return <ProviderStep providerType={providerType} onSelect={selectProvider} reimbursementModel={reimbursementModel} setReimbursementModel={setReimbursementModel} />;
      case 1: return <JourneyStep journey={inputs.journey} onSelect={v => update("journey", v)} />;
      case 2: return <FacilitiesStep inputs={inputs} update={update} facilities={facilities} setFacility={setFacility} />;
      case 3: return <SystemsStep inputs={inputs} updateTier={updateTier} flagships={flagships} addFlagship={addFlagship} removeFlagship={removeFlagship} updateFlagshipCost={updateFlagshipCost} costMode={costMode} setCostMode={setCostMode} knownSpend={knownSpend} setKnownSpend={setKnownSpend} />;
      case 4: return <FineTuneStep inputs={inputs} update={update} galenMigrationCost={galenMigrationCost} setGalenMigrationCost={setGalenMigrationCost} galenAnnualCost={galenAnnualCost} setGalenAnnualCost={setGalenAnnualCost} occupancyRate={occupancyRate} setOccupancyRate={setOccupancyRate} />;
      case 5: return <ResultsPage r={r} galenMigrationCost={galenMigrationCost} galenAnnualCost={galenAnnualCost} onAdjust={handleAdjust} onStartOver={handleStartOver} />;
      default: return null;
    }
  };

  if (calibrating) {
    return <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, width: W, minHeight: H, height: '100vh', color: C.text, position: "relative" }}>
      <CalibratingScreen onDone={handleCalibrationDone} />
    </div>;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, width: W, minHeight: H, color: C.text, lineHeight: 1.55, display: "flex", flexDirection: "column" }}>
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
