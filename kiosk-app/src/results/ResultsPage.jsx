import React, { useState, useRef } from 'react';
import { C, F, fmtK, fmtNum } from '../theme';
import { Icon } from '../components/Icons';
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
  const [projYears, setProjYears] = useState(3);
  const [tappedBar, setTappedBar] = useState(null);
  const decomRef = useRef(null);
  const capacityRef = useRef(null);
  const reimbRef = useRef(null);
  const safetyRef = useRef(null);
  const networkRef = useRef(null);
  const academicRef = useRef(null);
  const projRef = useRef(null);
  const scrollTo = ref => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Use the engine's comprehensive total - all components sum exactly to this
  const totalAnnual = r.annualWithReimbursement || 0;
  // Non-overlapping segments that sum to totalAnnual
  const seg = {
    decom:    r.decomSave || 0,
    capacity: r.timeSave || 0,
    reimb:    r.reimbursementImpact || 0,
    safety:   r.qualitySavings || 0,
    academic: r.academicSavings || 0,
    network:  r.mergeSavings || 0,
  };
  const fteRaw = r.hrsSaved ? r.hrsSaved * (r.realization || 0.3) / 1824 : 0;
  const fte = fteRaw >= 1 ? Math.round(fteRaw) : Math.round(fteRaw * 10) / 10;
  const fmtFte = v => v < 1 ? v.toFixed(1) : fmtNum(v);
  const hasGalen = galenMigrationCost > 0;
  const payback = hasGalen ? galenMigrationCost / Math.max(1, r.decomSave - galenAnnualCost) : 0;

  return <div style={{ animation: "rfade .5s ease-out" }}>
    <style>{`@keyframes rfade { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes glow { 0%,100% { text-shadow: 0 0 30px rgba(0,212,170,0.3); } 50% { text-shadow: 0 0 60px rgba(0,212,170,0.6); } }`}</style>

    {/* Hero */}
    <div style={{ textAlign: "center", marginBottom: 20, padding: "24px 0" }}>
      <div style={{ fontSize: F.body, fontWeight: 600, color: C.textMuted, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Estimated annual savings</div>
      <div style={{ fontSize: F.hero, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-4px", animation: "glow 3s ease-in-out infinite" }}>{fmtK(totalAnnual)}</div>
      <div style={{ fontSize: F.h3, color: C.textMid, marginTop: 14 }}>per year at steady state</div>
    </div>

    {/* Composition bar - every segment sums exactly to the topline */}
    <div style={{ marginBottom: 32, padding: "0 12px" }}>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
        {seg.decom > 0 && <div style={{ flex: seg.decom, background: C.accent }} />}
        {seg.capacity > 0 && <div style={{ flex: seg.capacity, background: C.amber }} />}
        {seg.reimb > 0 && <div style={{ flex: seg.reimb, background: C.blue }} />}
        {seg.safety > 0 && <div style={{ flex: seg.safety, background: C.purple }} />}
        {seg.academic > 0 && <div style={{ flex: seg.academic, background: "#e67e22" }} />}
        {seg.network > 0 && <div style={{ flex: seg.network, background: "#8e44ad" }} />}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <CompositionItem color={C.accent} label="Decommission" value={fmtK(seg.decom)} pct={Math.round(seg.decom / Math.max(1, totalAnnual) * 100)} />
        <CompositionItem color={C.amber} label="Capacity" value={fmtK(seg.capacity)} pct={Math.round(seg.capacity / Math.max(1, totalAnnual) * 100)} />
        {seg.reimb > 0 && <CompositionItem color={C.blue} label="Reimbursement" value={fmtK(seg.reimb)} pct={Math.round(seg.reimb / Math.max(1, totalAnnual) * 100)} />}
        {seg.safety > 0 && <CompositionItem color={C.purple} label="Patient safety" value={fmtK(seg.safety)} pct={Math.round(seg.safety / Math.max(1, totalAnnual) * 100)} />}
        {seg.academic > 0 && <CompositionItem color="#e67e22" label="Academic" value={fmtK(seg.academic)} pct={Math.round(seg.academic / Math.max(1, totalAnnual) * 100)} />}
        {seg.network > 0 && <CompositionItem color="#8e44ad" label="Network" value={fmtK(seg.network)} pct={Math.round(seg.network / Math.max(1, totalAnnual) * 100)} />}
      </div>
    </div>

    {/* KPI grid - each card maps to a segment above, tappable to jump to detail */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
      <KpiCard label="Legacy decommission" value={fmtK(seg.decom)} sub={`${r.decom} of ${r.legacy} systems retired`} color={C.accent} iconKey="unlock" onClick={() => scrollTo(decomRef)} />
      <KpiCard label="Clinical capacity" value={`${fmtFte(fte)} FTE freed`} sub={`${fmtK(seg.capacity)}/yr value`} color={C.amber} iconKey="clock" onClick={() => scrollTo(capacityRef)} />
      {seg.reimb > 0 && <KpiCard label="Reimbursement impact" value={fmtK(seg.reimb)} sub="CMS penalty + denial recovery" color={C.blue} iconKey="dollar" onClick={() => scrollTo(reimbRef)} />}
      {seg.safety > 0 && <KpiCard label="Patient safety" value={fmtK(seg.safety)} sub={`${fmtNum(r.safetyPatientsProtected)} patients protected`} color={C.purple} iconKey="shield" onClick={() => scrollTo(safetyRef)} />}
      {seg.network > 0 && <KpiCard label="Network consolidation" value={fmtK(seg.network)} sub={`${r.duplicateSystems} duplicate systems across ${r.org_count || ""} facilities`} color="#8e44ad" iconKey="network" onClick={() => scrollTo(networkRef)} />}
      {seg.academic > 0 && <KpiCard label="Academic program" value={fmtK(seg.academic)} sub="Research + GME + teaching" color="#e67e22" iconKey="graduation" onClick={() => scrollTo(academicRef)} />}
    </div>



    {/* ═══ DETAIL SECTIONS ═══ */}

    {/* Year-by-year projection - first section */}
    <div ref={projRef}>
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <CTitle iconKey="calendar">Savings projection</CTitle>
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {[3, 5].map(n => <button key={n} onClick={() => { setProjYears(n); setTappedBar(null); }} style={{
              padding: "8px 20px", border: "none", fontSize: F.tiny, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              background: projYears === n ? C.accent : C.surface, color: projYears === n ? "#0a0f1a" : C.textMid,
            }}>{n}-year</button>)}
          </div>
        </div>

        {/* Cumulative total banner */}
        {(() => {
          const yr3Val = r.yr3R || r.yr3 || 0;
          const yr4 = yr3Val;
          const yr5 = yr3Val;
          const total = projYears === 5
            ? (r.total3WithReimbursement || r.total3 || 0) + yr4 + yr5
            : (r.total3WithReimbursement || r.total3 || 0);
          return <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
            <div style={{ fontSize: F.tiny, color: C.textMuted, marginBottom: 4 }}>{projYears}-year cumulative savings</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: C.accent, letterSpacing: "-2px" }}>{fmtK(total)}</div>
          </div>;
        })()}

        {/* Year cards */}
        {(() => {
          const yr3Val = r.yr3R || r.yr3 || 0;
          const allYrs = [
            { yr: "Year 1", val: r.yr1R || r.yr1, pct: 40 },
            { yr: "Year 2", val: r.yr2R || r.yr2, pct: 80 },
            { yr: "Year 3", val: r.yr3R || r.yr3, pct: 100 },
            ...(projYears === 5 ? [
              { yr: "Year 4", val: yr3Val, pct: 100 },
              { yr: "Year 5", val: yr3Val, pct: 100 },
            ] : []),
          ];
          return <div style={{ display: "flex", gap: projYears === 5 ? 8 : 14, marginBottom: 20 }}>
            {allYrs.map(y => <div key={y.yr} style={{ flex: 1, padding: projYears === 5 ? "14px 10px" : "18px 20px", background: C.bg, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: F.tiny, color: C.textMuted, marginBottom: 4 }}>{y.yr}</div>
              <div style={{ fontSize: projYears === 5 ? F.body : F.h2, fontWeight: 800, color: C.accent }}>{fmtK(y.val)}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{y.pct}%</div>
            </div>)}
          </div>;
        })()}

        {/* Interactive stacked bar chart */}
        {(() => {
          const yr3Val = r.yr3R || r.yr3 || 0;
          const yrs = [
            { yr: "Yr 1", pct: 0.4 },
            { yr: "Yr 2", pct: 0.8 },
            { yr: "Yr 3", pct: 1.0 },
            ...(projYears === 5 ? [{ yr: "Yr 4", pct: 1.0 }, { yr: "Yr 5", pct: 1.0 }] : []),
          ];
          const segments = [
            { key: "Decommission", color: C.accent, val: seg.decom },
            { key: "Capacity", color: C.amber, val: seg.capacity },
            { key: "Reimbursement", color: C.blue, val: seg.reimb },
            { key: "Patient safety", color: C.purple, val: seg.safety },
            { key: "Network", color: "#8e44ad", val: seg.network },
            { key: "Academic", color: "#e67e22", val: seg.academic },
          ].filter(s => s.val > 0);
          const barH = 160;
          return <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: projYears === 5 ? 6 : 10, alignItems: "flex-end", height: barH + 30, padding: "0 12px" }}>
              {yrs.map((y, yi) => {
                const h = Math.round(barH * y.pct);
                return <div key={y.yr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "100%", height: h, borderRadius: "10px 10px 4px 4px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {segments.map((s, si) => <div key={s.key}
                      onClick={() => setTappedBar(tappedBar === yi+"-"+si ? null : yi+"-"+si)}
                      style={{ flex: s.val, background: s.color, minHeight: 2, cursor: "pointer", position: "relative", opacity: tappedBar && tappedBar !== yi+"-"+si ? 0.4 : 1, transition: "opacity .2s" }}>
                      {tappedBar === yi+"-"+si && <div style={{
                        position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 4,
                        padding: "6px 10px", background: "#222", borderRadius: 8, whiteSpace: "nowrap", zIndex: 10,
                        fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                      }}>{s.key}: {fmtK(Math.round(s.val * y.pct))}</div>}
                    </div>)}
                  </div>
                  <div style={{ fontSize: F.tiny, color: C.textMuted, marginTop: 6, fontWeight: 600 }}>{y.yr}</div>
                </div>;
              })}
            </div>
            {tappedBar && <div style={{ textAlign: "center", marginTop: 8, fontSize: F.tiny, color: C.textMuted }}>Tap again to dismiss · tap another segment to compare</div>}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
              {segments.map(s => <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ fontSize: 10, color: C.textMuted }}>{s.key}</span>
              </div>)}
            </div>
          </div>;
        })()}

        <Methodology>
          <strong>Method:</strong> {projYears}-year phased ramp: Year 1 at 40%, Year 2 at 80%, Years 3{projYears === 5 ? " to 5" : ""} at 100%. Reflects progressive legacy system retirement. Data is migrated and interfaces decommissioned over time. {projYears === 5 ? "Years 4 and 5 represent steady-state savings with all targeted systems fully retired." : ""} Each savings category scales proportionally.
        </Methodology>
      </Card>
    </div>

    {/* Decommission */}
    <div ref={decomRef}>
      <Card style={{ marginBottom: 18, borderLeft: `3px solid ${C.accent}` }}>
        <CTitle iconKey="unlock" color={C.accent}>Decommission savings</CTitle>
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
      <Card style={{ marginBottom: 18, borderLeft: `3px solid ${C.amber}` }}>
        <CTitle iconKey="clock" color={C.amber}>Clinical capacity</CTitle>
        <Row label="Total staff" value={fmtNum(r.totalStaff)} />
        <Row label="Active system users (65%)" value={fmtNum(r.clinicians)} />
        <Row label="Systems per user (~35% exposure)" value={r.systemsPerUser} />
        <Row label="Time wasted per person/week" value={`${r.minsWasted} mins`} />
        <Row label="Hours freed per year" value={fmtNum(r.hrsSaved)} />
        <Row label="FTE equivalent" value={fmtFte(fte)} accent />
        <Row label="Capacity value" value={fmtK(seg.capacity) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> Of {fmtNum(r.totalStaff)} total staff, {fmtNum(r.clinicians)} (65%) are regular system users. Each navigates ~{r.systemsPerUser} of {r.legacy} systems (35% exposure). Switch penalty of 4% per system applies only to touched systems. Hours freed valued at $95/hr with {Math.round((r.realization || 0.3) * 100)}% realization. Evidence: HIMSS analytics, Westbrook et al JAMIA 2010.
        </Methodology>
      </Card>
    </div>

    {/* Reimbursement */}
    {seg.reimb > 0 && <div ref={reimbRef}>
      <Card style={{ marginBottom: 18, borderLeft: `3px solid ${C.blue}` }}>
        <CTitle iconKey="dollar" color={C.blue}>Reimbursement & compliance</CTitle>
        {r.hrrpReduction > 0 && <Row label="HRRP penalty recovery" value={fmtK(r.hrrpReduction)} />}
        {r.hacReduction > 0 && <Row label="HAC improvement" value={fmtK(r.hacReduction)} />}
        {r.vbpImprovement > 0 && <Row label="VBP opportunity" value={fmtK(r.vbpImprovement)} />}
        {r.denialRecovery > 0 && <Row label="Denial recovery" value={fmtK(r.denialRecovery)} />}
        <Row label="Total reimbursement impact" value={fmtK(seg.reimb) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> CMS penalty programs (HRRP 3% max, HAC 1%, VBP 2% withhold) modeled from FY2025 data. Denial recovery at 4.8% net revenue loss (HFMA 2024). Better documentation from system consolidation reduces penalties and denials. Evidence: Pattar et al JAMA 2025, Vest et al JAMIA 2019.
        </Methodology>
      </Card>
    </div>}

    {/* Patient safety */}
    <div ref={safetyRef}>
      <Card style={{ marginBottom: 18, borderLeft: `3px solid ${C.purple}` }}>
        <CTitle iconKey="shield" color={C.purple}>Patient safety impact</CTitle>
        <Row label="Medication errors avoided" value={fmtNum(r.safetyMedErrorsAvoided)} />
        <Row label="Patients protected from harm" value={fmtNum(r.safetyPatientsProtected)} />
        <Row label="Excess bed days avoided" value={fmtNum(r.safetyBedDaysAvoided)} />
        {r.malpracticeReduction > 0 && <Row label="Malpractice reduction" value={fmtK(r.malpracticeReduction) + "/yr"} />}
        {(r.qualitySavings || 0) > 0 && <Row label="Total cost avoidance" value={fmtK(r.qualitySavings) + "/yr"} accent />}
        <div style={{ marginTop: 12, padding: "12px 16px", background: C.bg, borderRadius: 12, fontSize: F.tiny, color: C.textMuted, lineHeight: 1.6 }}>
          These are cost avoidance figures. They represent harm that doesn't occur, not direct budget reductions. They contribute to the total ROI through reduced length of stay, fewer readmissions, and lower liability exposure.
        </div>
        <Methodology>
          <strong>Method:</strong> ADE rates from AHRQ PSI data and HHS OIG 2022 (25% of Medicare patients experience adverse events). Excess bed day cost: $3,132/day (KFF/AHA 2023). Medication errors: Bates et al (1.8 preventable ADEs per 100 admissions). Communication failures: 30% of malpractice claims (CRICO 2016).
        </Methodology>
      </Card>
    </div>

    {/* Network consolidation - only for multi-hospital/IDN */}
    {seg.network > 0 && <div ref={networkRef}>
      <Card style={{ marginBottom: 18, borderLeft: "3px solid #8e44ad" }}>
        <CTitle iconKey="network" color="#8e44ad">Network consolidation</CTitle>
        <div style={{ marginBottom: 12, fontSize: F.small, color: C.textMid, lineHeight: 1.6 }}>
          Multi-facility health systems typically run duplicate instances of the same legacy system across sites. Consolidating to a single archive eliminates redundant licensing, infrastructure, and support contracts.
        </div>
        <Row label="Duplicate systems identified" value={fmtNum(r.duplicateSystems)} />
        <Row label="Duplicate system cost" value={fmtK(r.duplicateSystemCost) + "/yr"} />
        {r.duplicateElimination > 0 && <Row label="Duplicate elimination savings" value={fmtK(r.duplicateElimination)} />}
        {r.infraConsolidation > 0 && <Row label="Infrastructure consolidation" value={fmtK(r.infraConsolidation)} />}
        {r.standardizationSave > 0 && <Row label="Cross-facility standardization" value={fmtK(r.standardizationSave)} />}
        <Row label="Total network savings" value={fmtK(seg.network) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> Duplicate system rate: ~30% of legacy systems are replicated across facilities in an IDN (CHIME Digital Health Survey). Infrastructure consolidation: each facility carries ~$350k/yr in duplicate hosting, interfaces, and support, of which 60% is consolidatable. Cross-facility standardization: 15% of operational costs addressable through unified workflows. All scaled by the decommission target.
        </Methodology>
      </Card>
    </div>}

    {/* Academic program - only for academic medical centers */}
    {seg.academic > 0 && <div ref={academicRef}>
      <Card style={{ marginBottom: 18, borderLeft: "3px solid #e67e22" }}>
        <CTitle iconKey="graduation" color="#e67e22">Academic program savings</CTitle>
        {r.researchDecomSave > 0 && <Row label="Research system decommission" value={fmtK(r.researchDecomSave)} />}
        {r.gmeEfficiency > 0 && <Row label="Graduate Medical Education (GME) compliance" value={fmtK(r.gmeEfficiency)} />}
        {r.teachingOverhead > 0 && <Row label="Teaching program overhead" value={fmtK(r.teachingOverhead)} />}
        <Row label="Total academic savings" value={fmtK(seg.academic) + "/yr"} accent />
        <Methodology>
          <strong>Method:</strong> Academic medical centers maintain additional legacy systems for research databases, GME tracking, and teaching program administration. Decommission savings calculated at the same tier-based rates, with additional compliance efficiency from consolidated audit trails. Based on AAMC benchmarks for academic system overhead.
        </Methodology>
      </Card>
    </div>}

    {/* Galen */}
    {hasGalen && <div style={{ marginBottom: 24, padding: "32px 36px", borderRadius: 24, background: `linear-gradient(135deg, ${C.accentPale}, ${C.surface})`, border: `1px solid ${C.accent}30` }}>
      <div style={{ fontSize: F.h3, fontWeight: 700, color: C.accent, marginBottom: 18 }}>Galen Clinical Archive: investment case</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Met label="Migration cost" value={fmtK(galenMigrationCost)} />
        <Met label="Annual cost" value={fmtK(galenAnnualCost) + "/yr"} />
        <Met label="Payback period" value={payback.toFixed(1) + " yrs"} />
        <Met label={projYears + "-year return"} value={(() => {
          const yr3 = r.yr3R || r.yr3 || 0;
          const totalSav = projYears === 5
            ? (r.total3WithReimbursement || r.total3 || 0) + yr3 + yr3
            : (r.total3WithReimbursement || r.total3 || 0);
          const totalCost = galenMigrationCost + galenAnnualCost * projYears;
          return Math.round((totalSav - totalCost) / Math.max(1, totalCost) * 100) + "% ROI";
        })()} />
      </div>
      <div style={{ marginTop: 16, padding: "12px 16px", background: C.bg, borderRadius: 12, fontSize: F.tiny, color: C.textMuted, lineHeight: 1.6 }}>
        Payback = migration cost ÷ (annual decom savings minus annual archive cost). The {fmtK(r.decomSave)}/yr in decommission savings is only unlocked when legacy systems are safely retired. Galen enables this by providing continued access to historical data.
      </div>
    </div>}

    {/* ═══ METHODOLOGY CAROUSEL ═══ */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: F.body, fontWeight: 700, color: C.textMid, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="lightbulb" size={22} stroke={C.accent} /> Full methodology
        <span style={{ fontSize: F.tiny, fontWeight: 400, color: C.textMuted, marginLeft: "auto" }}>Swipe to browse →</span>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", paddingBottom: 12, scrollbarWidth: "none" }}>
        <style>{`.mcard::-webkit-scrollbar { display: none; }`}</style>

        <MCard color={C.accent} title="System costing" num="01">
          Each legacy system is classified into three tiers (enterprise, departmental, or standalone) with costs scaled by bed count. Enterprise systems (e.g. legacy EHR) cost $150k to $1.5m+ base plus $650 to $7,500 per bed. Departmental systems run $80k to $350k plus $200 to $900 per bed. Standalone tools are $50k to $200k plus $120 to $620 per bed. Source: KLAS 2025 benchmarks, Becker's Hospital Review.
        </MCard>

        <MCard color={C.amber} title="Clinical capacity" num="02">
          Not all staff use all systems. We apply two evidence-based filters: 65% of staff are regular system users (HIMSS Analytics), and each user interacts with ~35% of the legacy estate. A 4% productivity penalty per system touched (Westbrook et al, JAMIA 2010) determines time wasted. Hours freed are valued at $95/hr with 30% realisation, reflecting that freed time creates capacity, not direct savings.
        </MCard>

        <MCard color={C.blue} title="CMS reimbursement" num="03">
          Three CMS penalty programmes are modelled: HRRP (up to 3% of base DRG, FY2025 data), HAC Reduction (1% for bottom quartile), and VBP (2% withhold pool). Denial recovery uses HFMA's 4.8% net revenue loss benchmark. Better documentation from system consolidation improves coding accuracy, reduces denials, and lowers penalty exposure. Evidence: Pattar et al JAMA 2025, Vest et al JAMIA 2019.
        </MCard>

        <MCard color={C.purple} title="Patient safety" num="04">
          ADE rates from AHRQ Patient Safety Indicators and HHS OIG 2022 (25% of Medicare patients experience adverse events). Preventable ADEs: 1.8 per 100 admissions (Bates et al). Excess bed day cost: $3,132/day (KFF/AHA 2023). Communication failures account for 30% of malpractice claims (CRICO 2016). These are cost avoidance figures: harm that doesn't occur, not direct budget reductions.
        </MCard>

        <MCard color="#8e44ad" title="Network savings" num="05">
          Multi-hospital IDNs typically run duplicate instances of the same legacy system across sites, approximately 30% of the estate (CHIME Digital Health Survey). Each facility carries ~$350k/yr in duplicate hosting, interfaces, and support (60% consolidatable). Cross-facility standardisation addresses 15% of operational costs through unified workflows and data governance.
        </MCard>

        <MCard color="#e67e22" title="Academic impact" num="06">
          Academic medical centres maintain additional legacy systems for research databases, GME (Graduate Medical Education) tracking, and teaching programme administration. These are costed at the same tier-based rates with an additional compliance efficiency factor from consolidated audit trails. Based on AAMC benchmarks for academic system overhead and ACGME reporting requirements.
        </MCard>

        <MCard color={C.accent} title="Year-by-year ramp" num="07">
          Savings are phased over three years: Year 1 at 40%, Year 2 at 80%, Year 3 at 100% of steady state. This reflects progressive legacy system retirement. Data is migrated and interfaces decommissioned over time, not all at once. Galen payback is calculated as migration cost ÷ (annual decom savings minus annual archive cost).
        </MCard>

        <MCard color={C.blue} title="Key sources" num="08">
          KLAS Research (Best in KLAS 2025 Data Archiving) · HIMSS Analytics (system usage patterns) · AHRQ Patient Safety Indicators · CMS Hospital Compare (HRRP, HAC, VBP data) · HFMA (denial management benchmarks) · KFF/AHA (cost per bed day) · CRICO Strategies (malpractice analysis) · Bates et al, JAMA (ADE rates) · Westbrook et al, JAMIA 2010 (system switching costs) · CHIME Digital Health Survey (duplicate systems in IDNs).
        </MCard>

      </div>
    </div>

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

function KpiCard({ label, value, sub, color, iconKey, onClick }) {
  return <div onClick={onClick} style={{ padding: "24px 22px", background: C.surface, borderRadius: 18, border: `1px solid ${color}25`, cursor: "pointer", transition: "border-color .2s" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <Icon name={iconKey} size={26} stroke={color} />
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

function CTitle({ iconKey, children, color }) {
  return <div style={{ fontSize: F.body, fontWeight: 700, color: C.textMid, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}><Icon name={iconKey} size={24} stroke={color || C.accent} /> {children}</div>;
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
function MCard({ color, title, num, children }) {
  return <div className="mcard" style={{ flex: "0 0 320px", scrollSnapAlign: "start", padding: "28px 24px", background: C.surface, borderRadius: 20, border: `1px solid ${color}25`, minHeight: 240 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 32, height: 32, borderRadius: "50%", background: color + "20", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: F.tiny, fontWeight: 800 }}>{num}</span>
      <span style={{ fontSize: F.body, fontWeight: 700, color }}>{title}</span>
    </div>
    <div style={{ fontSize: F.tiny, color: C.textMid, lineHeight: 1.7 }}>{children}</div>
  </div>;
}
