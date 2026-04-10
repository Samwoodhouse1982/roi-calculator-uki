# UK to US ROI Calculator: planned changes

Summary of every functional change we will make when adapting the NHS EPR Migration ROI Calculator for the US healthcare market.

---

## Market adaptation

| What we will change | Why we are changing it |
|---|---|
| Currency from GBP to USD | US market pricing |
| Terminology from EPR/PAS to EHR/EMR | US industry uses EHR (Electronic Health Record), not EPR (Electronic Patient Record) |
| NHS Trust language to health system / facility language | US hospitals are not organised into Trusts; they operate as independent facilities, health systems, or IDNs |
| "Organisation" to "Organization" throughout | US English spelling |
| AfC (Agenda for Change) blended rate replaced with BLS-derived rate | UK clinical pay scales do not apply; we will use Bureau of Labor Statistics OEWS 2023 data instead |
| Blended hourly rate from £55 to $95 | Reflects US clinical compensation: RN ~$45-55/hr, physicians ~$120-180/hr, AHPs ~$35-65/hr |
| Working weeks from 48 to 50 | US standard working year |
| Staff per bed from 2.8 to 3.2 | US hospitals are more heavily staffed than NHS (BLS/MGMA benchmarks) |
| Corporate staff from flat 80/org to a scaled formula | The UK model uses 80 staff per Trust. The US model will use 20 base + 0.15 per bed (capped at 120) because a 25-bed Critical Access Hospital does not have 120 admin staff |

## Provider profiling (new)

| What we will change | Why we are changing it |
|---|---|
| Add a provider type selector (Step 1) | US hospitals vary enormously by type: a 25-bed Critical Access Hospital has completely different economics to a 2,500-bed academic system. The UK model treats all Trusts as roughly comparable |
| Five provider types: Critical Access, Community, Regional, Academic, Multi-Hospital | Maps to how CMS, KLAS, and the industry segment the US hospital market |
| Add a reimbursement model selector (FFS, VBC/ACO, Mixed) | UK has a single payer (NHS). US providers have fundamentally different financial incentives depending on whether they are fee-for-service or value-based |
| Provider type will drive multipliers for Medicare %, denial factor, penalty exposure | Different provider types face different levels of CMS penalty risk and revenue cycle complexity |
| Critical Access Hospitals will have zero CMS penalty exposure | CAHs are legally exempt from HRRP, HAC Reduction Program, and VBP (these are IPPS-only programmes). The UK model has no equivalent exemption logic |
| Selecting a provider type will auto-load appropriate presets | Reduces friction: a user who selects "Community Hospital" will immediately get 250 beds, 15 systems, and sensible defaults |

## Organization scale (expanded)

| What we will change | Why we are changing it |
|---|---|
| Replace the single "Facilities in scope" slider with per-type facility sections | US health systems operate hospitals, ASCs, practices, SNFs, imaging centres, and more. The UK model only counts acute Trusts |
| Four facility categories: Hospitals, Ambulatory, Post-acute, Ancillary | Reflects the full scope of a US health system's clinical IT estate |
| 10 non-acute facility types with a shared + perSite system model | Each facility type will run shared platform systems (exist once regardless of site count) plus per-site systems (local integrations that scale with each location). For example, 10 dialysis centres will share 2 platform systems + 1 per-site integration = 12 total systems, not 30 |
| Beds will remain under Hospitals only | Bed count drives acute care metrics (admissions, ADEs, safety). Ambulatory sites do not have beds |
| Add a merger/acquisition builder | US healthcare is consolidating rapidly (100+ M&A deals per year). Post-M&A system estates are the primary use case for legacy archiving. The UK model has no equivalent |
| Merger builder with 11 organization types across Acute, Ambulatory, and Post-acute | Users will compose their future health system by clicking to add organizations. The builder will identify duplicate enterprise systems that consolidate into single instances post-merger |
| Merger builder gated behind an "Are you planning a merger?" question | Will only be shown to users who are actively planning M&A, keeping the default flow clean |

## Vendor and cost model

