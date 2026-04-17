export const emptyDt = () => ({ EPR_PAS:0,ED:0,MATERNITY:0,THEATRES:0,LAB:0,RAD_REPORTS:0,PACS_LINKS:0,DOC_ECM:0,SCANNED_NOTES:0,REFERRALS:0,COMMUNITY:0,MENTAL_HEALTH:0,OTHER:0 });
export const PRESETS = {
  SMALL: { label:"Critical Access Hospital", desc:"~50 beds · 1 facility · 6 systems", data:{ bed_count:50, org_count:1, journey:"HAVE_EPR", tiers:{enterprise:1,departmental:2,niche:3}, data_types:{...emptyDt(),EPR_PAS:1,DOC_ECM:1,SCANNED_NOTES:1,RAD_REPORTS:1}, complexity_level:"LOW", data_quality_level:"MIXED", decom_retire_rate:0.75 }},
  TYPICAL: { label:"Community Hospital", desc:"~250 beds · 1 facility · 15 systems", data:{ bed_count:250, org_count:1, journey:"EVALUATING", tiers:{enterprise:1,departmental:5,niche:9}, data_types:{...emptyDt(),EPR_PAS:1,ED:1,THEATRES:1,LAB:1,RAD_REPORTS:1,DOC_ECM:1,SCANNED_NOTES:1}, complexity_level:"TYPICAL", data_quality_level:"MIXED", decom_retire_rate:0.75 }},
  LARGE: { label:"Regional Medical Center", desc:"~600 beds · 1 facility · 25 systems", data:{ bed_count:600, org_count:1, journey:"EVALUATING", tiers:{enterprise:2,departmental:8,niche:15}, data_types:{...emptyDt(),EPR_PAS:1,ED:1,THEATRES:1,LAB:2,RAD_REPORTS:1,DOC_ECM:2,SCANNED_NOTES:1,MATERNITY:1,COMMUNITY:1}, complexity_level:"HIGH", data_quality_level:"MIXED", decom_retire_rate:0.75 }},
  REGIONAL: { label:"Multi-Hospital System", desc:"~2500 beds · 5 facilities · 70+ systems", data:{ bed_count:2500, org_count:5, journey:"EVALUATING", tiers:{enterprise:5,departmental:22,niche:45}, data_types:{...emptyDt(),EPR_PAS:3,ED:2,THEATRES:2,LAB:3,RAD_REPORTS:2,DOC_ECM:3,SCANNED_NOTES:2,MATERNITY:2,COMMUNITY:2,MENTAL_HEALTH:1,REFERRALS:1}, complexity_level:"HIGH", data_quality_level:"POOR", decom_retire_rate:0.70 }},
};

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
// CMS Penalty Programmes (verified from CMS programme pages, FY2025/2026)
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
export const CROSS_FACILITY_STANDARDISATION_PCT = 0.15; // 15% of operational costs addressable through standardisation

// Provider type multipliers (modelled assumptions, clearly labelled)

export const PROVIDER_PRESET_MAP = {
  critical_access: "SMALL",
  community: "TYPICAL",
  regional: "LARGE",
  academic: "LARGE",
  multi_hospital: "REGIONAL",
};
export const PROVIDER_MULTIPLIERS = {
  critical_access:  { medicare_pct: 0.60, denial_factor: 0.7, penalty_exposure: 0.0, complexity_boost: 0.8 },  // CAHs exempt from HRRP, HAC, VBP
  community:        { medicare_pct: 0.45, denial_factor: 1.0, penalty_exposure: 0.7, complexity_boost: 1.0 },
  regional:         { medicare_pct: 0.40, denial_factor: 1.1, penalty_exposure: 1.0, complexity_boost: 1.2 },
  academic:         { medicare_pct: 0.35, denial_factor: 1.3, penalty_exposure: 1.2, complexity_boost: 1.5 },
  multi_hospital:   { medicare_pct: 0.42, denial_factor: 1.2, penalty_exposure: 1.0, complexity_boost: 1.3 },
};

// Reimbursement model multipliers
export const REIMBURSE_MULTIPLIERS = {
  ffs:   { denial_weight: 1.2, penalty_weight: 0.5, quality_bonus: 0.0 },
  vbc:   { denial_weight: 0.8, penalty_weight: 1.5, quality_bonus: 1.0 },
  mixed: { denial_weight: 1.0, penalty_weight: 1.0, quality_bonus: 0.5 },
};

