# UK to US ROI Calculator: what changed and why

Summary of every functional change made when adapting the NHS EPR Migration ROI Calculator for the US healthcare market.

---

## Market adaptation

| What we changed | Why we changed it |
|---|---|
| Currency from GBP to USD | US market pricing |
| Terminology from EPR/PAS to EHR/EMR | US industry uses EHR (Electronic Health Record), not EPR (Electronic Patient Record) |
| NHS Trust language to health system / facility language | US hospitals are not organised into Trusts; they operate as independent facilities, health systems, or IDNs |
| "Organisation" to "Organization" throughout | US English spelling |
| AfC (Agenda for Change) blended rate replaced with BLS-derived rate | UK clinical pay scales don't apply; used Bureau of Labor Statistics OEWS 2023 data instead |
| Blended hourly rate from £55 to $95 | Reflects US clinical compensation: RN ~$45-55/hr, physicians ~$120-180/hr, AHPs ~$35-65/hr |
| Working weeks from 48 to 50 | US standard working year |
| Staff per bed from 2.8 to 3.2 | US hospitals are more heavily staffed than NHS (BLS/MGMA benchmarks) |
| Corporate staff from flat 80/org to scaled formula | UK model used 80 staff per Trust. US model uses 20 base + 0.15 per bed (capped at 120) because a 25-bed Critical Access Hospital does not have 120 admin staff |

## Provider profiling (new)

| What we changed | Why we changed it |
|---|---|
| Added provider type selector (Step 1) | US hospitals vary enormously by type: a 25-bed Critical Access Hospital has completely different economics to a 2,500-bed academic system. The UK model treated all Trusts as roughly comparable |
| Five provider types: Critical Access, Community, Regional, Academic, Multi-Hospital | Maps to how CMS, KLAS, and the industry segment the US hospital market |
| Added reimbursement model selector (FFS, VBC/ACO, Mixed) | UK has a single payer (NHS). US providers have fundamentally different financial incentives depending on whether they are fee-for-service or value-based |
| Provider type drives multipliers for Medicare %, denial factor, penalty exposure | Different provider types face different levels of CMS penalty risk and revenue cycle complexity |
| Critical Access Hospitals have zero CMS penalty exposure | CAHs are legally exempt from HRRP, HAC Reduction Program, and VBP (these are IPPS-only programmes). The UK model had no equivalent exemption logic |
| Selecting a provider type auto-loads appropriate presets | Reduces friction: a user who says "Community Hospital" immediately gets 250 beds, 15 systems, and sensible defaults |

## Organization scale (expanded)

| What we changed | Why we changed it |
|---|---|
| Replaced single "Facilities in scope" slider with per-type facility sections | US health systems operate hospitals, ASCs, practices, SNFs, imaging centres, and more. The UK model only counted acute Trusts |
| Four facility categories: Hospitals, Ambulatory, Post-acute, Ancillary | Reflects the full scope of a US health system's clinical IT estate |
| 10 non-acute facility types with shared + perSite system model | Each facility type runs shared platform systems (exist once regardless of site count) plus per-site systems (local integrations that scale with each location). 10 dialysis centres share 2 platform systems + 1 per-site integration = 12 total systems, not 30 |
| Beds remain under Hospitals only | Bed count drives acute care metrics (admissions, ADEs, safety). Ambulatory sites don't have beds |
| Added merger/acquisition builder | US healthcare is consolidating rapidly (100+ M&A deals per year). Post-M&A system estates are the primary use case for legacy archiving. The UK model had no equivalent |
| Merger builder with 11 organization types across Acute, Ambulatory, and Post-acute | Users compose their future health system by clicking to add organizations. The builder identifies duplicate enterprise systems that consolidate into single instances post-merger |
| Merger builder gated behind "Are you planning a merger?" question | Only shown to users who are actively planning M&A, keeping the default flow clean |

## Vendor and cost model

