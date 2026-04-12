# EMR Migration & Archiving ROI Calculator
## Australian Localisation — Summary of Amendments

**Version:** 12 April 2026

This document summarises the work undertaken to adapt and validate the ROI calculator for Australian health system audiences. The original calculator was built for the UK NHS and subsequently expanded for the US market. The Australian version has been rebuilt from the ground up with Australian evidence, pricing, terminology, and regulatory context — while retaining the proven calculation methodology.

---

## 1. Replacing the funding and revenue model

**What we did:** Removed the entire US Medicare/CMS reimbursement model (fee-for-service, value-based purchasing, Hospital Acquired Conditions penalties, Hospital Readmissions Reduction Programme) and replaced it with Australia's Activity Based Funding (ABF) model.

**Why:** Australian public hospitals are funded through ABF using National Weighted Activity Units (NWAUs), priced at the National Efficient Price (NEP) set annually by the Independent Health and Aged Care Pricing Authority (IHACPA). The US CMS penalty logic — which models revenue lost through readmission penalties, HAC reductions, and denial rates — has no equivalent in Australia. Leaving it in would have produced either zero values (confusing) or misleading figures.

**Key parameters set from Australian sources:**
- NEP per NWAU: A$6,465 (IHACPA 2024-25 Determination)
- Average length of stay: 5.5 days (AIHW 2023-24, overnight separations)
- Default bed occupancy: 90% (OECD 2023; AMA position statement)
- ABF efficiency gain: modelled at 15% of legacy estate cost addressable through consolidation, rather than through CMS penalty avoidance

---

## 2. Replacing all clinical and workforce constants

**What we did:** Replaced every clinical constant (staffing ratios, hourly rates, adverse event rates, pathology costs, indemnity premiums) with values sourced from Australian data.

**Why:** US constants were calibrated to American staffing models (3.2 staff/bed at US$95/hr from the Bureau of Labor Statistics), malpractice insurance structures, and hospital cost profiles. These would significantly misstate the Australian position — Australian hospitals have different staffing ratios, wage structures, and indemnity arrangements.

**Key replacements:**
- Staff per bed: 3.0 (NSW Health SDPR Expression of Interest: 75,500 clinical staff / 25,632 beds)
- Blended hourly rate: A$65/hr (AIHW workforce data: nursing ~A$45-55, medical ~A$90-120, allied health ~A$40-60, weighted towards nursing as 62% of clinical FTE)
- Medical indemnity: A$20,000/bed (VMIA 2025-26: $380.9M pool / ~16,000 Victorian beds)
- Excess bed day cost: A$3,100/day (IHACPA long-stay outlier per diem weights)
- Adverse event rate: 5.4% of separations (AIHW administrative data)
- Duplicate test rate: 22% (Banker et al 2024; RCPA guidelines)
- Pathology cost per bed: A$12,000/yr (AIHW hospital expenditure data)
- Working weeks: 48 (Australian standard, replacing US 50-week assumption)

---

## 3. Replacing all evidence citations and case studies

**What we did:** Removed every US-specific evidence reference, case study, and source citation. Replaced with Australian peer-reviewed research, government reports, and state audit findings.

**Why:** An Australian executive presented with citations from the Joint Commission, AHRQ, NYU Langone, or the VA would immediately question whether the model is relevant to their context. Every evidence anchor needs to come from recognisable Australian institutions.

**Key replacements:**

