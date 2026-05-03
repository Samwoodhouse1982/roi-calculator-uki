export const emptyDt = () => ({ EPR_PAS:0,ED:0,MATERNITY:0,THEATRES:0,LAB:0,RAD_REPORTS:0,PACS_LINKS:0,DOC_ECM:0,SCANNED_NOTES:0,REFERRALS:0,COMMUNITY:0,MENTAL_HEALTH:0,OTHER:0 });
export const PRESETS = {
  SMALL: { label:"Critical Access Hospital", desc:"~50 beds · 1 facility · 6 systems", data:{ bed_count:50, org_count:1, journey:"HAVE_EPR", tiers:{enterprise:1,departmental:2,niche:3}, data_types:{...emptyDt(),EPR_PAS:1,DOC_ECM:1,SCANNED_NOTES:1,RAD_REPORTS:1}, complexity_level:"LOW", data_quality_level:"MIXED", decom_retire_rate:0.75 }},
  TYPICAL: { label:"Community Hospital", desc:"~250 beds · 1 facility · 15 systems", data:{ bed_count:250, org_count:1, journey:"EVALUATING", tiers:{enterprise:1,departmental:5,niche:9}, data_types:{...emptyDt(),EPR_PAS:1,ED:1,THEATRES:1,LAB:1,RAD_REPORTS:1,DOC_ECM:1,SCANNED_NOTES:1}, complexity_level:"TYPICAL", data_quality_level:"MIXED", decom_retire_rate:0.75 }},
  LARGE: { label:"Regional Medical Center", desc:"~600 beds · 1 facility · 25 systems", data:{ bed_count:600, org_count:1, journey:"EVALUATING", tiers:{enterprise:2,departmental:8,niche:15}, data_types:{...emptyDt(),EPR_PAS:1,ED:1,THEATRES:1,LAB:2,RAD_REPORTS:1,DOC_ECM:2,SCANNED_NOTES:1,MATERNITY:1,COMMUNITY:1}, complexity_level:"HIGH", data_quality_level:"MIXED", decom_retire_rate:0.75 }},
  IDN: { label:"IDN / Community Health System", desc:"~1000 beds · 4 hospitals · 40+ facilities · 55+ systems", data:{ bed_count:1000, org_count:4, journey:"EVALUATING", tiers:{enterprise:3,departmental:15,niche:35}, data_types:{...emptyDt(),EPR_PAS:2,ED:2,THEATRES:2,LAB:2,RAD_REPORTS:2,DOC_ECM:3,SCANNED_NOTES:2,MATERNITY:1,COMMUNITY:2,MENTAL_HEALTH:1,REFERRALS:1}, complexity_level:"TYPICAL", data_quality_level:"MIXED", decom_retire_rate:0.70 }},
  REGIONAL: { label:"Multi-Hospital System", desc:"~2500 beds · 5 facilities · 70+ systems", data:{ bed_count:2500, org_count:5, journey:"EVALUATING", tiers:{enterprise:5,departmental:22,niche:45}, data_types:{...emptyDt(),EPR_PAS:3,ED:2,THEATRES:2,LAB:3,RAD_REPORTS:2,DOC_ECM:3,SCANNED_NOTES:2,MATERNITY:2,COMMUNITY:2,MENTAL_HEALTH:1,REFERRALS:1}, complexity_level:"HIGH", data_quality_level:"POOR", decom_retire_rate:0.70 }},
};

export const PROVIDER_PRESET_MAP = {
  critical_access: "SMALL",
  community: "TYPICAL",
  regional: "LARGE",
  academic: "LARGE",
  multi_hospital: "IDN",
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

