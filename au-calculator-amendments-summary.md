# EMR Migration & Archiving ROI Calculator
## Summary of Amendments: UK → US → Australia

**Version:** 12 April 2026

This document traces the full development history of the ROI calculator, from its original UK NHS version, through the US market expansion, to the comprehensive Australian localisation. Each stage involved rebuilding the financial model, evidence base, and user experience for the target market. The Australian version is not a re-skinned US or UK tool. It has been systematically reconstructed with Australian evidence, pricing, terminology, and regulatory context.

---

# Stage 1: The UK Foundation

## What was built

The original calculator was developed for the UK NHS market, specifically targeting NHS Trusts evaluating EPR (Electronic Patient Record) migration and legacy system archiving. It modelled the financial case for decommissioning legacy clinical systems after migrating to a single enterprise EPR.

**What it calculated:** Decommission savings from retiring legacy systems (licensing, hosting, support, interfaces), clinician time freed from reduced system switching, patient safety improvements, and support ticket reduction. All outputs were presented in a board-ready PDF report with a three-scenario model (Conservative, Expected, Stretch).

**How it was structured:** A progressive 5-step input flow capturing organisation scale, legacy system inventory (tiered as enterprise, departmental, and standalone), data types in scope, and fine-tuning options. Named UK vendor systems (Cerner, TrakCare, Allscripts, DXC iPM, Telstra Health, etc.) allowed users to model specific contract values.

**Key UK-specific elements:** GBP currency, Agenda for Change (AfC) blended hourly rate (£55/hr), NHS Trust organisational structure, 2.8 staff per bed, CNST (Clinical Negligence Scheme for Trusts) litigation context, NHS Reference Cost per excess bed day, 48 working weeks.

---

# Stage 2: UK → US Market Expansion

The US expansion was a fundamental rebuild of the financial model to reflect the radically different economics of American healthcare. The US market has no single payer, no standardised pay scales, and a complex web of reimbursement penalties and claim denial mechanics that have no NHS equivalent.

## 2.1 Replacing the funding model

**What we did:** Removed the NHS single-payer funding assumptions and built a Medicare/CMS reimbursement model with five penalty and revenue programmes: Hospital Readmissions Reduction Programme (HRRP), Hospital Acquired Condition Reduction Programme (HAC), Value-Based Purchasing (VBP), claim denial recovery, and malpractice premium reduction.

**Why:** US hospitals generate revenue per admission (~US$15,200 average) and face financial penalties for quality failures. A 250-bed US hospital might lose US$1-3M/yr in CMS penalties alone. The UK NHS does not penalise Trusts for readmissions in the same way, so the entire penalty-avoidance value stream had to be built from scratch.

## 2.2 Adding provider profiling

**What we did:** Added a provider type selector with five categories (Critical Access, Community, Regional, Academic Medical Center, Multi-Hospital System), each with calibrated multipliers for Medicare percentage, denial factors, and penalty exposure. Critical Access Hospitals were correctly exempted from HRRP, HAC, and VBP penalties.

**Why:** US hospitals vary enormously. A 25-bed Critical Access Hospital in rural Montana has completely different economics from a 2,500-bed academic system in Boston. The UK model treated all Trusts as roughly comparable. The US version needed to differentiate.

## 2.3 Expanding the organisation model

**What we did:** Added non-acute facility types (ambulatory surgery centres, physician practices, skilled nursing facilities, dialysis centres, imaging centres, urgent care, home health, hospice, behavioural health, long-term acute care), a merger/acquisition builder, and per-facility-type system counting using a shared + per-site model.

**Why:** US health systems operate far more facility types than NHS Trusts. Post-M&A system consolidation (100+ deals per year in the US) is the primary use case for legacy archiving. The merger builder lets users compose their future health system and immediately see how many duplicate systems need decommissioning.

## 2.4 Rebuilding workforce and cost constants

**What we did:** Replaced all UK workforce and cost constants with US equivalents sourced from the Bureau of Labor Statistics (BLS), KLAS, Becker's Hospital Review, and CMS programme data.

**Key changes:** Staff per bed 2.8 → 3.2, blended hourly rate £55 → US$95, working weeks 48 → 50, malpractice US$8,500/bed (Mello et al, Health Affairs), excess bed day cost US$3,132 (KFF/AHA 2023), 29 US vendor systems with KLAS market share data.

## 2.5 Replacing all evidence and case studies