| What was cited | US source removed | Australian source added |
|---|---|---|
| Medication error reduction | Pattar et al, JAMA 2025 | Woods et al 2024, QLD DigiMat study (1.55M episodes, 12.9% medication complication decline) |
| Mortality impact | Vest et al, JAMIA 2019 | South et al 2022, Royal Children's Hospital Melbourne (22% decrease in in-hospital mortality post-Epic) |
| Duplicate testing | Kodiak Solutions 2024 | Banker et al 2024 (South Australia); RCPA guidelines |
| Indemnity benchmark | US malpractice data | VMIA 2025-26 ($380.9M / ~16k beds) |
| Hospital-acquired infections | AHRQ/Joint Commission | QAO 2018, Princess Alexandra Hospital (37% fewer HAIs post-ieMR) |
| National savings potential | ONC estimates | Productivity Commission May 2024 (up to A$5.4bn/yr from better EMR data use) |
| Safety framework | AHRQ, Joint Commission | ACSQHC (Australian Commission on Safety and Quality in Health Care), AIHW |
| Workforce data | BLS Occupational Employment | AIHW Health Workforce; NSW Health Annual Report |
| Clinician time studies | AMIA 2019, Brigham & Women's | Westbrook et al 2010 (JAMIA); Nuffield Trust 2020 |
| Privacy legislation | HIPAA | HRIP Act 2002 (NSW, private sector); clarified that public sector has no prescribed statutory maximum |

---

## 4. Building for statewide programme scale

**What we did:** Added a "Statewide Programme" provider type as the primary option, pre-loaded with NSW-scale defaults (25,000 beds, 228 hospitals, 17 Local Health Districts). This sits alongside options for individual hospitals, LHDs, and regional health services.

**Why:** The most likely Australian use case is a state-level EMR consolidation programme (NSW SDPR, QLD DigiMat, SA EPAS). These are fundamentally different from the single-hospital or health-system scenarios the UK and US versions were designed for. A statewide programme involves hundreds of hospitals, thousands of community sites, and a legacy estate spanning dozens of vendors — the calculator needed to handle this scale without breaking.

**What this includes:**
- Six provider types ranging from Rural/Remote (30 beds) to Statewide Programme (25,000 beds), each with calibrated multipliers for ABF weighting, private patient rates, and complexity
- Non-acute facility portfolio: community health centres, outpatient clinics, oral health, pathology laboratories, pathology collection centres, multipurpose services, mental health inpatient, community mental health, rehabilitation, and aged care — all configurable with statewide defaults
- Network consolidation module: calculates duplicate system elimination and infrastructure consolidation savings across LHDs
- Tranche-based rollout modelling: 1-5 tranches with configurable bed percentages and go-live years, defaulting to a three-tranche NSW SDPR rollout structure

---

## 5. Integrating NSW SDPR programme data

**What we did:** Incorporated specific operational data from the NSW SDPR Expression of Interest (HT20037) and a detailed research mapping of the NSW legacy system estate, then cross-referenced against Queensland and Victorian programme data.

**Why:** Generic assumptions about system counts and costs would not withstand scrutiny from a NSW Health audience that knows its own numbers. By anchoring the model to published NSW programme data and validating against interstate comparators, the outputs become credible starting points for discussion rather than abstract estimates.

**Key data points integrated:**
- 24 confirmed core legacy systems across NSW (9 EMR instances, 10 PAS, 5 LIMS) — sourced from NSW Health October 2023 briefing
- 228 hospitals and 450+ facilities — from SDPR EOI Annexure A
- 25,632 bed capacity and 75,500+ clinical EMR users — from EOI Table 6
- Enterprise system costs calibrated against QLD Health Cerner contract data (~A$14M per LHD instance)
- Legacy estate cost range A$225-385M/yr — modelled from QLD proxy data and NSW programme documents
- Epic replacement contract A$969M/10yr — confirmed from NSW Health announcements
- Galen clinical archive contract A$83M/10yr — confirmed from IDM Magazine December 2024

**Confidence labelling:** Every anchor figure in the methodology section is labelled as either CONFIRMED (from published sources) or ESTIMATE (modelled from proxy data), so users know exactly what is evidence-based and what is derived.

---

## 6. Building an Australian vendor and system list

**What we did:** Replaced the US vendor list (Epic, Cerner, Allscripts, MEDITECH, athenahealth, eClinicalWorks etc.) with 20+ systems known to be in active use across Australian public health.

**Why:** When a user selects named legacy systems in the calculator, those systems need to be ones they actually recognise from their own environment. Showing US-specific vendors like athenahealth or eClinicalWorks would undermine credibility.

