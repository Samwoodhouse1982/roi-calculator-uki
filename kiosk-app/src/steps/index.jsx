import React, { useState } from 'react';
import { C, F, fmtNum, fmtK, FACILITY_TYPES } from '../theme';
import { Card, BigChoice, SectionTitle, TouchSlider, Stepper, SegmentedControl, InfoTip } from '../components';
import { Icon } from '../components/Icons';
import { KNOWN_SYSTEMS, systemCost } from '../calc/vendors';

const TIER_TYPES = {
  enterprise: ["EHR","Legacy EHR","EHR/Integration","Ambulatory EHR","Ambulatory EHR/RCM","Revenue Cycle"],
  departmental: ["Pharmacy/Dispensing","OB/Perinatal","Oncology","ICU/Critical Care","Behavioral Health","Integration Engine","CDI/Coding","Post-Acute/Rehab","Clinical Documentation"],
  niche: ["Document Management"],
};

// STEP 1: Scope + Reimbursement
export function ProviderStep({ providerType, onSelect, reimbursementModel, setReimbursementModel }) {
  return <div>
    <SectionTitle number="1">Select your program scope</SectionTitle>
    <BigChoice options={[
      { key: "critical_access", label: "Critical Access / Rural", desc: "≤25 beds, limited legacy estate", iconKey: "hospital" },
      { key: "community", label: "Community Hospital", desc: "100-400 beds, moderate complexity", iconKey: "community" },
      { key: "regional", label: "Regional Medical Center", desc: "400-1,000 beds, multiple service lines", iconKey: "regional" },
      { key: "academic", label: "Academic Medical Center", desc: "Teaching hospital, research systems", iconKey: "academic" },
      { key: "multi_hospital", label: "IDN / Community Health System", desc: "3-5 hospitals, 800-1,500 beds, ambulatory and post-acute sites", iconKey: "idn" },
    ]} value={providerType} onChange={onSelect} />
    <div style={{ marginTop: 28 }}>
      <SegmentedControl label="Reimbursement model" value={reimbursementModel} onChange={setReimbursementModel} options={[
        { key: "ffs", label: "Fee-for-Service" }, { key: "vbc", label: "Value-Based" }, { key: "mixed", label: "Mixed" },
      ]} />
    </div>
  </div>;
}

// STEP 2: Journey
export function JourneyStep({ journey, onSelect }) {
  return <div>
    <SectionTitle number="2">Where are you on your EHR journey?</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        { key: "HAVE_EPR", label: "We have an enterprise EHR", desc: "Already on Epic, Oracle Health or similar. Looking to archive and decommission legacy systems.", iconKey: "check", focus: "Archiving + decommission savings" },
        { key: "EVALUATING", label: "We're evaluating enterprise EHRs", desc: "Assessing migration to a single EHR platform. Need the full case for migration and archiving.", iconKey: "search", focus: "Migration safety + archiving savings" },
      ].map(j => <button key={j.key} onClick={() => onSelect(j.key)} style={{
        padding: "32px 30px", textAlign: "left", cursor: "pointer",
        border: journey === j.key ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
        borderRadius: 22, background: journey === j.key ? C.accentPale : C.surface, transition: "all .2s"
      }}>
        <div style={{ marginBottom: 12 }}><Icon name={j.iconKey} size={36} stroke={journey === j.key ? C.accent : C.textMid} /></div>
        <div style={{ fontSize: F.h3, fontWeight: 700, color: journey === j.key ? C.accent : C.text, marginBottom: 8 }}>{j.label}</div>
        <div style={{ fontSize: F.body, color: C.textMuted, lineHeight: 1.6, marginBottom: 12 }}>{j.desc}</div>
        <div style={{ fontSize: F.small, fontWeight: 600, color: journey === j.key ? C.accent : C.textMid, padding: "6px 14px", background: journey === j.key ? C.accent + "15" : C.bg, borderRadius: 8, display: "inline-block" }}>{j.focus}</div>
      </button>)}
    </div>
  </div>;
}