**What we did:** Replaced every UK evidence citation with US sources: JAMA 2025 (Pattar et al, 116 RCTs), JAMIA 2019 (Vest et al, single-vendor consolidation), HHS OIG 2022, CRICO 2016, NYU Langone (Wang et al, 33% mortality reduction), and the VA Oracle Health cautionary example (826 major incidents, 149 veterans harmed).

**Why:** US executives need to see evidence from institutions they recognise: JAMA, AHRQ, CMS, and named US health systems.

## 2.6 Adding academic and M&A modules

**What we did:** Built two conditional modules: an Academic Medical Center module (research system decommission, GME compliance efficiency, teaching overhead) and a Multi-Hospital/M&A module (duplicate system elimination, infrastructure consolidation, cross-facility standardisation).

**Why:** Academic centres run 40-200+ clinical systems including research-specific platforms. Post-M&A consolidation is a distinct value driver that community hospitals don't have. These modules only appear when the relevant provider type is selected.

## 2.7 UK backport

**What we did:** Identified universal improvements from the US build and backported them to the UK main branch: phased 3-year ramp (40/80/100%), system-level cost line items, legal disclaimer, bed day calculation reconciliation, switch penalty cap, corporate staff scaling, vendor cost scaling with bed count, and non-acute facility portfolio support.

**Why:** The UK version benefited from the engineering improvements made during the US expansion, even though the market-specific elements (CMS penalties, denial rates, provider types) did not apply.

---

# Stage 3: US → Australian Localisation

The Australian version required a third fundamental rebuild. Australia's health system shares some structural similarities with the UK (public funding, activity-based pricing) but has its own regulatory framework, funding mechanics, workforce costs, and institutional landscape.

## 3.1 Replacing the funding and revenue model

**What we did:** Removed the entire US Medicare/CMS reimbursement model (fee-for-service, value-based purchasing, Hospital Acquired Conditions penalties, Hospital Readmissions Reduction Programme, claim denials) and replaced it with Australia's Activity Based Funding (ABF) model.

**Why:** Australian public hospitals are funded through ABF using National Weighted Activity Units (NWAUs), priced at the National Efficient Price (NEP) set annually by the Independent Health and Aged Care Pricing Authority (IHACPA). The US CMS penalty logic has no equivalent in Australia. Leaving it in would have produced either zero values or misleading figures.

**Key parameters set from Australian sources:**
- NEP per NWAU: A$6,465 (IHACPA 2024-25 Determination)
- Average length of stay: 5.5 days (AIHW 2023-24, overnight separations)
- Default bed occupancy: 90% (OECD 2023; AMA position statement)
- ABF efficiency gain: modelled at 15% of legacy estate cost addressable through consolidation

## 3.2 Replacing all clinical and workforce constants

**What we did:** Replaced every clinical constant with values sourced from Australian data.

**Why:** US constants were calibrated to American staffing models (3.2 staff/bed at US$95/hr) and malpractice insurance structures. These would significantly misstate the Australian position.

**Key replacements:**
- Staff per bed: 3.0 (NSW Health SDPR Expression of Interest: 75,500 clinical staff / 25,632 beds)
- Blended hourly rate: A$65/hr (AIHW workforce data, weighted towards nursing as 62% of clinical FTE)
- Medical indemnity: A$20,000/bed (VMIA 2025-26: $380.9M pool / ~16,000 Victorian beds)
- Excess bed day cost: A$3,100/day (IHACPA long-stay outlier per diem weights)
- Adverse event rate: 5.4% of separations (AIHW administrative data)
- Duplicate test rate: 22% (Banker et al 2024; RCPA guidelines)
- Pathology cost per bed: A$12,000/yr (AIHW hospital expenditure data)
- Working weeks: 48 (Australian standard)

## 3.3 Replacing all evidence citations and case studies

**What we did:** Removed every US-specific evidence reference, case study, and source citation. Replaced with Australian peer-reviewed research, government reports, and state audit findings.

**Why:** An Australian executive presented with citations from the Joint Commission, AHRQ, NYU Langone, or the VA would immediately question whether the model is relevant to their context.

**Key replacements:**

