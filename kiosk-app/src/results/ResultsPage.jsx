import React from 'react';
import { C, F, fmtK, fmtNum } from '../theme';
import { Card } from '../components';

export function ResultsPage({ r, galenMigrationCost, galenAnnualCost, onReset }) {
  if (!r) return <div style={{ color: C.textMuted, textAlign: "center", padding: 80, fontSize: F.h3 }}>No results yet</div>;

  const combinedAnnual = (r.annualWithReimbursement || r.annual) + (r.qualitySavings || 0);
  const cashable = r.decomSave + (r.reimbursementImpact || 0) + (r.duplicateElimination || 0) + (r.infraConsolidation || 0);
  const capacity = r.timeSave || 0;
  const reimbursement = r.reimbursementImpact || 0;
  const fte = r.hrsSaved ? Math.round(r.hrsSaved * (r.realisation || 0.3) / 1824) : 0;
  const hasGalen = galenMigrationCost > 0;
  const payback = hasGalen ? galenMigrationCost / Math.max(1, r.decomSave - galenAnnualCost) : 0;

  return <div style={{ animation: "kiosk-fade .5s ease-out" }}>
    <style>{`@keyframes kiosk-fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse-glow { 0%,100% { text-shadow: 0 0 20px rgba(0,212,170,0.3); } 50% { text-shadow: 0 0 40px rgba(0,212,170,0.6); } }`}</style>

    {/* Hero */}
    <div style={{ textAlign: "center", marginBottom: 44, padding: "20px 0" }}>
      <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
        Estimated annual savings
      </div>
      <div style={{ fontSize: 96, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-4px", animation: "pulse-glow 3s ease-in-out infinite" }}>
        {fmtK(combinedAnnual)}
      </div>
      <div style={{ fontSize: F.h3, color: C.textMid, marginTop: 12 }}>per year at steady state</div>
    </div>

    {/* KPI strip */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
      <KpiCard label="Cashable savings" value={fmtK(cashable)} color={C.accent} icon="💰" />
      <KpiCard label="Capacity freed" value={`${fmtNum(fte)} FTE`} color={C.amber} icon="👥" />
      <KpiCard label="Reimbursement impact" value={fmtK(reimbursement)} color={C.purple} icon="📊" />
      <KpiCard label="3-year projection" value={fmtK(r.total3WithReimbursement || r.total3)} color={C.blue} icon="📈" />
    </div>

    {/* Breakdown grid */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
      <Card>
        <CardTitle icon="🔓">Decommission savings</CardTitle>
        <Row label="Systems retired" value={r.decom} />
        <Row label="Annual savings" value={fmtK(r.decomSave) + "/yr"} accent />
        <Row label="Legacy estate" value={fmtK(r.totalEstate) + "/yr"} />
        <Row label="Total legacy systems" value={r.legacy} />
      </Card>
      <Card>
        <CardTitle icon="⏱️">Clinical capacity</CardTitle>
        <Row label="Hours freed per year" value={fmtNum(r.hrsSaved)} />
        <Row label="FTE equivalent" value={fmtNum(fte)} accent />
        <Row label="Realisation rate" value={`${Math.round((r.realisation || 0.3) * 100)}%`} />
        <Row label="Capacity value" value={fmtK(capacity) + "/yr"} accent />
      </Card>
      {reimbursement > 0 && <Card>
        <CardTitle icon="💵">Reimbursement & compliance</CardTitle>
        {r.hrrpReduction > 0 && <Row label="HRRP penalty recovery" value={fmtK(r.hrrpReduction)} />}
        {r.hacReduction > 0 && <Row label="HAC improvement" value={fmtK(r.hacReduction)} />}
        {r.vbpImprovement > 0 && <Row label="VBP opportunity" value={fmtK(r.vbpImprovement)} />}
        {r.denialRecovery > 0 && <Row label="Denial recovery" value={fmtK(r.denialRecovery)} />}
        <Row label="Total impact" value={fmtK(reimbursement) + "/yr"} accent />
      </Card>}
      <Card>
        <CardTitle icon="🛡️">Patient safety</CardTitle>
        <Row label="Medication errors avoided" value={fmtNum(r.safetyMedErrorsAvoided)} />
        <Row label="Patients protected" value={fmtNum(r.safetyPatientsProtected)} />
        <Row label="Excess bed days avoided" value={fmtNum(r.safetyBedDaysAvoided)} />
        {r.malpracticeReduction > 0 && <Row label="Malpractice reduction" value={fmtK(r.malpracticeReduction) + "/yr"} />}
      </Card>
    </div>

    {/* Galen investment */}
    {hasGalen && <div style={{
      marginBottom: 32, padding: "28px 32px", borderRadius: 20,
      background: `linear-gradient(135deg, ${C.accentPale}, ${C.surface})`,
      border: `1px solid ${C.accent}30`
    }}>
      <div style={{ fontSize: F.h3, fontWeight: 700, color: C.accent, marginBottom: 16 }}>Galen Clinical Archive — investment case</div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        <Metric label="Migration cost" value={fmtK(galenMigrationCost)} />
        <Metric label="Annual cost" value={fmtK(galenAnnualCost) + "/yr"} />
        <Metric label="Payback" value={payback.toFixed(1) + " yrs"} />
        <Metric label="Savings unlocked" value={fmtK(r.decomSave) + "/yr"} />
        <Metric label="Return" value={Math.round(r.decomSave / Math.max(1, galenMigrationCost)) + "x"} />
      </div>
    </div>}

    {/* Year-by-year */}
    <Card style={{ marginBottom: 32 }}>
      <CardTitle icon="📅">Year-by-year projection</CardTitle>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        {[
          { yr: "Year 1", val: r.yr1R || r.yr1, pct: "40%" },
          { yr: "Year 2", val: r.yr2R || r.yr2, pct: "80%" },
          { yr: "Year 3", val: r.yr3R || r.yr3, pct: "100%" },
        ].map(y => <div key={y.yr} style={{ flex: 1, padding: "16px 18px", background: C.bg, borderRadius: 14, textAlign: "center" }}>
          <div style={{ fontSize: F.small, color: C.textMuted, marginBottom: 4 }}>{y.yr}</div>
          <div style={{ fontSize: F.h2, fontWeight: 800, color: C.accent }}>{fmtK(y.val)}</div>
          <div style={{ fontSize: F.tiny, color: C.textMuted }}>{y.pct} ramp</div>
        </div>)}
      </div>
    </Card>

    {/* Actions */}
    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
      <button onClick={onReset} style={{
        padding: "18px 44px", borderRadius: 16, border: `1px solid ${C.border}`,
        background: C.surface, color: C.textMid, fontSize: F.body, fontWeight: 600,
        cursor: "pointer", fontFamily: "inherit"
      }}>
        ← Start new calculation
      </button>
    </div>
  </div>;
}

function KpiCard({ label, value, color, icon }) {
  return <div style={{ padding: "24px 26px", background: C.surface, borderRadius: 18, border: `1px solid ${color}25`, textAlign: "center" }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: F.tiny, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: F.h1, fontWeight: 800, color }}>{value}</div>
  </div>;
}

function CardTitle({ icon, children }) {
  return <div style={{ fontSize: F.body, fontWeight: 700, color: C.textMid, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ fontSize: 20 }}>{icon}</span> {children}
  </div>;
}

function Row({ label, value, accent }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
    <span style={{ fontSize: F.small, color: C.textMid }}>{label}</span>
    <span style={{ fontSize: F.body, fontWeight: accent ? 800 : 600, color: accent ? C.accent : C.text }}>{value}</span>
  </div>;
}

function Metric({ label, value }) {
  return <div>
    <div style={{ fontSize: F.tiny, color: C.textMuted }}>{label}</div>
    <div style={{ fontSize: F.h2, fontWeight: 800, color: C.accent }}>{value}</div>
  </div>;
}
