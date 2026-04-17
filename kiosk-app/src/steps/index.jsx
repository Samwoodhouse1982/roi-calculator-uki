import React, { useState } from 'react';
import { C, F, fmtNum, fmtK } from '../theme';
import { Card, BigChoice, SectionTitle, TouchSlider, Stepper, SegmentedControl, InfoTip } from '../components';
import { KNOWN_SYSTEMS, systemCost } from '../calc/vendors';

const TIER_TYPES = {
  enterprise: ["EMR","EMR/PAS","PAS","Clinical"],
  departmental: ["Theatre","Radiology","LIMS","Pharmacy","Maternity","Integration","eMeds","Dictation","ED"],
  niche: ["ECM","Incident"],
};

export function ProviderStep({ providerType, onSelect }) {
  return <div>
    <SectionTitle number="1">Select your programme scope</SectionTitle>
    <BigChoice options={[
      { key: "critical_access", label: "Critical Access / Rural", desc: "≤25 beds, limited legacy estate", icon: "🏥" },
      { key: "community", label: "Community Hospital", desc: "100-400 beds, moderate complexity", icon: "🏨" },
      { key: "regional", label: "Regional Medical Center", desc: "400-1,000 beds, multiple service lines", icon: "🏗️" },
      { key: "academic", label: "Academic Medical Center", desc: "Teaching hospital, research systems", icon: "🎓" },
      { key: "multi_hospital", label: "Multi-Hospital System / IDN", desc: "Post-M&A, multiple facilities", icon: "🏢" },
    ]} value={providerType} onChange={onSelect} />
  </div>;
}

export function JourneyStep({ journey, onSelect }) {
  return <div>
    <SectionTitle number="2">Where are you on your EHR journey?</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        { key: "HAVE_EPR", label: "We have an enterprise EHR", desc: "Already on Epic, Oracle Health or similar. Looking to archive and decommission legacy systems.", icon: "✅", focus: "Archiving + decommission savings" },
        { key: "EVALUATING", label: "We're evaluating enterprise EHRs", desc: "Assessing migration to a single EHR platform. Need the full case for migration and archiving.", icon: "🔍", focus: "Migration safety + archiving savings" },
      ].map(j => <button key={j.key} onClick={() => onSelect(j.key)} style={{
        flex: 1, padding: "32px 30px", textAlign: "left", cursor: "pointer",
        border: journey === j.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
        borderRadius: 20, background: journey === j.key ? C.accentPale : C.surface, transition: "all .2s"
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{j.icon}</div>
        <div style={{ fontSize: F.h3, fontWeight: 700, color: journey === j.key ? C.accent : C.text, marginBottom: 8 }}>{j.label}</div>
        <div style={{ fontSize: F.body, color: C.textMuted, lineHeight: 1.6, marginBottom: 12 }}>{j.desc}</div>
        <div style={{ fontSize: F.small, fontWeight: 600, color: journey === j.key ? C.accent : C.textMid, padding: "6px 14px", background: journey === j.key ? C.accent + "15" : C.bg, borderRadius: 8, display: "inline-block" }}>{j.focus}</div>
      </button>)}
    </div>
  </div>;
}

export function OrgScaleStep({ inputs, update, reimbursementModel, setReimbursementModel }) {
  return <div>
    <SectionTitle number="3">Organisation scale</SectionTitle>
    <Card>
      <Stepper label="Hospitals" value={inputs.org_count} min={1} max={50} onChange={v => update("org_count", v)} tip="Number of inpatient hospital facilities in scope." />
      <TouchSlider label="Total beds" value={inputs.bed_count} min={10} max={Math.max(5000, inputs.bed_count + 500)} step={10} onChange={v => update("bed_count", v)} format={fmtNum} tip="Total staffed beds. Drives staffing, revenue, and safety metrics." />
    </Card>
    <div style={{ marginTop: 20 }}>
      <SegmentedControl label="Reimbursement model" value={reimbursementModel} onChange={setReimbursementModel} options={[
        { key: "ffs", label: "Fee-for-Service" },
        { key: "vbc", label: "Value-Based Care" },
        { key: "mixed", label: "Mixed" },
      ]} />
    </div>
  </div>;
}