| What was cited | US source removed | Australian source added |
|---|---|---|
| Medication error reduction | Pattar et al, JAMA 2025 | Woods et al 2024, QLD DigiMat study (1.55M episodes, 12.9% medication complication decline) |
| Mortality impact | Vest et al, JAMIA 2019 | South et al 2022, Royal Children's Hospital Melbourne (22% decrease in in-hospital mortality post-Epic) |
| Duplicate testing | Kodiak Solutions 2024 | Banker et al 2024 (South Australia); RCPA guidelines |
| Indemnity benchmark | US malpractice data | VMIA 2025-26 ($380.9M / ~16k beds) |
| Hospital-acquired infections | AHRQ/Joint Commission | QAO 2018, Princess Alexandra Hospital (37% fewer HAIs post-ieMR) |
| National savings potential | ONC estimates | Productivity Commission May 2024 (up to A$5.4bn/yr from better EMR data use) |
| Workforce data | BLS Occupational Employment | AIHW Health Workforce; NSW Health Annual Report |
| Clinician time studies | AMIA 2019, Brigham & Women's | Westbrook et al 2010 (JAMIA); Nuffield Trust 2020 |
| Privacy legislation | HIPAA | HRIP Act 2002 (NSW, private sector) |

## 3.4 Building for statewide programme scale

**What we did:** Added a "Statewide Programme" provider type as the primary option, pre-loaded with NSW-scale defaults (25,000 beds, 228 hospitals, 17 Local Health Districts).

**Why:** The most likely Australian use case is a state-level EMR consolidation programme (NSW SDPR, QLD DigiMat, SA EPAS). These involve hundreds of hospitals and thousands of community sites, fundamentally different from the single-hospital or health-system scenarios the UK and US versions were designed for.

**What this includes:**
- Six provider types: Rural/Remote, Regional, Metropolitan/Tertiary, Tertiary Referral, LHD/Health Service, and Statewide Programme
- Non-acute facility portfolio: community health, outpatient, oral health, pathology laboratories, pathology collection centres, multipurpose services, mental health, rehabilitation, and aged care
- Network consolidation module for duplicate system elimination across LHDs
- Tranche-based rollout modelling with configurable go-live dates per tranche

## 3.5 Integrating NSW SDPR programme data

**What we did:** Incorporated specific operational data from the NSW SDPR Expression of Interest (HT20037) and a detailed research mapping of the NSW legacy system estate, cross-referenced against Queensland and Victorian programme data.

**Why:** Generic assumptions would not withstand scrutiny from a NSW Health audience. By anchoring to published programme data, the outputs become credible starting points for discussion.

**Key data points integrated:**
- 24 confirmed core legacy systems (9 EMR, 10 PAS, 5 LIMS), sourced from NSW Health October 2023
- 228 hospitals and 450+ facilities, from SDPR EOI Annexure A
- 25,632 bed capacity and 75,500+ clinical EMR users, from EOI Table 6
- Enterprise system costs calibrated against QLD Health Cerner contract data
- Legacy estate cost range A$225-385M/yr, modelled from QLD proxy and NSW programme documents
- Epic replacement contract A$969M/10yr, confirmed from NSW Health announcements
- Galen clinical archive contract A$83M/10yr, confirmed from IDM Magazine December 2024

**Confidence labelling:** Every anchor figure in the methodology section is labelled as either CONFIRMED (from published sources) or ESTIMATE (modelled from proxy data).

## 3.6 Building an Australian vendor and system list

**What we did:** Replaced the US vendor list with 20+ systems in active use across Australian public health, each with cost models calibrated from state contract data.

**Why:** When a user selects named legacy systems, those systems need to be ones they recognise from their own environment.

**Systems included:** Oracle Health (Cerner Millennium), Epic, InterSystems TrakCare, Telstra Health, DXC iPM, Allscripts/Sunrise, MEDITECH Expanse, Dedalus (Orion Health), Citadel Health (BOSSnet), Alcidion Miya, Citadel Health (Auslab/vLab), Agfa ORBIS/RIS, Hyland OnBase, ISS OmniLab, i.Pharmacy, WinScribe/BigHand, RiskMan/Datix, MIMS Integrated, Karisma/ORMIS, Cerner PathNet, iMDsoft MetaVision (eRIC), Orion Health (HealtheNet/CAP), DXC MedChart, Cerner eMeds, CorePAS.

## 3.7 Applying a fragmentation attribution factor

**What we did:** Added a 35% attribution factor so that only 35% of preventable adverse event bed days are attributed to information fragmentation, rather than 100%.

