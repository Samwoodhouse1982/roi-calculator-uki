// ── Model constants ──
export const STAFF_PER_BED = 3.2;
export const CORPORATE_STAFF_BASE = 20;       // Base admin/corporate staff per facility
export const CORPORATE_STAFF_PER_BED = 0.15;  // Scales with size, caps at ~120 for large facilities
export const BLENDED_HOURLY_RATE = 95;
export const WORKING_WEEKS = 50;
export const TICKETS_PER_SYSTEM = 2.5;
export const SWITCH_PENALTY_PER_SYSTEM = 0.04;
export const SURVIVING_SYSTEM_TICKET_FACTOR = 0.6;
export const SAR_BASE_DAYS = 1.5;
export const SAR_DAYS_PER_SYSTEM_BEFORE = 0.4;
export const SAR_DAYS_PER_SYSTEM_AFTER = 0.15;
export const MED_ERRORS_PER_BED = 15;  // AHRQ PSI data; IOM estimates 6.5 medication errors per 100 admissions
export const PATIENTS_HARMED_PER_BED = 0.28;  // HHS OIG 2022: 25% of Medicare patients experience adverse events
export const EXCESS_BED_DAYS_PER_BED = 0.32;  // Bates/Classen: 1.74-3.15 excess days per ADE; Zhan & Miller JAMA 2003


// ── US Reimbursement & Compliance Constants ──
// CMS Penalty Programs (verified from CMS program pages, FY2025/2026)
export const CMS_HRRP_MAX_PENALTY = 0.03;          // 3% max HRRP penalty (Section 1886(q) SSA)
export const CMS_HRRP_AVG_PENALTY = 0.0033;        // 0.33% average penalty (Advisory Board FY2025)
export const CMS_HAC_PENALTY = 0.01;               // 1% HAC Reduction Program (bottom quartile)
export const CMS_VBP_WITHHOLD = 0.02;              // 2% VBP withholding (budget neutral, AHA)
export const CMS_VBP_REDISTRIBUTION = 1700000000;  // $1.7bn redistributed FY2026

// Revenue Cycle / Denial Benchmarks (HFMA, MDaudit, Kodiak Solutions 2024-2025)
export const DENIAL_RATE_BASELINE = 0.118;          // 11.8% initial denial rate (Kodiak 2024)
export const DENIAL_NET_REVENUE_LOSS = 0.048;       // 4.8% net revenue lost to denials (HFMA Pulse Survey)
export const DENIAL_AVG_INPATIENT = 10000;          // $10,000 avg denied inpatient claim (MDaudit 2024)
export const DENIAL_RECOVERY_PER_BN = 10000000;     // $10m recoverable per $1bn revenue (Advisory Board 2024)

// Malpractice (Mello et al 2010, Health Affairs; AMA MLM 2024)
export const MALPRACTICE_SYSTEM_COST = 55600000000; // $55.6bn total system cost (2008 dollars)
export const MALPRACTICE_AVG_PREMIUM_PER_BED = 8500; // ~$10,870 premium-only per bed (Mello 2010 adjusted); conservative at $8,500

// Readmission benchmarks (AHRQ HCUP 2023; Vest et al JAMIA 2019; Pattar et al JAMA 2025)
export const READMISSION_RATE_NATIONAL = 0.139;     // 13.9% 30-day all-cause (AHRQ HCUP 2023)
export const READMISSION_RATE_MEDICARE = 0.170;     // 17.0% Medicare 30-day rate
export const READMIT_REDUCTION_EHR = 0.008;         // 0.8pp absolute reduction, single-vendor EHR (Vest JAMIA 2019)
export const READMIT_REDUCTION_META = 0.17;         // 17% relative reduction, EHR interventions (Pattar JAMA 2025, 116 RCTs)

// Excess bed day costs (KFF/AHA 2023; Bates et al; Zhan & Miller JAMA 2003)
export const COST_PER_EXCESS_BED_DAY = 3132;
export const US_AVG_ALOS = 4.7;                      // Average length of stay, days (AHA 2023)
export const US_AVG_REVENUE_PER_ADMISSION = 15200;    // Average inpatient revenue per admission (AHA/HCUP 2023)
export const DEFAULT_OCCUPANCY = 0.65;                // 65% national average (AHA 2023)        // $3,132 national average (KFF/AHA 2023)
export const EXCESS_DAYS_PER_ADE = 2.2;             // 1.74-3.15 range, midpoint (Bates/Classen/Hug)
export const PREVENTABLE_ADE_PER_100_ADMITS = 1.8;  // Bates et al ADE Prevention Study

