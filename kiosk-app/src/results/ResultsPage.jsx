import React from 'react';
import { C, F, fmtK, fmtNum } from '../theme';
import { Card } from '../components';

export function ResultsPage({ r, galenMigrationCost, galenAnnualCost, onReset }) {
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
    <div style={{ textAlign: "center", marginBottom: 48, padding: "24px 0" }}>
      <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMuted, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Estimated annual savings</div>
      <div style={{ fontSize: F.hero, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-4px", animation: "glow 3s ease-in-out infinite" }}>{fmtK(combinedAnnual)}</div>
      <div style={{ fontSize: F.h3, color: C.textMid, marginTop: 14 }}>per year at steady state</div>
    </div>

    {/* KPI grid — 2x2 for portrait */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 36 }}>
      <Kpi label="Cashable savings" value={fmtK(cashable)} color={C.accent} icon="💰" />
      <Kpi label="Capacity freed" value={`${fmtNum(fte)} FTE`} color={C.amber} icon="👥" />
      <Kpi label="Reimbursement" value={fmtK(reimbursement)} color={C.purple} icon="📊" />
      <Kpi label="3-year total" value={fmtK(r.total3WithReimbursement || r.total3)} color={C.blue} icon="📈" />
    </div>

    {/* Breakdown — single column for portrait */}
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="🔓">Decommission savings</CTitle>
      <Row label="Systems retired" value={r.decom} />
      <Row label="Annual savings" value={fmtK(r.decomSave) + "/yr"} accent />
      <Row label="Legacy estate" value={fmtK(r.totalEstate) + "/yr"} />
    </Card>
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="⏱️">Clinical capacity</CTitle>
      <Row label="Hours freed/yr" value={fmtNum(r.hrsSaved)} />
      <Row label="FTE equivalent" value={fmtNum(fte)} accent />
      <Row label="Capacity value" value={fmtK(capacity) + "/yr"} accent />
    </Card>
    {reimbursement > 0 && <Card style={{ marginBottom: 18 }}>
      <CTitle icon="💵">Reimbursement & compliance</CTitle>
      {r.hrrpReduction > 0 && <Row label="HRRP penalty recovery" value={fmtK(r.hrrpReduction)} />}
      {r.hacReduction > 0 && <Row label="HAC improvement" value={fmtK(r.hacReduction)} />}
      {r.vbpImprovement > 0 && <Row label="VBP opportunity" value={fmtK(r.vbpImprovement)} />}
      {r.denialRecovery > 0 && <Row label="Denial recovery" value={fmtK(r.denialRecovery)} />}
      <Row label="Total impact" value={fmtK(reimbursement) + "/yr"} accent />
    </Card>}
    <Card style={{ marginBottom: 18 }}>
      <CTitle icon="🛡️">Patient safety</CTitle>
      <Row label="Medication errors avoided" value={fmtNum(r.safetyMedErrorsAvoided)} />
      <Row label="Patients protected" value={fmtNum(r.safetyPatientsProtected)} />
      <Row label="Excess bed days avoided" value={fmtNum(r.safetyBedDaysAvoided)} />
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

    <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
      <button onClick={onReset} style={{ padding: "22px 52px", borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, color: C.textMid, fontSize: F.body, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Start new calculation</button>
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