export function SystemsStep({ inputs, updateTier, flagships, addFlagship, removeFlagship }) {
  const [openTier, setOpenTier] = useState(null);
  const tiers = [
    { key: "enterprise", label: "Enterprise systems", color: C.accent, hint: "EMR, PAS, large clinical suites", max: Math.max(10, inputs.tiers.enterprise + 3) },
    { key: "departmental", label: "Departmental systems", color: C.blue, hint: "Theatres, lab, ED, maternity, radiology", max: Math.max(30, inputs.tiers.departmental + 5) },
    { key: "niche", label: "Standalone systems", color: C.purple, hint: "Document stores, scanned notes, specialty DBs", max: Math.max(100, inputs.tiers.niche + 10) },
  ];
  const total = inputs.tiers.enterprise + inputs.tiers.departmental + inputs.tiers.niche;

  return <div>
    <SectionTitle number="4">Legacy systems</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {tiers.map(t => {
        const tierSystems = KNOWN_SYSTEMS.filter(s => (TIER_TYPES[t.key] || []).includes(s.type));
        const tierFlagships = flagships.filter(f => f.tier === t.key);
        return <Card key={t.key} style={{ border: `1px solid ${t.color}30` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: F.h3, fontWeight: 700, color: t.color }}>{t.label}</span>
              <div style={{ fontSize: F.small, color: C.textMuted, marginTop: 2 }}>{t.hint}</div>
            </div>
            <span style={{ fontSize: 36, fontWeight: 800, color: t.color }}>{inputs.tiers[t.key]}</span>
          </div>
          <input type="range" min={0} max={t.max} step={1} value={inputs.tiers[t.key]}
            onChange={e => updateTier(t.key, Number(e.target.value))}
            style={{ width: "100%", cursor: "pointer", accentColor: t.color }} />

          {/* Named systems in this tier */}
          {tierFlagships.length > 0 && <div style={{ marginTop: 10 }}>
            {tierFlagships.map((f, fi) => {
              const idx = flagships.indexOf(f);
              return <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.bg, borderRadius: 10, border: `1px solid ${C.borderLight}`, marginBottom: 4 }}>
                <span style={{ fontSize: F.small, fontWeight: 600, color: t.color, flex: 1 }}>{f.name}</span>
                <span style={{ fontSize: F.small, fontWeight: 700, color: t.color }}>{fmtK(f.cost)}/yr</span>
                <button onClick={() => removeFlagship(idx)} style={{ border: "none", background: "none", color: C.textMuted, cursor: "pointer", fontSize: 16, padding: "4px 8px" }}>×</button>
              </div>;
            })}
          </div>}

          {/* Name a system */}
          {tierSystems.length > 0 && <details style={{ marginTop: 8 }} open={openTier === t.key} onClick={e => { e.preventDefault(); setOpenTier(openTier === t.key ? null : t.key); }}>
            <summary style={{ fontSize: F.small, color: C.accent, cursor: "pointer", fontWeight: 600, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}>
              Name a specific system to refine cost
            </summary>
          </details>}
          {openTier === t.key && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }} onClick={e => e.stopPropagation()}>
            {tierSystems.map(sys => <button key={sys.label} onClick={() => { addFlagship(sys, t.key); setOpenTier(null); }} style={{ padding: "8px 14px", fontSize: F.tiny, fontWeight: 600, border: `1px solid ${C.borderLight}`, borderRadius: 10, background: C.bg, cursor: "pointer", color: C.textMid, fontFamily: "inherit" }}>
              {sys.label} <span style={{ color: C.textMuted }}>({fmtK(systemCost(sys, inputs.bed_count))})</span>
            </button>)}
          </div>}
        </Card>;
      })}
    </div>
    <div style={{ marginTop: 16, padding: "20px 24px", background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ fontSize: 44, fontWeight: 800, color: C.accent }}>{total}</span>
      <span style={{ fontSize: F.h3, fontWeight: 600, color: C.textMid }}>legacy systems in scope</span>
    </div>
  </div>;
}

export function FineTuneStep({ inputs, update, galenMigrationCost, setGalenMigrationCost, galenAnnualCost, setGalenAnnualCost, occupancyRate, setOccupancyRate }) {
  return <div>
    <SectionTitle number="5">Fine-tune your model</SectionTitle>
    <Card>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
        <div style={{ flex: "1 1 240px" }}>
          <SegmentedControl label="System complexity" value={inputs.complexity_level} onChange={v => update("complexity_level", v)}
            options={[{ key: "LOW", label: "Low" }, { key: "TYPICAL", label: "Typical" }, { key: "HIGH", label: "High" }]} />
        </div>
        <div style={{ flex: "1 1 240px" }}>
          <SegmentedControl label="Data quality" value={inputs.data_quality_level} onChange={v => update("data_quality_level", v)}
            options={[{ key: "CLEAN", label: "Clean" }, { key: "MIXED", label: "Mixed" }, { key: "POOR", label: "Poor" }]} />
        </div>
      </div>
      <TouchSlider label="Decommission target" value={inputs.decom_retire_rate} min={0} max={1} step={0.05} onChange={v => update("decom_retire_rate", v)} format={v => `${Math.round(v * 100)}%`} tip="What % of legacy systems will be retired?" />
      <TouchSlider label="Bed occupancy" value={occupancyRate} min={0.3} max={1.0} step={0.01} onChange={setOccupancyRate} format={v => `${Math.round(v * 100)}%`} tip="Average bed occupancy. Drives admission volume." />
    </Card>
    <Card style={{ marginTop: 16 }}>
      <div style={{ fontSize: F.body, fontWeight: 700, color: C.textMid, marginBottom: 16 }}>Galen Clinical Archive costs <span style={{ fontWeight: 400, color: C.textMuted }}>(optional)</span></div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: F.small, color: C.textMuted, marginBottom: 6 }}>Migration (one-time)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: F.h3, color: C.textMuted }}>$</span>
            <input type="number" value={galenMigrationCost || ""} placeholder="0" min={0} step={10000}
              onChange={e => setGalenMigrationCost(parseInt(e.target.value) || 0)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: F.h2, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent }} />
          </div>
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: F.small, color: C.textMuted, marginBottom: 6 }}>Annual archive cost</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: F.h3, color: C.textMuted }}>$</span>
            <input type="number" value={galenAnnualCost || ""} placeholder="0" min={0} step={10000}
              onChange={e => setGalenAnnualCost(parseInt(e.target.value) || 0)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border}`, fontSize: F.h2, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent }} />
          </div>
        </div>
      </div>
    </Card>
  </div>;
}