// Duplicate testing (ONC; PMC studies; Walker Health Affairs 2005)
export const DUPLICATE_TEST_RATE = 0.25;            // 20-30% of lab tests are duplicates (ONC/expert consensus)
export const DUPLICATE_IMAGING_RATE = 0.28;         // 28.2% of transferred patients get duplicate imaging (PMC)
export const DUPLICATE_TESTING_NATIONAL_COST = 43000000000; // $43bn/yr (RAND/ONC estimates)

// Communication failures (CRICO 2016; Joint Commission; Ponemon 2014)
export const COMM_FAILURE_PCT_CLAIMS = 0.30;        // 30% of malpractice claims involve communication failure (CRICO)
export const COMM_FAILURE_COST_5YR = 1700000000;    // $1.7bn over 5 years (CRICO, 23,658 claims)
export const COMM_WASTE_PER_HOSPITAL = 1375000;     // $1-1.75m/yr avg (Ponemon Institute)


// ── Academic Medical Center Constants ──
export const RESEARCH_SYSTEMS_PER_100_BEDS = 3.5;     // IRB, CTMS, biobank, research repos, registry systems
export const RESEARCH_SYSTEM_AVG_COST = 180000;        // Avg annual cost of a research/academic system
export const GME_COMPLIANCE_COST_PER_BED = 850;        // ACGME reporting, residency tracking, procedure logging
export const TEACHING_OVERHEAD_PCT = 0.12;             // 12% additional system complexity for teaching workflows

// ── M&A / Multi-Hospital Constants ──
export const DUPLICATE_SYSTEM_RATE = 0.35;             // 35% of systems are duplicated across facilities post-M&A
export const DUPLICATE_INFRA_COST_PER_FACILITY = 250000; // Per-facility duplicate infrastructure (data center, network, help desk)
export const CROSS_FACILITY_STANDARDISATION_PCT = 0.15; // 15% of operational costs addressable through standardization

// ROI Calculator Engine
export const SCENARIO = {
  CONSERVATIVE: { decom_pct: 0.85, realization: 0.20, safety: 0.15 },
  EXPECTED:     { decom_pct: 1.00, realization: 0.30, safety: 0.25 },
  STRETCH:      { decom_pct: 1.10, realization: 0.40, safety: 0.35 },
};
export const CX = { LOW: 0.7, TYPICAL: 1.0, HIGH: 1.45 };
export const DQ = { CLEAN: 0.75, MIXED: 1.0, POOR: 1.4 };