**Why:** Adverse events happen for many reasons, including staffing, fatigue, training, equipment. The ACSQHC reports that approximately 35% of clinical incidents involve communication or information failure. Applying this factor reduced excess bed day savings from ~A$150M/yr to ~A$91M/yr at statewide scale. Still significant, but grounded in evidence and clearly classified as cost avoidance rather than cashable savings.

## 3.8 Internal audit and accuracy corrections

**What we did:** Ran a systematic internal audit and a complete calculation trace at NSW statewide scale, identifying and correcting financial errors, model gaps, and inflated assumptions.

**Why:** The localisation process had introduced compound errors. An honest model is more valuable than an impressive-looking one.

**Critical corrections:**
- Standardisation double-count removed (two benefit lines used identical formulas): -A$51M/yr
- Duplicate system elimination corrected to surviving systems only and costed at departmental tier rates: -A$76M/yr initially, then further refined
- Patients harmed per bed recalculated at Australian ALOS (5.8 → 3.2)
- Records request turnaround capped at 20 systems (was scaling linearly, producing 293 working days)
- BCR scoped to archive investment vs decommission savings only (was 91:1, now 10.5:1)
- Payback scoped to archive investment vs decommission savings (was 0.0yr, now 0.1yr)
- Statewide private patient rate reduced from 18% to 12% (rural hospitals have near-zero private patients)
- System counts calibrated to ~204 total (enterprise 24, departmental 80, niche 80, non-acute 20), down from ~520

**Net impact:** Combined annual benefits reduced from A$775M/yr to A$551M/yr, a 29% reduction producing a more credible and defensible output.

## 3.9 Removing all US and American references

**What we did:** Conducted multiple sweeps to identify and replace every remaining US reference, across user-facing text, methodology sections, formula displays, source citations, date formatting, and configuration.

**Why:** A single reference to "US benchmarks," "$95/hr," or "en-US" date formatting would undermine the credibility of the entire localisation.

**Examples found and corrected:** "Default costs are US benchmarks" → "modelled from Australian state contract data"; formula display showing US staff ratios and wages; "ITIL service desk reporting in US health systems"; date locale en-US → en-AU; "malpractice" → "indemnity" throughout; "EHR" → "EMR" throughout.

## 3.10 Restructuring the user experience

**What we did:** Restructured both the input flow and results page to reduce complexity for executive audiences.

**Why:** After adding statewide programme support, tranche modelling, and multiple financial metrics, the calculator had become visually heavy. An executive should get the answer in 5 seconds, then drill into detail.

**Input changes:** Non-acute facility portfolio collapsed behind an optional toggle; facility system counts integrated inline with tier sliders showing combined totals; merger question hidden for statewide (redundant); reimbursement defaults to "Public (ABF-funded)"; migration/archive costs left blank for optional entry.

**Results changes:** Level 1 shows 4 KPI cards and a proportion bar without scrolling. Level 2 provides collapsible sections (executive detail, archiving investment, tranche timeline, evidence benchmarks, detailed breakdown), all closed by default. Every piece of content preserved, just reorganised behind progressive disclosure.

## 3.11 Expanding all acronyms

**What we did:** Ensured every acronym is spelled out on first user-facing occurrence, covering 22 acronyms in total including EMR, ABF, NPV, BCR, FTE, LHD, NWAU, SDPR, ACSQHC, AIHW, IHACPA, VMIA, and others.

**Why:** An executive unfamiliar with health informatics terminology should not have to guess what NWAU or IHACPA means. First-use expansion is standard practice in government business cases.

---

## Current calculator output (NSW SDPR, expected scenario)

At statewide scale with default inputs:

| Category | Annual | % of total |
|---|---|---|
| **Cashable** | A$246M/yr | 45% |
| Decommission savings | A$158M | |
| ABF efficiency gain | A$36M | |
| Private patient revenue uplift | A$34M | |
| Network consolidation | A$18M | |
| **Capacity** | A$178M/yr | 32% |
| Clinician time freed | A$178M (4,993 FTE equivalent) | |
| **Cost avoidance** | A$128M/yr | 23% |
| Excess bed days avoided | A$91M | |
| Duplicate testing reduction | A$33M | |
| Medical indemnity reduction | A$4M | |
| **Combined** | **A$551M/yr** | |

With archiving costs entered (A$15M migration): Archive BCR 10.5:1, archive payback ~5 weeks, NPV (7% discount, 5-year) A$1.26B.

All figures are user-overridable. The calculator is a starting point for structured conversation, not a definitive answer.
