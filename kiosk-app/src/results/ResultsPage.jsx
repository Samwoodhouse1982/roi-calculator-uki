import React from 'react';
import { C, fmtK, fmtNum } from '../theme';
import { Card } from '../components';

export function ResultsPage({ r, galenMigrationCost, galenAnnualCost, onReset }) {
  if (!r) return <div style={{ color: C.textMuted, textAlign: "center", padding: 60 }}>No results yet</div>;

  const combinedAnnual = (r.annualWithReimbursement || r.annual) + (r.qualitySavings || 0);
  const cashable = r.decomSave + (r.reimbursementImpact || 0) + (r.duplicateElimination || 0) + (r.infraConsolidation || 0);
  const capacity = r.timeSave || 0;
  const reimbursement = r.reimbursementImpact || 0;
  const fte = r.hrsSaved ? Math.round(r.hrsSaved * (r.realisation || 0.3) / 1824) : 0;
  const hasGalen = galenMigrationCost > 0;
  const payback = hasGalen ? galenMigrationCost / Math.max(1, r.decomSave - galenAnnualCost) : 0;

  return (
    <div>
      {/* Hero number */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Estimated annual savings
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-3px" }}>
          {fmtK(combinedAnnual)}
        </div>
        <div style={{ fontSize: 16, color: C.textMid, marginTop: 8 }}>per year at steady state</div>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
        <KpiCard label="Cashable savings" value={fmtK(cashable)} color={C.accent} />
        <KpiCard label="Capacity freed" value={`${fmtNum(fte)} FTE`} color={C.amber} />
        <KpiCard label="Reimbursement" value={fmtK(reimbursement)} color={C.purple} />
        <KpiCard label="3-year total" value={fmtK(r.total3WithReimbursement || r.total3)} color={C.blue} />
      </div>

      {/* Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textMid, marginBottom: 12 }}>Decommission savings</div>
          <Row label="Systems retired" value={r.decom} />
          <Row label="Annual savings" value={fmtK(r.decomSave)} accent />
          <Row label="Legacy estate" value={fmtK(r.totalEstate) + "/yr"} />
          <Row label="Legacy systems" value={r.legacy} />
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textMid, marginBottom: 12 }}>Clinical capacity</div>
          <Row label="Hours freed/yr" value={fmtNum(r.hrsSaved)} />
          <Row label="FTE equivalent" value={fte} accent />
          <Row label="Realisation rate" value={`${Math.round((r.realisation || 0.3) * 100)}%`} />
          <Row label="Capacity value" value={fmtK(capacity) + "/yr"} accent />
        </Card>
        {reimbursement > 0 && <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textMid, marginBottom: 12 }}>Reimbursement impact</div>
          {r.hrrpReduction > 0 && <Row label="HRRP penalty recovery" value={fmtK(r.hrrpReduction)} />}
          {r.hacReduction > 0 && <Row label="HAC improvement" value={fmtK(r.hacReduction)} />}
          {r.vbpImprovement > 0 && <Row label="VBP opportunity" value={fmtK(r.vbpImprovement)} />}
          {r.denialRecovery > 0 && <Row label="Denial recovery" value={fmtK(r.denialRecovery)} />}
          <Row label="Total impact" value={fmtK(reimbursement) + "/yr"} accent />
        </Card>}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textMid, marginBottom: 12 }}>Patient safety</div>
          <Row label="Medication errors avoided" value={fmtNum(r.safetyMedErrorsAvoided)} />
          <Row label="Patients protected" value={fmtNum(r.safetyPatientsProtected)} />
          <Row label="Excess bed days avoided" value={fmtNum(r.safetyBedDaysAvoided)} />
          {r.malpracticeReduction > 0 && <Row label="Malpractice reduction" value={fmtK(r.malpracticeReduction)} />}
        </Card>
      </div>

      {/* Galen investment case */}
      {hasGalen && (
        <Card style={{ border: `1px solid ${C.accent}30`, background: C.accentPale, marginBottom: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 12 }}>Galen Clinical Archive — investment case</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 11, color: C.textMuted }}>Migration cost</div><div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{fmtK(galenMigrationCost)}</div></div>
            <div><div style={{ fontSize: 11, color: C.textMuted }}>Annual cost</div><div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{fmtK(galenAnnualCost)}/yr</div></div>
            <div><div style={{ fontSize: 11, color: C.textMuted }}>Payback</div><div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{payback.toFixed(1)} yrs</div></div>
            <div><div style={{ fontSize: 11, color: C.textMuted }}>Savings unlocked</div><div style={{ fontSize: 22, fontWeight: 800, color: C.accent }}>{fmtK(r.decomSave)}/yr</div></div>
          </div>
        </Card>
      )}

      {/* Reset button */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={onReset} style={{
          padding: "16px 40px", borderRadius: 14, border: `1px solid ${C.border}`,
          background: C.surface, color: C.textMid, fontSize: 16, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit"
        }}>
          ← Start new calculation
        </button>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{
      padding: "20px 22px", background: C.surface, borderRadius: 14,
      border: `1px solid ${color}25`, textAlign: "center"
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, color: C.textMid }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: accent ? 800 : 600, color: accent ? C.accent : C.text }}>{value}</span>
    </div>
  );
}
