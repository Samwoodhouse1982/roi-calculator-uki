import React from 'react';
import { C, fmtNum, fmtK } from '../theme';
import { Card, BigChoice, SectionTitle, TouchSlider, Stepper, InfoTip } from '../components';
import { KNOWN_SYSTEMS } from '../calc/vendors';

export function ProviderStep({ providerType, onSelect }) {
  const providers = [
    { key: "critical_access", label: "Critical Access / Rural", desc: "≤25 beds, limited legacy estate", icon: "🏥" },
    { key: "community", label: "Community Hospital", desc: "100-400 beds, moderate complexity", icon: "🏨" },
    { key: "regional", label: "Regional Medical Center", desc: "400-1,000 beds, multiple service lines", icon: "🏗️" },
    { key: "academic", label: "Academic Medical Center", desc: "Teaching hospital, research systems", icon: "🎓" },
    { key: "multi_hospital", label: "Multi-Hospital System / IDN", desc: "Post-M&A, multiple facilities", icon: "🏢" },
  ];
  return (
    <div>
      <SectionTitle number="1">Select your programme scope</SectionTitle>
      <BigChoice options={providers} value={providerType} onChange={onSelect} />
    </div>
  );
}

export function JourneyStep({ journey, onSelect }) {
  const journeys = [
    { key: "HAVE_EPR", label: "We have an enterprise EHR", desc: "Already on Epic, Oracle Health or similar. Looking to archive and decommission legacy systems.", icon: "✅" },
    { key: "EVALUATING", label: "We're evaluating enterprise EHRs", desc: "Assessing migration to a single EHR platform. Need the full case for migration and archiving.", icon: "🔍" },
  ];
  return (
    <div>
      <SectionTitle number="2">Where are you on your EHR journey?</SectionTitle>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {journeys.map(j => (
          <button key={j.key} onClick={() => onSelect(j.key)} style={{
            flex: "1 1 280px", padding: "28px 26px", textAlign: "left", cursor: "pointer",
            border: journey === j.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
            borderRadius: 16, background: journey === j.key ? C.accentPale : C.surface,
            transition: "all .15s"
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{j.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: journey === j.key ? C.accent : C.text, marginBottom: 6 }}>
              {j.label}
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5 }}>{j.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function OrgScaleStep({ inputs, update, reimbursementModel, setReimbursementModel }) {
  return (
    <div>
      <SectionTitle number="3">Organisation scale</SectionTitle>
      <Card>
        <Stepper label="Hospitals" value={inputs.org_count} min={1} max={50} onChange={v => update("org_count", v)}
          tip="Number of inpatient hospital facilities in scope." />
        <TouchSlider label="Total beds" value={inputs.bed_count} min={10} max={Math.max(5000, inputs.bed_count + 500)}
          step={10} onChange={v => update("bed_count", v)} format={fmtNum}
          tip="Total staffed beds across all hospitals. Drives staffing, revenue, and safety metrics." />
      </Card>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textMid, marginBottom: 10 }}>Reimbursement model</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { k: "ffs", l: "Fee-for-Service" },
            { k: "vbc", l: "Value-Based Care" },
            { k: "mixed", l: "Mixed" },
          ].map(r => (
            <button key={r.k} onClick={() => setReimbursementModel(r.k)} style={{
              flex: 1, padding: "14px 16px", borderRadius: 12, cursor: "pointer",
              border: reimbursementModel === r.k ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
              background: reimbursementModel === r.k ? C.accentPale : C.surface,
              color: reimbursementModel === r.k ? C.accent : C.textMid,
              fontSize: 14, fontWeight: 600, fontFamily: "inherit"
            }}>{r.l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SystemsStep({ inputs, updateTier }) {
  const tiers = [
    { key: "enterprise", label: "Enterprise systems", color: C.accent, hint: "EMR, PAS, large clinical suites", max: Math.max(10, inputs.tiers.enterprise + 3) },
    { key: "departmental", label: "Departmental systems", color: "#40b0ff", hint: "Theatres, lab, ED, maternity, radiology", max: Math.max(30, inputs.tiers.departmental + 5) },
    { key: "niche", label: "Standalone systems", color: C.purple, hint: "Document stores, scanned notes, specialty DBs", max: Math.max(100, inputs.tiers.niche + 10) },
  ];
  const total = inputs.tiers.enterprise + inputs.tiers.departmental + inputs.tiers.niche;
  return (
    <div>
      <SectionTitle number="4">Legacy systems</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tiers.map(t => (
          <Card key={t.key} style={{ border: `1px solid ${t.color}30` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: t.color }}>{t.label}</span>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t.hint}</div>
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, color: t.color }}>{inputs.tiers[t.key]}</span>
            </div>
            <input type="range" min={0} max={t.max} step={1} value={inputs.tiers[t.key]}
              onChange={e => updateTier(t.key, Number(e.target.value))}
              style={{ width: "100%", cursor: "pointer", accentColor: t.color }} />
          </Card>
        ))}
      </div>
      <div style={{
        marginTop: 16, padding: "16px 20px", background: C.surface, borderRadius: 12,
        border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12
      }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: C.accent }}>{total}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.textMid }}>legacy systems in scope</span>
      </div>
    </div>
  );
}

