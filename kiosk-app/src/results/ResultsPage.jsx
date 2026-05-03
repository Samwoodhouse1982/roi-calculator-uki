import React, { useState, useRef } from 'react';
import { C, F, fmtK, fmtNum } from '../theme';
import { Card } from '../components';

function Methodology({ children }) {
  const [open, setOpen] = useState(false);
  return <div style={{ marginTop: 8 }}>
    <div onClick={() => setOpen(!open)} style={{ fontSize: F.tiny, color: C.accent, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>▶</span> How we calculated this
    </div>
    {open && <div style={{ marginTop: 8, padding: "14px 18px", background: C.bg, borderRadius: 14, fontSize: F.tiny, color: C.textMid, lineHeight: 1.7, border: `1px solid ${C.borderLight}` }}>{children}</div>}
  </div>;
}

function JumpLink({ label, onClick }) {
  return <div onClick={onClick} style={{ fontSize: F.tiny, color: C.accent, cursor: "pointer", fontWeight: 600, marginTop: 8, textAlign: "center" }}>{label} ↓</div>;
}

export function ResultsPage({ r, galenMigrationCost, galenAnnualCost, onAdjust, onStartOver }) {
  if (!r) return null;
  const decomRef = useRef(null);
  const capacityRef = useRef(null);
  const reimbRef = useRef(null);
  const safetyRef = useRef(null);
  const projRef = useRef(null);
  const scrollTo = ref => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const cashable = r.decomSave + (r.reimbursementImpact || 0) + (r.duplicateElimination || 0) + (r.infraConsolidation || 0);
  const capacity = r.timeSave || 0;
  const reimbursement = r.reimbursementImpact || 0;
  const fte = r.hrsSaved ? Math.round(r.hrsSaved * (r.realization || 0.3) / 1824) : 0;
  const combinedAnnual = cashable + capacity + (r.qualitySavings || 0);
  const hasGalen = galenMigrationCost > 0;
  const payback = hasGalen ? galenMigrationCost / Math.max(1, r.decomSave - galenAnnualCost) : 0;

  return <div style={{ animation: "rfade .5s ease-out" }}>
    <style>{`@keyframes rfade { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes glow { 0%,100% { text-shadow: 0 0 30px rgba(0,212,170,0.3); } 50% { text-shadow: 0 0 60px rgba(0,212,170,0.6); } }`}</style>

    {/* Hero */}
    <div style={{ textAlign: "center", marginBottom: 20, padding: "24px 0" }}>
      <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMuted, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Estimated annual savings</div>
      <div style={{ fontSize: F.hero, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-4px", animation: "glow 3s ease-in-out infinite" }}>{fmtK(combinedAnnual)}</div>
      <div style={{ fontSize: F.h3, color: C.textMid, marginTop: 14 }}>per year at steady state</div>
    </div>

    {/* Composition bar — shows how the topline is built */}
    <div style={{ marginBottom: 32, padding: "0 12px" }}>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
        {cashable > 0 && <div style={{ flex: cashable, background: C.accent, transition: "flex .5s" }} />}
        {capacity > 0 && <div style={{ flex: capacity, background: C.amber, transition: "flex .5s" }} />}
        {(r.qualitySavings || 0) > 0 && <div style={{ flex: r.qualitySavings, background: C.purple, transition: "flex .5s" }} />}
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
        <CompositionItem color={C.accent} label="Cashable" value={fmtK(cashable)} pct={Math.round(cashable / Math.max(1, combinedAnnual) * 100)} />
        <CompositionItem color={C.amber} label="Capacity" value={fmtK(capacity)} pct={Math.round(capacity / Math.max(1, combinedAnnual) * 100)} />
        {(r.qualitySavings || 0) > 0 && <CompositionItem color={C.purple} label="Cost avoidance" value={fmtK(r.qualitySavings)} pct={Math.round((r.qualitySavings || 0) / Math.max(1, combinedAnnual) * 100)} />}
      </div>
    </div>

    {/* KPI grid — financial + clinical + jump links */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
      <KpiCard label="Legacy decommission" value={fmtK(r.decomSave)} sub={`${r.decom} of ${r.legacy} systems retired`} color={C.accent} icon="🔓" onClick={() => scrollTo(decomRef)} />
      <KpiCard label="Clinical capacity" value={`${fmtNum(fte)} FTE freed`} sub={`${fmtNum(r.hrsSaved)} hrs/yr recovered`} color={C.amber} icon="⏱️" onClick={() => scrollTo(capacityRef)} />
      <KpiCard label="Reimbursement impact" value={fmtK(reimbursement)} sub="CMS penalty + denial recovery" color={C.blue} icon="💵" onClick={() => scrollTo(reimbRef)} />
      <KpiCard label="Patient safety" value={`${fmtNum(r.safetyPatientsProtected)} protected`} sub={`${fmtNum(r.safetyMedErrorsAvoided)} med errors avoided`} color={C.rose} icon="🛡️" onClick={() => scrollTo(safetyRef)} />
    </div>

    {/* 3-year + Galen quick stats */}
    <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
      <div onClick={() => scrollTo(projRef)} style={{ flex: 1, padding: "20px 22px", background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "center" }}>
        <div style={{ fontSize: F.tiny, color: C.textMuted, marginBottom: 4 }}>3-year projection</div>
        <div style={{ fontSize: F.h1, fontWeight: 800, color: C.accent }}>{fmtK(r.total3WithReimbursement || r.total3)}</div>
      </div>
      {hasGalen && <div style={{ flex: 1, padding: "20px 22px", background: C.accentPale, borderRadius: 18, border: `1px solid ${C.accent}30`, textAlign: "center" }}>
        <div style={{ fontSize: F.tiny, color: C.textMuted, marginBottom: 4 }}>Galen payback</div>
        <div style={{ fontSize: F.h1, fontWeight: 800, color: C.accent }}>{payback.toFixed(1)} yrs</div>
      </div>}
    </div>

    {/* ═══ DETAIL SECTIONS ═══ */}

    {/* Decommission */}
    <div ref={decomRef}>
      <Card style={{ marginBottom: 18 }}>
        <CTitle icon="🔓">Decommission savings</CTitle>
        <Row label="Legacy systems in scope" value={r.legacy} />
        <Row label="Systems retired" value={r.decom} />
        <Row label="Total estate cost" value={fmtK(r.totalEstate) + "/yr"} />
        <Row label="Annual savings from retirement" value={fmtK(r.decomSave) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> Each legacy system is classified into enterprise, departmental, or standalone tiers with bed-scaled annual costs (KLAS 2025, Becker's benchmarks). The decommission target ({Math.round(r.decom / Math.max(1, r.legacy) * 100)}% of {r.legacy} systems) determines how many are retired. Savings = sum of annual costs of retired systems.
        </Methodology>
      </Card>
    </div>

    {/* Capacity */}
    <div ref={capacityRef}>
      <Card style={{ marginBottom: 18 }}>
        <CTitle icon="⏱️">Clinical capacity</CTitle>
        <Row label="Total staff" value={fmtNum(r.totalStaff)} />
        <Row label="Active system users (65%)" value={fmtNum(r.clinicians)} />
        <Row label="Systems per user (~35% exposure)" value={r.systemsPerUser} />
        <Row label="Time wasted per person/week" value={`${r.minsWasted} mins`} />
        <Row label="Hours freed per year" value={fmtNum(r.hrsSaved)} />
        <Row label="FTE equivalent" value={fmtNum(fte)} accent />
        <Row label="Capacity value" value={fmtK(capacity) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> Of {fmtNum(r.totalStaff)} total staff, {fmtNum(r.clinicians)} (65%) are regular system users. Each navigates ~{r.systemsPerUser} of {r.legacy} systems (35% exposure). Switch penalty of 4% per system applies only to touched systems. Hours freed valued at $95/hr with {Math.round((r.realization || 0.3) * 100)}% realization. Evidence: HIMSS analytics, Westbrook et al JAMIA 2010.
        </Methodology>
      </Card>
    </div>

    {/* Reimbursement */}
    {reimbursement > 0 && <div ref={reimbRef}>
      <Card style={{ marginBottom: 18 }}>
        <CTitle icon="💵">Reimbursement & compliance</CTitle>
        {r.hrrpReduction > 0 && <Row label="HRRP penalty recovery" value={fmtK(r.hrrpReduction)} />}
        {r.hacReduction > 0 && <Row label="HAC improvement" value={fmtK(r.hacReduction)} />}
        {r.vbpImprovement > 0 && <Row label="VBP opportunity" value={fmtK(r.vbpImprovement)} />}
        {r.denialRecovery > 0 && <Row label="Denial recovery" value={fmtK(r.denialRecovery)} />}
        <Row label="Total reimbursement impact" value={fmtK(reimbursement) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> CMS penalty programs (HRRP 3% max, HAC 1%, VBP 2% withhold) modeled from FY2025 data. Denial recovery at 4.8% net revenue loss (HFMA 2024). Better documentation from system consolidation reduces penalties and denials. Evidence: Pattar et al JAMA 2025, Vest et al JAMIA 2019.
        </Methodology>
      </Card>
    </div>}

    {/* Patient safety */}
    <div ref={safetyRef}>
      <Card style={{ marginBottom: 18 }}>
        <CTitle icon="🛡️">Patient safety impact</CTitle>
        <Row label="Medication errors avoided" value={fmtNum(r.safetyMedErrorsAvoided)} />
        <Row label="Patients protected from harm" value={fmtNum(r.safetyPatientsProtected)} />
        <Row label="Excess bed days avoided" value={fmtNum(r.safetyBedDaysAvoided)} />
        {r.malpracticeReduction > 0 && <Row label="Malpractice reduction" value={fmtK(r.malpracticeReduction) + "/yr"} />}
        {(r.qualitySavings || 0) > 0 && <Row label="Total cost avoidance" value={fmtK(r.qualitySavings) + "/yr"} accent />}
        <div style={{ marginTop: 12, padding: "12px 16px", background: C.bg, borderRadius: 12, fontSize: F.tiny, color: C.textMuted, lineHeight: 1.6 }}>
          These are cost avoidance figures — they represent harm that doesn't occur, not direct budget reductions. They contribute to the total ROI through reduced length of stay, fewer readmissions, and lower liability exposure.
        </div>
        <Methodology>
          <strong>Method:</strong> ADE rates from AHRQ PSI data and HHS OIG 2022 (25% of Medicare patients experience adverse events). Excess bed day cost: $3,132/day (KFF/AHA 2023). Medication errors: Bates et al (1.8 preventable ADEs per 100 admissions). Communication failures: 30% of malpractice claims (CRICO 2016).
        </Methodology>
      </Card>
    </div>

    {/* Year-by-year */}
    <div ref={projRef}>
      <Card style={{ marginBottom: 18 }}>
        <CTitle icon="📅">Year-by-year projection</CTitle>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          {[
            { yr: "Year 1", val: r.yr1R || r.yr1, pct: 40 },
            { yr: "Year 2", val: r.yr2R || r.yr2, pct: 80 },
            { yr: "Year 3", val: r.yr3R || r.yr3, pct: 100 },
          ].map(y => <div key={y.yr} style={{ flex: 1, padding: "18px 20px", background: C.bg, borderRadius: 16, textAlign: "center" }}>
            <div style={{ fontSize: F.small, color: C.textMuted, marginBottom: 6 }}>{y.yr}</div>
            <div style={{ fontSize: F.h2, fontWeight: 800, color: C.accent }}>{fmtK(y.val)}</div>
            <div style={{ fontSize: F.tiny, color: C.textMuted }}>{y.pct}% ramp</div>
            <div style={{ marginTop: 6, height: 4, background: C.border, borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${y.pct}%`, background: C.accent, borderRadius: 2 }} />
            </div>
          </div>)}
        </div>
        <Methodology>
          <strong>Method:</strong> 3-year phased ramp: Year 1 at 40%, Year 2 at 80%, Year 3 at 100%. Reflects progressive legacy system retirement — data migrated and interfaces retired over time, not all at once.
        </Methodology>
      </Card>
    </div>

    {/* Galen */}
    {hasGalen && <div style={{ marginBottom: 24, padding: "32px 36px", borderRadius: 24, background: `linear-gradient(135deg, ${C.accentPale}, ${C.surface})`, border: `1px solid ${C.accent}30` }}>
      <div style={{ fontSize: F.h3, fontWeight: 700, color: C.accent, marginBottom: 18 }}>Galen Clinical Archive — investment case</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Met label="Migration cost" value={fmtK(galenMigrationCost)} />
        <Met label="Annual cost" value={fmtK(galenAnnualCost) + "/yr"} />
        <Met label="Payback period" value={payback.toFixed(1) + " yrs"} />
        <Met label="Return multiple" value={Math.round(r.decomSave / Math.max(1, galenMigrationCost)) + "x"} />
      </div>
      <div style={{ marginTop: 16, padding: "12px 16px", background: C.bg, borderRadius: 12, fontSize: F.tiny, color: C.textMuted, lineHeight: 1.6 }}>
        Payback = migration cost ÷ (annual decom savings − annual archive cost). The {fmtK(r.decomSave)}/yr in decommission savings is only unlocked when legacy systems are safely retired — Galen enables this by providing continued access to historical data.
      </div>
    </div>}

    {/* Actions */}
    <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: "16px 0 24px" }}>
      <button onClick={onAdjust} style={{
        padding: "22px 44px", borderRadius: 18, border: `2px solid ${C.accent}`,
        background: "transparent", color: C.accent, fontSize: F.body, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit"
      }}>← Adjust inputs</button>
      <button onClick={onStartOver} style={{
        padding: "22px 44px", borderRadius: 18, border: `1px solid ${C.border}`,
        background: C.surface, color: C.textMid, fontSize: F.body, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit"
      }}>New case ↻</button>
    </div>
  </div>;
}

function KpiCard({ label, value, sub, color, icon, onClick }) {
  return <div onClick={onClick} style={{ padding: "24px 22px", background: C.surface, borderRadius: 18, border: `1px solid ${color}25`, cursor: "pointer", transition: "border-color .2s" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontSize: F.tiny, fontWeight: 600, color: C.textMuted }}>{label}</span>
    </div>
    <div style={{ fontSize: F.h1, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: F.tiny, color: C.textMid }}>{sub}</div>
    <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginTop: 8 }}>View details ↓</div>
  </div>;
}

function CompositionItem({ color, label, value, pct }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
    <span style={{ fontSize: F.tiny, color: C.textMid }}>{label}: <strong style={{ color }}>{value}</strong> ({pct}%)</span>
  </div>;
}

function CTitle({ icon, children }) {
  return <div style={{ fontSize: F.body, fontWeight: 700, color: C.textMid, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 24 }}>{icon}</span> {children}</div>;
}
function Row({ label, value, accent }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
    <span style={{ fontSize: F.small, color: C.textMid }}>{label}</span>
    <span style={{ fontSize: F.body, fontWeight: accent ? 800 : 600, color: accent ? C.accent : C.text }}>{value}</span>
  </div>;
}
function Met({ label, value }) {
  return <div><div style={{ fontSize: F.tiny, color: C.textMuted }}>{label}</div><div style={{ fontSize: F.h2, fontWeight: 800, color: C.accent }}>{value}</div></div>;
}