// STEP 3: Facilities
export function FacilitiesStep({ inputs, update, facilities, setFacility }) {
  return <div>
    <SectionTitle number="3">Your facility portfolio</SectionTitle>
    {/* Hospitals with beds */}
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Icon name="hospital" size={32} stroke={C.textMid} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: F.h3, fontWeight: 700, color: C.text }}>Hospitals</div>
          <div style={{ fontSize: F.small, color: C.textMuted }}>Acute inpatient facilities</div>
        </div>
      </div>
      <Stepper label="Hospital count" value={inputs.org_count} min={1} max={50} onChange={v => {
        const avgBeds = Math.round(inputs.bed_count / Math.max(1, inputs.org_count));
        update("org_count", v);
        update("bed_count", avgBeds * v);
      }} />
      <TouchSlider label="Total acute beds" value={inputs.bed_count} min={10} max={Math.max(5000, inputs.bed_count + 500)} step={10} onChange={v => update("bed_count", v)} format={fmtNum}
        tip="Total staffed beds across all hospitals. Drives staffing, revenue, and safety metrics." />
      <div style={{ fontSize: F.small, color: C.textMuted, background: C.bg, padding: "10px 14px", borderRadius: 10 }}>
        Average: {Math.round(inputs.bed_count / Math.max(1, inputs.org_count))} beds per hospital
      </div>
    </Card>

    {/* Other facilities */}
    <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMid, marginBottom: 12, marginTop: 8 }}>Other facilities in scope</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {FACILITY_TYPES.filter(ft => ft.key !== "hospitals").map(ft => {
        const count = facilities[ft.key] || 0;
        return <div key={ft.key} style={{
          display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
          background: count > 0 ? C.accentPale : C.surface, borderRadius: 16,
          border: `1px solid ${count > 0 ? C.accent + "30" : C.border}`, transition: "all .2s"
        }}>
          <Icon name={ft.iconKey} size={22} stroke={count > 0 ? C.accent : C.textMid} />
          <span style={{ flex: 1, fontSize: F.body, fontWeight: 600, color: count > 0 ? C.accent : C.textMid }}>{ft.label}</span>
          <button onClick={() => setFacility(ft.key, Math.max(0, count - 1))} style={{
            width: 48, height: 48, borderRadius: 12, border: `1px solid ${C.border}`,
            background: C.surface, color: C.textMid, fontSize: 24, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit"
          }}>−</button>
          <span style={{ fontSize: F.h2, fontWeight: 800, color: count > 0 ? C.accent : C.textMuted, minWidth: 50, textAlign: "center" }}>{count}</span>
          <button onClick={() => setFacility(ft.key, count + 1)} style={{
            width: 48, height: 48, borderRadius: 12, border: `1px solid ${C.border}`,
            background: C.surface, color: C.textMid, fontSize: 24, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit"
          }}>+</button>
        </div>;
      })}
    </div>
  </div>;
}

