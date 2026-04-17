import React, { useState } from 'react';
import { C, F, fmtK, fmtNum } from '../theme';
import { Card } from '../components';

function Methodology({ title, children }) {
  const [open, setOpen] = useState(false);
  return <div style={{ marginTop: 8 }}>
    <div onClick={() => setOpen(!open)} style={{ fontSize: F.tiny, color: C.accent, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>▶</span> How we calculated this
    </div>
    {open && <div style={{ marginTop: 8, padding: "14px 18px", background: C.bg, borderRadius: 14, fontSize: F.tiny, color: C.textMid, lineHeight: 1.7, border: `1px solid ${C.borderLight}` }}>{children}</div>}
  </div>;
}

export function ResultsPage({ r, galenMigrationCost, galenAnnualCost, onAdjust }) {
  if (!r) return null;
  const combinedAnnual = (r.annualWithReimbursement || r.annual) + (r.qualitySavings || 0);
  const cashable = r.decomSave + (r.reimbursementImpact || 0) + (r.duplicateElimination || 0) + (r.infraConsolidation || 0);
  const capacity = r.timeSave || 0;
  const reimbursement = r.reimbursementImpact || 0;
  const fte = r.hrsSaved ? Math.round(r.hrsSaved * (r.realisation || 0.3) / 1824) : 0;
  const hasGalen = galenMigrationCost > 0;
  const payback = hasGalen ? galenMigrationCost / Math.max(1, r.decomSave - galenAnnualCost) : 0;

  return <div style={{ animation: "rfade .5s ease-out" }}>
    <style>{`@keyframes rfade { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes glow { 0%,100% { text-shadow: 0 0 30px rgba(0,212,170,0.3); } 50% { text-shadow: 0 0 60px rgba(0,212,170,0.6); } }`}</style>

    {/* Hero */}
    <div style={{ textAlign: "center", marginBottom: 44, padding: "24px 0" }}>
      <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMuted, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Estimated annual savings</div>
      <div style={{ fontSize: F.hero, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-4px", animation: "glow 3s ease-in-out infinite" }}>{fmtK(combinedAnnual)}</div>
      <div style={{ fontSize: F.h3, color: C.textMid, marginTop: 14 }}>per year at steady state</div>
    </div>

    {/* KPIs */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 32 }}>
      <Kpi label="Cashable savings" value={fmtK(cashable)} color={C.accent} icon="💰" />
      <Kpi label="Capacity freed" value={`${fmtNum(fte)} FTE`} color={C.amber} icon="👥" />
      <Kpi label="Reimbursement" value={fmtK(reimbursement)} color={C.purple} icon="📊" />
      <Kpi label="3-year total" value={fmtK(r.total3WithReimbursement || r.total3)} color={C.blue} icon="📈" />
    </div>

    {/* Decommission */}
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="🔓">Decommission savings</CTitle>
      <Row label="Systems retired" value={r.decom} />
      <Row label="Annual savings" value={fmtK(r.decomSave) + "/yr"} accent />
      <Row label="Legacy estate" value={fmtK(r.totalEstate) + "/yr"} />
      <Methodology>
        <strong>Method:</strong> Each legacy system is classified into enterprise, departmental, or standalone tiers with bed-scaled annual costs. The decommission target ({Math.round(r.decom / Math.max(1, r.legacy) * 100)}% of {r.legacy} systems) determines how many are retired. Savings = sum of annual costs of retired systems. Costs are modelled from US health system contract benchmarks (KLAS 2025, Becker's Hospital Review) scaled to your bed count and complexity.
      </Methodology>
    </Card>

    {/* Capacity */}
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="⏱️">Clinical capacity</CTitle>
      <Row label="Hours freed/yr" value={fmtNum(r.hrsSaved)} />
      <Row label="FTE equivalent" value={fmtNum(fte)} accent />
      <Row label="Capacity value" value={fmtK(capacity) + "/yr"} accent />
      <Methodology>
        <strong>Method:</strong> Clinical staff ({fmtNum(r.clinicians)}) lose time each week navigating between {r.legacy} legacy systems. Base time wasted is scaled by data quality and complexity, plus a 4% overhead per additional system. Hours freed are valued at the blended hourly rate ($95) with a {Math.round((r.realisation || 0.3) * 100)}% realisation rate. This is capacity freed for patient care, not headcount reduction. Based on Westbrook et al (JAMIA 2010) workflow studies.
      </Methodology>
    </Card>

    {/* Reimbursement */}
    {reimbursement > 0 && <Card style={{ marginBottom: 18 }}>
      <CTitle icon="💵">Reimbursement & compliance</CTitle>
      {r.hrrpReduction > 0 && <Row label="HRRP penalty recovery" value={fmtK(r.hrrpReduction)} />}
      {r.hacReduction > 0 && <Row label="HAC improvement" value={fmtK(r.hacReduction)} />}
      {r.vbpImprovement > 0 && <Row label="VBP opportunity" value={fmtK(r.vbpImprovement)} />}
      {r.denialRecovery > 0 && <Row label="Denial recovery" value={fmtK(r.denialRecovery)} />}
      <Row label="Total impact" value={fmtK(reimbursement) + "/yr"} accent />
      <Methodology>
        <strong>Method:</strong> CMS penalty programmes (HRRP 3% max, HAC 1% bottom quartile, VBP 2% withhold pool) modelled from CMS programme data FY2025. Penalty exposure derived from Medicare revenue and provider-type multipliers. Denial recovery modelled at 4.8% net revenue loss (HFMA 2024), with EHR consolidation improving documentation quality. Malpractice: $8,500/bed (Mello et al, Health Affairs). Evidence: Pattar et al JAMA 2025 (116 RCTs), Vest et al JAMIA 2019.
      </Methodology>
    </Card>}

    {/* Safety */}
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="🛡️">Patient safety</CTitle>
      <Row label="Medication errors avoided" value={fmtNum(r.safetyMedErrorsAvoided)} />
      <Row label="Patients protected" value={fmtNum(r.safetyPatientsProtected)} />
      <Row label="Excess bed days avoided" value={fmtNum(r.safetyBedDaysAvoided)} />
      <Methodology>
        <strong>Method:</strong> Adverse event rates from AHRQ PSI data and HHS OIG 2022 (25% of Medicare patients experience adverse events). Excess bed day cost: $3,132/day (KFF/AHA 2023). Medication error reduction evidence: Bates et al ADE Prevention Study (1.8 preventable ADEs per 100 admissions). Communication failure attribution: 30% of malpractice claims (CRICO 2016, 23,658 claims analysis).
      </Methodology>
    </Card>

    {/* Year-by-year */}
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="📅">Year-by-year projection</CTitle>
      <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
        {[{ yr: "Year 1", val: r.yr1R || r.yr1, pct: "40%" }, { yr: "Year 2", val: r.yr2R || r.yr2, pct: "80%" }, { yr: "Year 3", val: r.yr3R || r.yr3, pct: "100%" }].map(y =>
          <div key={y.yr} style={{ flex: 1, padding: "18px 20px", background: C.bg, borderRadius: 16, textAlign: "center" }}>
            <div style={{ fontSize: F.small, color: C.textMuted, marginBottom: 6 }}>{y.yr}</div>
            <div style={{ fontSize: F.h2, fontWeight: 800, color: C.accent }}>{fmtK(y.val)}</div>
            <div style={{ fontSize: F.tiny, color: C.textMuted }}>{y.pct} ramp</div>
          </div>)}
      </div>
      <Methodology>
        <strong>Method:</strong> 3-year phased ramp: Year 1 at 40%, Year 2 at 80%, Year 3 at 100% of steady-state savings. Reflects the progressive nature of legacy system retirement — systems are decommissioned over time as data is migrated and interfaces retired, not switched off on day one.
      </Methodology>
    </Card>

    {/* Galen */}
    {hasGalen && <div style={{ marginBottom: 24, padding: "32px 36px", borderRadius: 24, background: `linear-gradient(135deg, ${C.accentPale}, ${C.surface})`, border: `1px solid ${C.accent}30` }}>
      <div style={{ fontSize: F.h3, fontWeight: 700, color: C.accent, marginBottom: 18 }}>Galen Clinical Archive</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Met label="Migration" value={fmtK(galenMigrationCost)} />
        <Met label="Annual" value={fmtK(galenAnnualCost) + "/yr"} />
        <Met label="Payback" value={payback.toFixed(1) + " yrs"} />
        <Met label="Return" value={Math.round(r.decomSave / Math.max(1, galenMigrationCost)) + "x"} />
      </div>
    </div>}

    {/* Actions */}
    <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: "16px 0 24px" }}>
      <button onClick={onAdjust} style={{
        padding: "22px 52px", borderRadius: 18, border: `2px solid ${C.accent}`,
        background: "transparent", color: C.accent, fontSize: F.body, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit"
      }}>← Adjust inputs</button>
    </div>
  </div>;
}

function Kpi({ label, value, color, icon }) {
  return <div style={{ padding: "28px 24px", background: C.surface, borderRadius: 20, border: `1px solid ${color}25`, textAlign: "center" }}>
    <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: F.tiny, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>{label}</div>
    <div style={{ fontSize: F.h1, fontWeight: 800, color }}>{value}</div>
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