| What we will change | Why we are changing it |
|---|---|
| Replace 18 UK vendors with 29 US vendors | Different market: Epic (42%), Oracle/Cerner (23%), MEDITECH (15%), plus TruBridge, MEDHOST, Altera, and 23 others |
| Each vendor will use baseCost + perBed scaling | A 50-bed hospital running Epic pays very differently from a 2,500-bed system. The UK model uses flat costs per vendor |
| Add system-level cost line items (5 categories per system) | CFOs want to see the breakdown: licensing, hosting, support, interfaces, other. This will let users enter exact contract values for hyper-accurate modelling |
| Tier cost formulas recalibrated for US market | Base costs and per-bed rates will be adjusted to US contract benchmarks (KLAS 2025, Becker's, EMR Guides) |

## Revenue and financial model (new)

| What we will change | Why we are changing it |
|---|---|
| Add admissions-based revenue estimation | The UK NHS does not bill per admission. US hospitals generate ~$15,200 per admission (AHA/HCUP 2023), and this revenue drives penalty calculations, denial exposure, and malpractice risk |
| Revenue will be derived from beds, ALOS (4.7 days), and occupancy | This produces realistic estimates (~$192M for a 250-bed hospital) that CFOs will recognise |
| Add an adjustable occupancy rate (30-95%, default 65%) | Occupancy varies from 40% in rural Critical Access hospitals to 85% in urban academic centres. This directly affects admission volume and revenue |
| Add an optional Medicare DRG revenue input | Users who know their actual Medicare revenue will be able to enter it for precise CMS penalty calculations instead of using the estimate |
| Add optional Galen Clinical Archive costs (migration + annual) | Will allow users to enter indicative Galen migration and ongoing archive costs. The results page will then show net savings after Galen costs, with payback period. This keeps the ROI in context of the actual product investment |
| Add a net savings section with payback period | When Galen costs are provided, the results will show 3-year gross savings vs Galen migration + annual archive costs, net savings, and payback in years |
| Add a phased 3-year ramp (40%/80%/100%) | The UK model assumes flat savings from Year 1. In reality, systems are decommissioned progressively. Year 1 will capture ~40% of steady-state savings |

## CMS penalty modelling (new)

| What we will change | Why we are changing it |
|---|---|
| Add HRRP penalty avoidance (3% cap, 0.33% average) | The Hospital Readmissions Reduction Program penalises ~78% of US hospitals. No UK equivalent exists (NHS does not penalise for readmissions the same way) |
| Add HAC penalty avoidance (1% bottom quartile) | Hospital-Acquired Condition Reduction Program. Bottom 25% of hospitals lose 1% of Medicare payments. EHR consolidation improves the data quality that drives HAC scores |
| Add VBP improvement potential (2% withhold pool) | Value-Based Purchasing redistributes ~$1.7bn annually based on quality scores. Better clinical data from consolidated systems supports score improvement |
| Critical Access Hospitals will be exempted from all CMS penalties | CAHs are legally exempt from HRRP, HAC, and VBP. The model will correctly show $0 penalty avoidance for this provider type while still showing denial recovery |
| Add denial rate reduction modelling | US hospitals lose 4.8% of net revenue to claim denials (HFMA). Fragmented systems produce inconsistent documentation that drives denials. No UK equivalent (NHS does not have claim denials) |
| Soften causal attribution language | The model will explicitly distinguish between broad EHR intervention evidence (Pattar et al, 17% readmission reduction from 116 RCTs) and specific single-vendor consolidation evidence (Vest et al, 0.8pp). Attribution will be framed as "contributing factor, not sole cause" |
| Add malpractice premium reduction | US malpractice system costs $55.6bn/yr (Mello et al). Communication failures contribute to 30% of claims (CRICO). The UK model references CNST but cannot quantify per-Trust impact. The US model will use $8,500/bed at 5% reduction (conservative) |
| Add duplicate testing reduction | 20-30% of US lab tests are unnecessary duplicates (ONC). $43bn/yr national waste. EHR consolidation directly reduces this |

## Patient safety (updated)

| What we will change | Why we are changing it |
|---|---|
| Update safety constants to US evidence | UK uses Camacho et al and NHS-specific data. The US version will use HHS OIG 2022 (25% of Medicare patients harmed), Bates et al (1.8 preventable ADEs per 100 admissions), AHRQ PSI v2024 benchmarks |
| Update excess bed day cost to $3,132 (KFF/AHA 2023) | UK uses NHS Reference Costs. US bed day costs vary from $1,800 (Mississippi) to $4,000+ (California) |
| Update malpractice context to CRICO and Mello et al | UK references NAO and CNST. The US version will cite CRICO (23,658 claims analysis) and Mello et al (Health Affairs 2010) |
| Reconcile safety and reimbursement bed day calculations | The UK model has two separate bed day calculations that could produce conflicting numbers. The US version will use a single unified path |
| Correct admission rate from implied 8.7 days ALOS to 4.7 days | The UK-derived formula implies an average length of stay nearly double the US national average (AHA 2023), understating admission counts by ~1.8x |

## Academic and M&A modules (new)

| What we will change | Why we are changing it |
|---|---|
| Add an Academic Medical Center module | US academic centres run 40-200+ clinical systems including research-specific platforms (IRB, CTMS, biobank). The UK model does not differentiate teaching hospitals |
| Research system decommission (3.5 systems per 100 beds) | Academic centres have research IT estates that community hospitals do not. These systems are candidates for consolidation |
| GME compliance efficiency ($850/bed) | ACGME reporting, residency tracking, and procedure logging create compliance overhead that a unified EHR simplifies. No UK equivalent (GME is a US-specific regulatory framework) |
| Add a Multi-Hospital / M&A module | US healthcare is consolidating aggressively. The module will model duplicate system elimination, infrastructure consolidation, and cross-facility standardization. The UK model has no M&A-specific logic |

## Methodology and evidence (updated)

| What we will change | Why we are changing it |
|---|---|
| Expand from 10 to 11 methodology sections | Will add Section 8: Reimbursement and compliance methodology with full formula documentation |
| Replace all UK evidence references with US sources | JAMA 2025 (Pattar, 116 RCTs), JAMIA 2019 (Vest), HHS OIG 2022, CRICO 2016, KFF/AHA 2023, CMS programme pages, HFMA/MDaudit 2024 |
| Add NYU Langone case study (33% mortality reduction) | The strongest published evidence for EHR consolidation improving outcomes. Wang et al, JAMA Network Open 2022 |
| Add VA Oracle Health cautionary example | Demonstrates that poorly executed migration creates worse outcomes. 826 major incidents, 149 veterans harmed. This balances the positive case |
| Update included/excluded section | Will add CMS penalties, denials, malpractice to included. Will add implementation disruption period and transition staffing to excluded |
| Add evidence base table with 8 key metrics and sources | Will replace the UK benchmarking table. Each metric will have a specific value, source, and year |

## PDF report (expanded)

| What we will change | Why we are changing it |
|---|---|
| Add a 4th summary card (Reimbursement and quality) | The UK report has 3 cards. The reimbursement impact is a major differentiator for US buyers and needs headline visibility |
| Add provider type and reimbursement model to inputs table | US buyers need to see their provider profile reflected in the report |
| Add a full reimbursement and compliance table to the PDF | 7 line items (HRRP, HAC, VBP, denials, malpractice, excess bed days, duplicates) with sources. This is the core of the US financial case |
| Add a combined annual impact summary box | Will show the full picture: decom + time + reimbursement + quality in one number |
| Year-by-year table will show phased ramp | Year 1 at 40%, Year 2 at 80%, Year 3 at 100%. More credible than flat projections |
| Scenario comparison will include a reimbursement row | All three scenarios will show reimbursement impact alongside decom and time savings |
| Add conditional Academic and M&A module pages | Will only appear in the PDF when the relevant provider type is selected |
| Update litigation note from UK (NAO/CNST) to US (CRICO/Mello et al) | UK malpractice context does not apply to US hospitals |

## Model accuracy corrections

| What we will change | Why we are changing it |
|---|---|
| Fix revenue estimation (currently ~37x too low) | The current formula treats $42,000 as revenue per bed instead of per admission. We will correct this to admissions-based: beds x (365/ALOS) x occupancy x $15,200/admission |
| Correct ALOS from implied 8.7 days to 4.7 days | The UK-derived admission rate implies nearly double the US national average length of stay |
| Scale corporate staff instead of flat 120/facility | A 25-bed rural hospital currently claims 120 admin staff (more than its entire workforce). We will scale this: 20 base + 0.15 per bed, capped at 120 |
| Cap switch penalty at 60 min/wk | Without a cap, 150+ legacy systems produce implausibly high time-wasted figures (84+ min/wk). 60 min/wk is the practical ceiling for searching across multiple systems |
| Recalibrate malpractice per-bed from $2,200 to $8,500 | The current figure is ~5x below what the cited Mello et al source supports. We will also lower the reduction rate from 8% to 5% for defensibility |
| Unify bed day calculations into a single path | The safety section and reimbursement section currently compute overlapping metrics via different formulas, creating a double-counting risk |
| Correct non-acute facility system counts | The flat "systems x sites" model overcounts. We will replace it with a shared + perSite model: 10 dialysis centres = 12 systems (2 shared + 1 per site), not 30 |

## UX and design

| What we will change | Why we are changing it |
|---|---|
| Add a legal disclaimer to the results page and PDF | US market requires explicit disclaimers that estimates are not guaranteed ROI or professional advice |
| Renumber steps 1-6 (currently 1-5) | Provider profile will be added as Step 1, pushing all other steps down by one |
| Remove the duplicate "Quick start" preset grid from Step 3 | Step 1 (provider type) will already auto-load presets. Having the same presets in Step 3 is redundant |
| Replace the single "Facilities in scope" slider with grouped facility sections | Hospitals (with beds), Ambulatory (ASC, practices, urgent care, freestanding ED), Post-acute (SNF, home health, IRF), Ancillary (imaging, dialysis, infusion) as separate sections with individual counters |
| Non-acute facility systems will use a shared + perSite model | The flat "3 systems per site" model implies every dialysis centre runs completely independent systems. In reality, 10 centres share 2 platform systems + 1 per-site integration = 12 total, not 30 |
| Add a merger builder with duplicate system detection | Post-M&A is the primary use case. Users will compose their future health system from 11 organization types (Acute, Ambulatory, Post-acute) and see the duplicate system count before running the calculator |
| Merger builder gated behind a yes/no question | Will only appear when the user indicates they are planning a merger, keeping the default flow clean for non-M&A users |

---

## Improvements backported to the UK calculator

The US design process uncovered several issues and improvements that also apply to the existing UK NHS calculator. The following changes will be applied to the UK version as a result of this work.

| What we will change in the UK version | Why |
|---|---|
| Scale corporate staff from flat 80/org to 20 base + 0.12/bed (capped at 80) | The flat figure works for a typical 800-bed Trust but overstates for smaller specialist Trusts and understates for very large ones. The scaled formula is more accurate across the full range |
| Cap the switch penalty at 4.0 (max ~60 min/wk) | At 70+ systems (the Multi-Trust preset) the time-wasted figure is already 46 min/wk, which is reasonable. Without a cap, adding named flagship systems on top pushes minutes wasted beyond what is credible |
| Add a phased 3-year ramp (40%/80%/100%) | No NHS programme decommissions all legacy systems on day one. Year 1 typically covers discovery, planning, and early retirements. Full steady-state savings are not realised until Year 3. This changes a £5M/yr programme from showing £15M over 3 years to £11M, which is more defensible in a Trust board paper |
| Add system-level cost line items (5 categories per named system) | Licensing, hosting, support, interfaces, other. Allows Trust finance teams to enter exact contract values from their own records rather than relying on modelled estimates. The total recalculates in real-time as line items are edited |
| Convert all 18 UK vendors to baseCost + perBed scaling | Epic at a 250-bed specialist Trust will show ~£3.3m/yr; at an 800-bed acute Trust ~£6.0m; at a 1,400-bed large Trust ~£9.0m. The current flat £8m figure is only accurate for one size of Trust |
| Add a legal disclaimer to the results page and every PDF download | Clarifies that all figures are indicative estimates, not guaranteed savings targets or professional advice. Protects both RLDatix and the Trust from over-reliance on modelled numbers |
| Confirm bed day calculations use a single path (no double-counting) | The US version had a risk of double-counting excess bed days across two separate calculation paths. We reviewed the UK version and confirmed it uses a single qualitative path only. No fix is needed, but this has been formally verified |
| Update methodology formulas to reflect all of the above | The methodology accordion will show the corrected corporate staff formula, the switch penalty cap, and the phased ramp, so users can see exactly how every number is derived |