| What we changed | Why we changed it |
|---|---|
| Replaced 18 UK vendors with 29 US vendors | Different market: Epic (42%), Oracle/Cerner (23%), MEDITECH (15%), plus TruBridge, MEDHOST, Altera, and 23 others |
| Each vendor now uses baseCost + perBed scaling | A 50-bed hospital running Epic pays very differently from a 2,500-bed system. The UK model used flat costs per vendor |
| Added system-level cost line items (5 categories per system) | CFOs want to see the breakdown: licensing, hosting, support, interfaces, other. Lets users enter exact contract values for hyper-accurate modelling |
| Tier cost formulas recalibrated for US market | Base costs and per-bed rates adjusted to US contract benchmarks (KLAS 2025, Becker's, EMR Guides) |

## Revenue and financial model (new)

| What we changed | Why we changed it |
|---|---|
| Added admissions-based revenue estimation | The UK NHS does not bill per admission. US hospitals generate ~$15,200 per admission (AHA/HCUP 2023), and this revenue drives penalty calculations, denial exposure, and malpractice risk |
| Revenue derived from beds, ALOS (4.7 days), and occupancy | The original formula ($42,000 per bed) understated revenue by ~37x. The corrected model produces realistic estimates (~$192M for a 250-bed hospital) that CFOs will recognise |
| Added adjustable occupancy rate (30-95%, default 65%) | Occupancy varies from 40% in rural Critical Access hospitals to 85% in urban academic centres. Directly affects admission volume and revenue |
| Added optional Medicare DRG revenue input | Users who know their actual Medicare revenue can enter it for precise CMS penalty calculations instead of using the estimate |
| Added optional implementation cost input | US EHR implementations cost $50M-$1.2B (Becker's). Without showing net ROI, the gross savings figure is misleading |
| Added net ROI section with payback period | When implementation cost is provided, results show 3-year gross savings vs implementation cost, net ROI, and payback in years |
| Added phased 3-year ramp (40%/80%/100%) | The UK model assumed flat savings from Year 1. In reality, systems are decommissioned progressively. Year 1 captures ~40% of steady-state savings |

## CMS penalty modelling (new)

| What we changed | Why we changed it |
|---|---|
| Added HRRP penalty avoidance (3% cap, 0.33% average) | The Hospital Readmissions Reduction Program penalises ~78% of US hospitals. No UK equivalent exists (NHS does not penalise for readmissions the same way) |
| Added HAC penalty avoidance (1% bottom quartile) | Hospital-Acquired Condition Reduction Program. Bottom 25% of hospitals lose 1% of Medicare payments. EHR consolidation improves the data quality that drives HAC scores |
| Added VBP improvement potential (2% withhold pool) | Value-Based Purchasing redistributes ~$1.7bn annually based on quality scores. Better clinical data from consolidated systems supports score improvement |
| Critical Access Hospitals exempted from all CMS penalties | CAHs are legally exempt from HRRP, HAC, and VBP. The model now correctly shows $0 penalty avoidance for this provider type while still showing denial recovery |
| Added denial rate reduction modelling | US hospitals lose 4.8% of net revenue to claim denials (HFMA). Fragmented systems produce inconsistent documentation that drives denials. No UK equivalent (NHS does not have claim denials) |
| Softened causal attribution language | The model explicitly distinguishes between broad EHR intervention evidence (Pattar et al, 17% readmission reduction from 116 RCTs) and specific single-vendor consolidation evidence (Vest et al, 0.8pp). Attribution framed as "contributing factor, not sole cause" |
| Added malpractice premium reduction | US malpractice system costs $55.6bn/yr (Mello et al). Communication failures contribute to 30% of claims (CRICO). The UK model referenced CNST but could not quantify per-Trust impact. US model uses $8,500/bed at 5% reduction (conservative) |
| Added duplicate testing reduction | 20-30% of US lab tests are unnecessary duplicates (ONC). $43bn/yr national waste. EHR consolidation directly reduces this |

## Patient safety (updated)

| What we changed | Why we changed it |
|---|---|
| Safety constants updated to US evidence | UK used Camacho et al and NHS-specific data. US version uses HHS OIG 2022 (25% of Medicare patients harmed), Bates et al (1.8 preventable ADEs per 100 admissions), AHRQ PSI v2024 benchmarks |
| Excess bed day cost updated to $3,132 (KFF/AHA 2023) | UK used NHS Reference Costs. US bed day costs vary from $1,800 (Mississippi) to $4,000+ (California) |
| Malpractice context updated to CRICO and Mello et al | UK referenced NAO and CNST. US version cites CRICO (23,658 claims analysis) and Mello et al (Health Affairs 2010) |
| Reconciled safety section and reimbursement section bed day calculations | The UK model had two separate bed day calculations that could produce conflicting numbers. US version uses a single unified path |
| Admission rate corrected from implied 8.7 days ALOS to 4.7 days | The UK-derived formula implied an average length of stay nearly double the US national average (AHA 2023), understating admission counts by ~1.8x |

## Academic and M&A modules (new)

| What we changed | Why we changed it |
|---|---|
| Added Academic Medical Center module | US academic centres run 40-200+ clinical systems including research-specific platforms (IRB, CTMS, biobank). The UK model did not differentiate teaching hospitals |
| Research system decommission (3.5 systems per 100 beds) | Academic centres have research IT estates that community hospitals do not. These systems are candidates for consolidation |
| GME compliance efficiency ($850/bed) | ACGME reporting, residency tracking, and procedure logging create compliance overhead that a unified EHR simplifies. No UK equivalent (GME is a US-specific regulatory framework) |
| Added Multi-Hospital / M&A module | US healthcare is consolidating aggressively. The module models duplicate system elimination, infrastructure consolidation, and cross-facility standardization. The UK model had no M&A-specific logic |

## Methodology and evidence (updated)

| What we changed | Why we changed it |
|---|---|
| Expanded from 10 to 11 methodology sections | Added Section 8: Reimbursement and compliance methodology with full formula documentation |
| All UK evidence references replaced with US sources | JAMA 2025 (Pattar, 116 RCTs), JAMIA 2019 (Vest), HHS OIG 2022, CRICO 2016, KFF/AHA 2023, CMS programme pages, HFMA/MDaudit 2024 |
| Added NYU Langone case study (33% mortality reduction) | The strongest published evidence for EHR consolidation improving outcomes. Wang et al, JAMA Network Open 2022 |
| Added VA Oracle Health cautionary example | Demonstrates that poorly executed migration creates worse outcomes. 826 major incidents, 149 veterans harmed. Balances the positive case |
| Updated included/excluded section | Added CMS penalties, denials, malpractice to included. Added implementation disruption period and transition staffing to excluded |
| Evidence base table with 8 key metrics and sources | Replaces UK benchmarking table. Each metric has a specific value, source, and year |

## PDF report (expanded)

| What we changed | Why we changed it |
|---|---|
| Added 4th summary card (Reimbursement and quality) | UK report had 3 cards. The reimbursement impact is a major differentiator for US buyers and needs headline visibility |
| Added provider type and reimbursement model to inputs table | US buyers need to see their provider profile reflected in the report |
| Added full reimbursement and compliance table to PDF | 7 line items (HRRP, HAC, VBP, denials, malpractice, excess bed days, duplicates) with sources. This is the core of the US financial case |
| Added combined annual impact summary box | Shows the full picture: decom + time + reimbursement + quality in one number |
| Year-by-year table now shows phased ramp | Year 1 at 40%, Year 2 at 80%, Year 3 at 100%. More credible than flat projections |
| Scenario comparison includes reimbursement row | All three scenarios show reimbursement impact alongside decom and time savings |
| Added conditional Academic and M&A module pages | Only appear in PDF when the relevant provider type is selected |
| Updated litigation note from UK (NAO/CNST) to US (CRICO/Mello et al) | UK malpractice context does not apply to US hospitals |

## Model accuracy corrections

| What we changed | Why we changed it |
|---|---|
| Revenue estimation fixed (was ~37x too low) | The original formula treated $42,000 as revenue per bed instead of per admission. Corrected to admissions-based: beds x (365/ALOS) x occupancy x $15,200/admission |
| ALOS corrected from implied 8.7 days to 4.7 days | The UK-derived admission rate implied nearly double the US national average length of stay |
| Corporate staff scaled instead of flat 120/facility | A 25-bed rural hospital was claiming 120 admin staff (more than its entire workforce). Now scales: 20 base + 0.15 per bed, capped at 120 |
| Switch penalty capped at 60 min/wk | Without a cap, 150+ legacy systems produced implausibly high time-wasted figures (84+ min/wk). 60 min/wk is the practical ceiling for searching across multiple systems |
| Malpractice per-bed recalibrated from $2,200 to $8,500 | The original figure was ~5x below what the cited Mello et al source supports. Reduction rate lowered from 8% to 5% for defensibility |
| Bed day calculations unified into single path | The safety section and reimbursement section were computing overlapping metrics via different formulas, creating a double-counting risk |
| Non-acute facility system counts corrected | The flat "systems x sites" model overcounted. Replaced with shared + perSite model: 10 dialysis centres = 12 systems (2 shared + 1 per site), not 30 |

## UX and design

| What we changed | Why we changed it |
|---|---|
| Added legal disclaimer to results page and PDF | US market requires explicit disclaimers that estimates are not guaranteed ROI or professional advice |
| Steps renumbered 1-6 (was 1-5) | Provider profile added as Step 1, pushing all other steps down by one |
| Removed duplicate "Quick start" preset grid from Step 3 | Step 1 (provider type) already auto-loads presets. Having the same presets in Step 3 was redundant |
| Single "Facilities in scope" slider replaced with grouped facility sections | Hospitals (with beds), Ambulatory (ASC, practices, urgent care, freestanding ED), Post-acute (SNF, home health, IRF), Ancillary (imaging, dialysis, infusion) as separate sections with individual counters |
| Non-acute facility systems use shared + perSite model | The flat "3 systems per site" model implied every dialysis centre runs completely independent systems. In reality, 10 centres share 2 platform systems + 1 per-site integration = 12 total, not 30 |
| Merger builder with duplicate system detection | Post-M&A is the primary use case. Users compose their future health system from 11 organization types (Acute, Ambulatory, Post-acute) and see the duplicate system count before running the calculator |
| Merger builder gated behind yes/no question | Only appears when the user indicates they are planning a merger, keeping the default flow clean for non-M&A users |