// STEP 4: Systems
export function SystemsStep({ inputs, updateTier, flagships, addFlagship, removeFlagship, updateFlagshipCost, costMode, setCostMode, knownSpend, setKnownSpend }) {
  const [openTier, setOpenTier] = useState(null);
  const tiers = [
    { key: "enterprise", label: "Enterprise", color: C.accent, hint: "Including legacy EHR, ERP, RCM", max: Math.max(10, inputs.tiers.enterprise + 3) },
    { key: "departmental", label: "Departmental", color: C.blue, hint: "Including laboratory, pharmacy, perinatal, imaging/PACS, cardiology, and radiology", max: Math.max(30, inputs.tiers.departmental + 5) },
    { key: "niche", label: "Standalone", color: C.purple, hint: "Including document stores, data warehouses, scanned notes", max: Math.max(100, inputs.tiers.niche + 10) },
  ];
  const total = inputs.tiers.enterprise + inputs.tiers.departmental + inputs.tiers.niche;

  return <div>
    <SectionTitle number="4">Legacy systems</SectionTitle>

    {/* Cost mode toggle */}
    <div style={{ marginBottom: 20 }}>
      <SegmentedControl value={costMode} onChange={setCostMode} options={[
        { key: "estimate", label: "Estimate costs" }, { key: "known", label: "I know my spend" },
      ]} />
    </div>

    {costMode === "known" && <Card style={{ marginBottom: 16 }}>
      <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>Total annual legacy system spend</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: F.h2, color: C.textMuted }}>$</span>
        <input type="number" value={knownSpend || ""} placeholder="e.g. 5000000" min={0} step={100000}
          onChange={e => setKnownSpend(parseInt(e.target.value) || 0)}
          style={{ flex: 1, padding: "16px 18px", borderRadius: 14, border: `1px solid ${C.border}`, fontSize: F.h2, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent }} />
      </div>
      {knownSpend > 0 && <div style={{ fontSize: F.small, color: C.textMuted, marginTop: 8 }}>
        {fmtK(knownSpend)}/yr across {total} systems ({fmtK(Math.round(knownSpend / Math.max(1, total)))}/system avg)
      </div>}
    </Card>}

    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {tiers.map(t => {
        const tierSystems = KNOWN_SYSTEMS.filter(s => (TIER_TYPES[t.key] || []).includes(s.type));
        const tierFlagships = flagships.filter(f => f.tier === t.key);
        return <Card key={t.key} style={{ border: `1px solid ${t.color}30`, padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: F.h3, fontWeight: 700, color: t.color }}>{t.label}</span>
              <div style={{ fontSize: F.tiny, color: C.textMuted, marginTop: 2 }}>{t.hint}</div>
            </div>
            <span style={{ fontSize: 36, fontWeight: 800, color: t.color }}>{inputs.tiers[t.key]}</span>
          </div>
          <input type="range" min={0} max={t.max} step={1} value={inputs.tiers[t.key]}
            onChange={e => updateTier(t.key, Number(e.target.value))}
            style={{ width: "100%", cursor: "pointer", accentColor: t.color }} />
          {tierFlagships.length > 0 && <div style={{ marginTop: 8 }}>
            {tierFlagships.map((f, fi) => {
              const fIdx = flagships.indexOf(f);
              const step = f.cost > 500000 ? 50000 : f.cost > 100000 ? 25000 : 10000;
              return <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: C.bg, borderRadius: 12, marginBottom: 6 }}>
                <span style={{ fontSize: F.tiny, fontWeight: 600, color: t.color, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button onClick={() => updateFlagshipCost(fIdx, f.cost - step)} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0 }}>−</button>
                <span style={{ fontSize: F.small, fontWeight: 700, color: t.color, minWidth: 70, textAlign: "center" }}>{fmtK(f.cost)}</span>
                <button onClick={() => updateFlagshipCost(fIdx, f.cost + step)} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0 }}>+</button>
                <span style={{ fontSize: F.tiny, color: C.textMuted, flexShrink: 0 }}>/yr</span>
                <button onClick={() => removeFlagship(fIdx)} style={{ width: 36, height: 36, border: "none", background: "none", color: C.textMuted, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
              </div>;
            })}
          </div>}
          {tierSystems.length > 0 && <>
            <div onClick={() => setOpenTier(openTier === t.key ? null : t.key)} style={{ marginTop: 8, fontSize: F.tiny, color: C.accent, cursor: "pointer", fontWeight: 600 }}>
              {openTier === t.key ? "▾" : "▸"} Name a specific system
            </div>
            {openTier === t.key && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {tierSystems.map(sys => <button key={sys.label} onClick={() => { addFlagship(sys, t.key); setOpenTier(null); }} style={{ padding: "8px 14px", fontSize: F.tiny, fontWeight: 600, border: `1px solid ${C.borderLight}`, borderRadius: 10, background: C.bg, cursor: "pointer", color: C.textMid, fontFamily: "inherit" }}>
                {sys.label} <span style={{ color: C.textMuted }}>({fmtK(systemCost(sys, inputs.bed_count))})</span>
              </button>)}
            </div>}
          </>}
        </Card>;
      })}
    </div>
    <div style={{ marginTop: 16, padding: "20px 24px", background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ fontSize: 48, fontWeight: 800, color: C.accent }}>{total}</span>
      <span style={{ fontSize: F.h3, fontWeight: 600, color: C.textMid }}>legacy systems</span>
    </div>
  </div>;
}

// STEP 5: Fine-tune
export function FineTuneStep({ inputs, update, galenMigrationCost, setGalenMigrationCost, galenAnnualCost, setGalenAnnualCost, occupancyRate, setOccupancyRate }) {
  return <div>
    <SectionTitle number="5">Fine-tune your model</SectionTitle>
    <Card>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
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
      <TouchSlider label="Bed occupancy" value={occupancyRate} min={0.3} max={1.0} step={0.01} onChange={setOccupancyRate} format={v => `${Math.round(v * 100)}%`} tip="Drives admission volume, revenue, and safety metrics." />
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
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `1px solid ${C.border}`, fontSize: F.h2, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent }} />
          </div>
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: F.small, color: C.textMuted, marginBottom: 6 }}>Annual archive cost</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: F.h3, color: C.textMuted }}>$</span>
            <input type="number" value={galenAnnualCost || ""} placeholder="0" min={0} step={10000}
              onChange={e => setGalenAnnualCost(parseInt(e.target.value) || 0)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `1px solid ${C.border}`, fontSize: F.h2, fontWeight: 700, fontFamily: "inherit", background: C.bg, color: C.accent }} />
          </div>
        </div>
      </div>
    </Card>
  </div>;
}