export function FineTuneStep({ inputs, update, galenMigrationCost, setGalenMigrationCost, galenAnnualCost, setGalenAnnualCost, occupancyRate, setOccupancyRate }) {
  return (
    <div>
      <SectionTitle number="5">Fine-tune your model</SectionTitle>
      <Card>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textMid, marginBottom: 8 }}>Complexity</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["LOW", "TYPICAL", "HIGH"].map(v => (
                <button key={v} onClick={() => update("complexity_level", v)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer",
                  border: inputs.complexity_level === v ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  background: inputs.complexity_level === v ? C.accentPale : C.surface,
                  color: inputs.complexity_level === v ? C.accent : C.textMid,
                  fontSize: 14, fontWeight: 600, fontFamily: "inherit"
                }}>{v.charAt(0) + v.slice(1).toLowerCase()}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.textMid, marginBottom: 8 }}>Data quality</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["CLEAN", "MIXED", "POOR"].map(v => (
                <button key={v} onClick={() => update("data_quality_level", v)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer",
                  border: inputs.data_quality_level === v ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  background: inputs.data_quality_level === v ? C.accentPale : C.surface,
                  color: inputs.data_quality_level === v ? C.accent : C.textMid,
                  fontSize: 14, fontWeight: 600, fontFamily: "inherit"
                }}>{v.charAt(0) + v.slice(1).toLowerCase()}</button>
              ))}
            </div>
          </div>
        </div>
        <TouchSlider label="Decommission target" value={inputs.decom_retire_rate}
          min={0} max={1} step={0.05} onChange={v => update("decom_retire_rate", v)}
          format={v => `${Math.round(v * 100)}%`}
          tip="What % of legacy systems will be retired? 60-80% typical." />
        <TouchSlider label="Bed occupancy" value={occupancyRate}
          min={0.3} max={1.0} step={0.01} onChange={setOccupancyRate}
          format={v => `${Math.round(v * 100)}%`}
          tip="Average bed occupancy rate. Drives admission volume." />
      </Card>
      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>
          Galen Clinical Archive costs (optional)
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Migration (one-time)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.textMuted }}>$</span>
              <input type="number" value={galenMigrationCost || ""} placeholder="0" min={0} step={10000}
                onChange={e => setGalenMigrationCost(parseInt(e.target.value) || 0)}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
                  fontSize: 18, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent
                }} />
            </div>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Annual archive cost</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: C.textMuted }}>$</span>
              <input type="number" value={galenAnnualCost || ""} placeholder="0" min={0} step={10000}
                onChange={e => setGalenAnnualCost(parseInt(e.target.value) || 0)}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
                  fontSize: 18, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent
                }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