**Systems included:** Oracle Health (Cerner Millennium), Epic, InterSystems TrakCare, Telstra Health, DXC iPM, Allscripts/Sunrise, MEDITECH Expanse, Dedalus (Orion Health), Citadel Health (BOSSnet), Alcidion Miya, Citadel Health (Auslab/vLab), Agfa ORBIS/RIS, Hyland OnBase, ISS OmniLab, i.Pharmacy, WinScribe/BigHand, RiskMan/Datix, MIMS Integrated, Karisma/ORMIS, Cerner PathNet, iMDsoft MetaVision (eRIC), Orion Health (HealtheNet/CAP), DXC MedChart, Cerner eMeds, CorePAS.

Each system has a base cost and per-bed scaling factor calibrated from Queensland and NSW state contract data.

---

## 7. Applying a fragmentation attribution factor

**What we did:** Added a 35% attribution factor to the patient safety calculations. Previously the model attributed 100% of preventable adverse event bed days to EMR fragmentation. Now only 35% is attributed.

**Why:** Adverse events happen for many reasons — staffing levels, fatigue, training gaps, equipment failures. Claiming that all preventable harm is caused by fragmented IT systems is indefensible. The ACSQHC reports that approximately 35% of clinical incidents involve communication or information failure, and fragmented clinical IT is a subset of that. Applying this factor reduced the excess bed day savings from ~A$150M/yr to ~A$91M/yr at statewide scale — still significant, but now grounded in evidence and clearly classified as "cost avoidance" rather than cashable savings.

---

## 8. Internal audit and accuracy corrections

**What we did:** Ran a systematic internal audit of all calculations, identified three critical financial issues and several model gaps, and corrected them.

**Why:** The localisation process had introduced compound errors where US formulas were partially replaced but residual logic inflated certain benefit lines. An honest model is more valuable than an impressive-looking one.

**Critical corrections:**

- **Standardisation double-count removed (impact: -A$51M/yr).** Two benefit lines — "cross-facility standardisation" and "ABF efficiency gain" — used identical formulas (both calculated as 15% of total estate). One was removed.

- **Duplicate system elimination corrected (impact: -A$76M/yr).** The model was applying a 35% duplicate rate to all 520 legacy systems, producing 182 duplicates. It should apply only to surviving systems after decommission (520 - 338 = 182 surviving × 35% = 64 duplicates). Later refined further: duplicates costed at departmental tier rates (A$500k) rather than blended average (A$1.17M), since the systems being consolidated across LHDs are departmental tools, not enterprise platforms.

- **Patients harmed per bed corrected.** Was 5.8 (derived at old average length of stay 3.3 days). Recalculated at Australian ALOS 5.5 days: 60 separations/bed × 5.4% adverse event rate = 3.2. Affects the safety context display only, not financial calculations.

- **Records request turnaround recalibrated.** System count capped at 20 for SAR calculations (was scaling linearly with all 520 systems, producing an implausible 293 working days). Recalibrated to 25 working days for statewide, 6 days after consolidation.

**Net impact of all accuracy corrections:** Combined annual benefits reduced from A$775M/yr to A$551M/yr — a 29% reduction that produces a more credible and defensible output.

---

## 9. Calibrating system counts to ~200

**What we did:** Reduced the statewide legacy system count from ~520 to ~204 through evidence-based recalibration of tier defaults and non-acute facility assumptions.

**Why:** The original tier defaults (30 enterprise + 140 departmental + 350 niche = 520) overstated the system count. The NSW SDPR research confirms 24 core systems and 30-40+ in full scope. Most non-acute sites (community health centres, outpatient clinics, pathology collection centres) use the LHD's shared EMR — they don't run independent legacy systems. 200 collection centres generating 200+ systems was unrealistic.

**Revised defaults:**
- Enterprise: 24 (confirmed: 9 EMR + 10 PAS + 5 LIMS)
- Departmental: 80 (~4-5 per LHD × 17 LHDs)
- Niche: 80 (~4-5 per LHD)
- Non-acute facilities: 20 (only pathology labs and MH inpatient retain per-site system counts; all other facility types use shared LHD systems)
- Total: ~204 systems
- Estate: A$238M/yr (within research range A$225-385M)