export function tierCost(tier, beds, cx) {
  const base = tier === "enterprise" ? 300000 : tier === "departmental" ? 75000 : 14000;
  const perBed = tier === "enterprise" ? 700 : tier === "departmental" ? 160 : 20;
  return Math.round(((base + beds * perBed) * cx) / 1000) * 1000;
}
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function calc(inp, mode, ov = {}, flagships = []) {
  const sc = SCENARIO[mode], cx = CX[inp.complexity_level], dq = DQ[inp.data_quality_level];
  const isArchiveOnly = inp.journey === "HAVE_EPR";
  const ent = ov.enterprise != null ? ov.enterprise : inp.tiers.enterprise;
  const dep = ov.departmental != null ? ov.departmental : inp.tiers.departmental;
  const nic = ov.niche != null ? ov.niche : inp.tiers.niche;
  const tieredLegacy = ent + dep + nic;
  const entCost = ov.entCost != null ? ov.entCost : tierCost("enterprise", inp.bed_count, cx);
  const depCost = ov.depCost != null ? ov.depCost : tierCost("departmental", inp.bed_count, cx);
  const nicCost = ov.nicCost != null ? ov.nicCost : tierCost("niche", inp.bed_count, cx);
  const tieredEstate = ent * entCost + dep * depCost + nic * nicCost;
  // Flagships
  const flagshipTotal = flagships.reduce((s,f) => s + (f.cost || 0), 0);
  const flagshipDecomSave = flagships.filter(f => f.retire).reduce((s,f) => s + (f.cost || 0), 0);
  const flagshipCount = flagships.length;
  const flagshipRetireCount = flagships.filter(f => f.retire).length;
  const portfolioSystems = inp._portfolioSystems || 0;
  const legacy = tieredLegacy + flagshipCount + portfolioSystems;
  const totalEstate = tieredEstate + flagshipTotal + (inp._portfolioCost || 0);
  const blendedCost = legacy > 0 ? Math.round(totalEstate / legacy) : 0;
  const rawDecom = tieredLegacy * inp.decom_retire_rate * sc.decom_pct;
  const decom = Math.min(Math.round(rawDecom), tieredLegacy) + flagshipRetireCount;
  const decomFrac = tieredLegacy > 0 ? Math.min(Math.round(rawDecom), tieredLegacy) / tieredLegacy : 0;
  const entDecom = Math.min(Math.round(ent * decomFrac), ent);
  const depDecom = Math.min(Math.round(dep * decomFrac), dep);
  const nicDecom = clamp(Math.min(Math.round(rawDecom), tieredLegacy) - entDecom - depDecom, 0, nic);
  const decomSave = entDecom * entCost + depDecom * depCost + nicDecom * nicCost + Math.round(flagshipDecomSave * sc.decom_pct);
  const corpPerOrg = Math.min(120, Math.round(CORPORATE_STAFF_BASE + (inp.bed_count / Math.max(1, inp.org_count)) * CORPORATE_STAFF_PER_BED));
  const clinicians = ov.clinicians != null ? ov.clinicians : Math.round(inp.bed_count * STAFF_PER_BED + inp.org_count * corpPerOrg + (inp._portfolioStaff || 0));
  const switchPenalty = Math.max(0, legacy - 1) * SWITCH_PENALTY_PER_SYSTEM;
  const baseMin = isArchiveOnly ? 5 : 12;
  const cappedPenalty = Math.min(switchPenalty, 4.0); // Cap: prevents >60 min/wk at extreme system counts
  const minsWasted = ov.minsWasted != null ? ov.minsWasted : Math.round(baseMin * dq * cx * (1 + cappedPenalty));
  const residual = isArchiveOnly ? 1 : 2;
  const hrsSaved = Math.round((clinicians * Math.max(0, minsWasted - residual) * WORKING_WEEKS) / 60);
  const timeSave = Math.round(hrsSaved * BLENDED_HOURLY_RATE * sc.realization);
  const ticketsBaselineMonthly = ov.ticketsBaseline != null ? ov.ticketsBaseline : Math.round(legacy * TICKETS_PER_SYSTEM * dq);
  const ticketsAfter = Math.min(Math.round((legacy - decom) * TICKETS_PER_SYSTEM * dq * SURVIVING_SYSTEM_TICKET_FACTOR), ticketsBaselineMonthly);
  const ticketsReductionPct = Math.round((ticketsBaselineMonthly - ticketsAfter) / Math.max(1, ticketsBaselineMonthly) * 100);
  const sarDaysBefore = ov.sarDaysBefore != null ? ov.sarDaysBefore : Math.round((SAR_BASE_DAYS + legacy * SAR_DAYS_PER_SYSTEM_BEFORE * dq) * 10) / 10;
  const sarDaysAfter = Math.min(Math.round((SAR_BASE_DAYS + (legacy - decom) * SAR_DAYS_PER_SYSTEM_AFTER) * 10) / 10, sarDaysBefore);
  const sarReductionPct = Math.round((sarDaysBefore - sarDaysAfter) / Math.max(1, sarDaysBefore) * 100);
  const hasClinicalScope = legacy >= 3 && inp.bed_count > 0;
  let safetyMedErrorsAvoided=0, safetyPatientsProtected=0, safetyBedDaysAvoided=0, safetyMedErrorsBaseline=0;
  if (hasClinicalScope) {
    const frag = 0.6 + Math.min(legacy, 20) / 20 * 0.6;
    safetyMedErrorsBaseline = Math.round(inp.bed_count * MED_ERRORS_PER_BED * frag * dq);
    const harmedBl = Math.round(inp.bed_count * PATIENTS_HARMED_PER_BED * frag * dq);
    const bedDaysBl = Math.round(inp.bed_count * EXCESS_BED_DAYS_PER_BED * frag * dq);
    safetyMedErrorsAvoided = Math.round(safetyMedErrorsBaseline * sc.safety);
    safetyPatientsProtected = Math.round(harmedBl * sc.safety);
    safetyBedDaysAvoided = Math.round(bedDaysBl * sc.safety);
  }
  // ── Reimbursement & Compliance Impact ──
  // Admissions and revenue (evidence-based derivation)
  const occupancy = inp._occupancy || DEFAULT_OCCUPANCY;
  const admissionsPerYear = Math.round(inp.bed_count * (365 / US_AVG_ALOS) * occupancy);
  const estAnnualRevenueCalc = admissionsPerYear * US_AVG_REVENUE_PER_ADMISSION;
  // Medicare DRG revenue estimate (if not provided by user)
  const estMedicareDrgRevenue = Math.round(estAnnualRevenueCalc * (inp._medicarePct || 0.42));
  const medicareDrg = inp._medicareDrgRevenue > 0 ? inp._medicareDrgRevenue : estMedicareDrgRevenue;

  // HRRP penalty exposure
  const hrrpExposure = medicareDrg * CMS_HRRP_AVG_PENALTY;
  const hrrpReduction = Math.round(hrrpExposure * sc.safety * (inp._penaltyWeight || 1.0));

  // HAC penalty exposure (bottom quartile = 1% of all Medicare payments)
  const hacExposure = medicareDrg * CMS_HAC_PENALTY * 0.25; // 25% probability of being in bottom quartile
  const hacReduction = Math.round(hacExposure * sc.safety * (inp._penaltyWeight || 1.0));

  // VBP improvement potential
  const vbpPool = medicareDrg * CMS_VBP_WITHHOLD;
  const vbpImprovement = Math.round(vbpPool * 0.15 * sc.safety * (inp._qualityBonus || 0.5));

  // Denial rate reduction (FFS pathway)
  const estAnnualRevenue = estAnnualRevenueCalc; // from admissions-based model above
  const denialBaseline = estAnnualRevenue * DENIAL_NET_REVENUE_LOSS;
  const denialRecovery = Math.round(denialBaseline * 0.20 * sc.decom_pct * (inp._denialWeight || 1.0));

  // Malpractice premium reduction (modeled assumption)
  const malpracticePremium = inp.bed_count * MALPRACTICE_AVG_PREMIUM_PER_BED;
  const malpracticeReduction = Math.round(malpracticePremium * 0.05 * sc.safety); // 5% reduction — conservative (CRICO: 30% of claims involve comms failure)

  // Excess bed days avoided (unified with safety section)
  const preventableADEs = Math.round(admissionsPerYear / 100 * PREVENTABLE_ADE_PER_100_ADMITS);
  // Use safety section's bed day estimate when available for consistency
  const excessDaysAvoided = hasClinicalScope ? safetyBedDaysAvoided : Math.round(preventableADEs * EXCESS_DAYS_PER_ADE * sc.safety);
  const excessDayCostAvoided = Math.round(excessDaysAvoided * COST_PER_EXCESS_BED_DAY);

  // Duplicate testing reduction
  const estLabSpend = inp.bed_count * 8500; // ~$8,500 per bed in lab/imaging spend
  const duplicateWaste = estLabSpend * DUPLICATE_TEST_RATE;
  const duplicateReduction = Math.round(duplicateWaste * 0.50 * sc.decom_pct); // 50% of duplicates addressable

  // ── Academic Medical Center Module ──
  const isAcademic = inp._providerType === "academic";
  const researchSystems = isAcademic ? Math.round(inp.bed_count / 100 * RESEARCH_SYSTEMS_PER_100_BEDS) : 0;
  const researchSystemCost = researchSystems * RESEARCH_SYSTEM_AVG_COST;
  const researchDecomSave = Math.round(researchSystemCost * 0.60 * sc.decom_pct); // 60% retirable
  const gmeComplianceCost = isAcademic ? Math.round(inp.bed_count * GME_COMPLIANCE_COST_PER_BED) : 0;
  const gmeEfficiency = Math.round(gmeComplianceCost * 0.25 * sc.decom_pct); // 25% efficiency gain
  const teachingOverhead = isAcademic ? Math.round(totalEstate * TEACHING_OVERHEAD_PCT * 0.30 * sc.decom_pct) : 0; // 30% of 12% extra complexity

  // ── M&A / Multi-Hospital Module ──
  const isMultiHospital = inp._providerType === "multi_hospital";
  const duplicateSystems = isMultiHospital ? Math.round(legacy * DUPLICATE_SYSTEM_RATE) : 0;
  const duplicateSystemCost = isMultiHospital ? Math.round(duplicateSystems * blendedCost) : 0;
  const duplicateElimination = Math.round(duplicateSystemCost * sc.decom_pct);
  const duplicateInfraCost = isMultiHospital ? inp.org_count * DUPLICATE_INFRA_COST_PER_FACILITY : 0;
  const infraConsolidation = Math.round(duplicateInfraCost * 0.60 * sc.decom_pct); // 60% consolidatable
  const standardizationSave = isMultiHospital ? Math.round(totalEstate * CROSS_FACILITY_STANDARDISATION_PCT * sc.decom_pct) : 0;

  // Module totals
  const academicSavings = researchDecomSave + gmeEfficiency + teachingOverhead;
  const mergeSavings = duplicateElimination + infraConsolidation + standardizationSave;

  // Total reimbursement impact
  const reimbursementImpact = hrrpReduction + hacReduction + vbpImprovement + denialRecovery;
  const qualitySavings = malpracticeReduction + excessDayCostAvoided + duplicateReduction;

  const annual = decomSave + timeSave;
  const annualWithReimbursement = annual + reimbursementImpact + qualitySavings + academicSavings + mergeSavings;
  // Phased ramp: Year 1 = 40%, Year 2 = 80%, Year 3 = 100% of steady-state
  const y1Pct = 0.40, y2Pct = 0.80, y3Pct = 1.00;
  const yr1 = Math.round(annual * y1Pct);
  const yr2 = Math.round(annual * y2Pct);
  const yr3 = Math.round(annual * y3Pct);
  const total3 = yr1 + yr2 + yr3;
  const yr1R = Math.round(annualWithReimbursement * y1Pct);
  const yr2R = Math.round(annualWithReimbursement * y2Pct);
  const yr3R = Math.round(annualWithReimbursement * y3Pct);
  const total3WithReimbursement = yr1R + yr2R + yr3R;
  return {
    legacy, ent, dep, nic, entCost, depCost, nicCost, blendedCost, totalEstate,
    decom, entDecom, depDecom, nicDecom, decomSave,
    clinicians, minsWasted, hrsSaved, timeSave, baseMin,
    ticketsBaselineMonthly, ticketsAfter, ticketsReductionPct,
    sarDaysBefore, sarDaysAfter, sarReductionPct,
    hasClinicalScope, safetyMedErrorsAvoided, safetyPatientsProtected,
    safetyBedDaysAvoided, safetyMedErrorsBaseline,
    annual, total3, yr1, yr2, yr3, y1Pct, y2Pct, y3Pct, realization: sc.realization, isArchiveOnly,
    flagshipTotal, flagshipDecomSave: Math.round(flagshipDecomSave * sc.decom_pct),
    flagshipCount, flagshipRetireCount,
    // Reimbursement & compliance
    admissionsPerYear, estAnnualRevenueCalc, occupancy, medicareDrg, hrrpExposure, hrrpReduction, hacExposure, hacReduction,
    vbpPool, vbpImprovement, denialBaseline, denialRecovery,
    malpracticePremium, malpracticeReduction,
    preventableADEs, excessDaysAvoided, excessDayCostAvoided,
    duplicateWaste, duplicateReduction,
    reimbursementImpact, qualitySavings,
    // Academic module
    isAcademic, researchSystems, researchSystemCost, researchDecomSave,
    gmeComplianceCost, gmeEfficiency, teachingOverhead, academicSavings,
    // M&A module
    isMultiHospital, duplicateSystems, duplicateSystemCost, duplicateElimination,
    duplicateInfraCost, infraConsolidation, standardizationSave, mergeSavings,
    annualWithReimbursement, total3WithReimbursement, yr1R, yr2R, yr3R,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   PRESETS
   ═══════════════════════════════════════════════════════════════════════ */