---

## 10. Scoping financial metrics to the archiving investment

**What we did:** Changed the Benefit-Cost Ratio (BCR) and payback calculations to compare Galen archiving investment against decommission savings specifically, rather than against total programme benefits.

**Why:** The archiving investment (A$15M migration) was being compared against the full A$551M annual benefit — producing a BCR of 91:1 and a payback of 9 days. While technically correct for the narrow question "should we invest in archiving," these figures would be dismissed as absurd by any executive reviewing the business case. The archive unlocks decommission savings specifically; clinician time, ABF efficiency, and quality improvements require the full EMR programme (Epic at A$969M). Scoping BCR to archive-vs-decom gives 10.5:1, and payback gives ~5 weeks — credible and compelling without being implausible.

---

## 11. Removing all US and American references

**What we did:** Conducted multiple sweeps of the entire codebase to identify and replace every remaining US reference — in user-facing text, methodology sections, formula displays, source citations, date formatting, and configuration comments.

**Why:** A single reference to "US benchmarks," "$95/hr," or "en-US" date formatting would undermine the credibility of the entire localisation effort. The standard applied was zero tolerance: if an Australian executive reading any part of the calculator encountered a US reference, the localisation would be considered incomplete.

**Examples of residue found and corrected:**
- "Default costs are US benchmarks scaled to your bed count" → "modelled from Australian state contract data"
- Formula display showing beds × 3.2 staff (US ratio) and A$95/hr (US wage) instead of 3.0 and A$65/hr
- "ITIL service desk reporting in US health systems" → "ITIL service desk benchmarks"
- Date locale en-US → en-AU across all PDF outputs
- "malpractice" → "indemnity" throughout the user interface
- "EHR" → "EMR" throughout (Australian standard terminology)

---

## 12. Restructuring the user experience

**What we did:** Restructured both the input flow and the results page to reduce complexity and improve clarity for executive audiences.

**Why:** After adding statewide programme support, tranche modelling, facility portfolios, and multiple financial metrics, the calculator had become visually heavy. An executive should be able to get the answer in 5 seconds, then drill into whatever interests them.

**Input flow changes:**
- Non-acute facility portfolio collapsed behind a toggle button ("Non-acute facility portfolio (optional)") — auto-expands for statewide, hidden for single hospitals
- Facility portfolio system counts now appear inline with the tier sliders (Enterprise → Departmental → Standalone → Non-acute facilities → Total), with combined totals, rather than as a disconnected summary card
- Merger/acquisition question hidden for statewide programmes (redundant — the preset already handles multi-facility consolidation)
- Reimbursement model defaults to "Public (ABF-funded)" for statewide
- Migration and archive costs left blank by default for optional entry

**Results page changes:**
- Level 1 (visible without scrolling): 4 KPI cards (combined annual, net benefit, payback, FTE freed) + cashable/capacity/avoidance proportion bar
- Level 2 (collapsible, all closed by default): executive detail, archiving investment case, tranche timeline, Australian evidence benchmarks, and full detailed breakdown
- All content preserved — nothing removed, just reorganised behind progressive disclosure

---

## 13. Expanding all acronyms

**What we did:** Ensured every acronym is spelled out on its first user-facing occurrence throughout the calculator — 22 acronyms in total.

**Why:** An executive unfamiliar with health informatics terminology should not have to guess what NWAU, IHACPA, or ACSQHC means. First-use expansion is standard practice in government documents and business cases.

**Acronyms expanded:** EMR, ABF, NPV, BCR, FTE, LHD, HHS, NWAU, SDPR, HRIP, ACSQHC, AIHW, IHACPA, VMIA, VAGO, QAO, NEP, EOI, APRA, PHI, RCH, QAHCS.

---

## Current calculator output (NSW SDPR, expected scenario)

At statewide scale with default inputs and no archiving costs entered:

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
