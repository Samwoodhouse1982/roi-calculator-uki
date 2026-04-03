# ROI Calculator – Data Layer Reference

Every data point from the calculator is exposed in a single structured
object: `window.roiCalculatorData`. This updates reactively whenever the
user changes inputs or selects a scenario.

---

## Accessing the data

### From the same page (standalone or CMS)
```javascript
// Read the current state at any time
const data = window.roiCalculatorData;
console.log(data.annual_savings);      // 5230000
console.log(data.fmt.annual_savings);  // "£5.2m"

// Listen for updates
window.addEventListener("roi-calculator-update", (e) => {
  const data = e.detail;
  console.log("Updated:", data.fmt.three_year_total);
});
```

### From a parent page (iframe embed)
```javascript
window.addEventListener("message", (e) => {
  if (e.data?.type === "roi-calculator-data") {
    const data = e.data.data;
    console.log("Annual savings:", data.fmt.annual_savings);
  }
});
```

### From the PDF generator
The built-in `generatePDF()` already uses the `r` results object 
directly. But external PDF engines can read `window.roiCalculatorData`
to build their own templates.

---

## Full field reference

### Meta
| Field | Type | Example | Description |
|---|---|---|---|
| `_version` | string | `"2.0"` | Data schema version |
| `_generated` | string | `"2026-03-13T14:22:00Z"` | ISO timestamp |
| `_scenario` | string | `"Expected"` | Active scenario name |

### User info
| Field | Type | Example |
|---|---|---|
| `user_name` | string | `"Jane Smith"` |
| `user_email` | string | `"jane@nhs.net"` |
| `user_org` | string | `"Example NHS Trust"` |
| `user_role` | string | `"CIO/CCIO"` |

### Programme inputs
| Field | Type | Example | Description |
|---|---|---|---|
| `journey` | string | `"Migration + archiving"` | or `"Archive only"` |
| `bed_count` | number | `1400` | |
| `org_count` | number | `1` | |
| `complexity` | string | `"HIGH"` | LOW / TYPICAL / HIGH |
| `data_quality` | string | `"MIXED"` | CLEAN / MIXED / POOR |
| `decom_target_pct` | number | `75` | Percentage (0-100) |

### System counts
| Field | Type | Example |
|---|---|---|
| `systems_enterprise` | number | `2` |
| `systems_departmental` | number | `8` |
| `systems_standalone` | number | `15` |
| `systems_flagship` | number | `2` |
| `systems_total` | number | `27` |

### Tier costs (per system per year)
| Field | Type | Example |
|---|---|---|
| `cost_enterprise` | number | `1280000` |
| `cost_departmental` | number | `299000` |
| `cost_standalone` | number | `42000` |
| `cost_blended_avg` | number | `285000` |
| `cost_total_estate` | number | `8120000` |
| `cost_flagship_total` | number | `3600000` |

### Flagships detail
| Field | Type | Example |
|---|---|---|
| `flagships` | array | `[{ name: "Lorenzo", cost: 3600000, retire: true }]` |

### Decommission savings
| Field | Type | Example |
|---|---|---|
| `decom_total` | number | `20` |
| `decom_enterprise` | number | `2` |
| `decom_departmental` | number | `6` |
| `decom_standalone` | number | `11` |
| `decom_flagship_retired` | number | `1` |
| `decom_savings_annual` | number | `6850000` |
| `decom_flagship_savings` | number | `3600000` |

### Clinician time
| Field | Type | Example |
|---|---|---|
| `clinicians_in_scope` | number | `4000` |
| `mins_wasted_per_week` | number | `22` |
| `hours_freed_per_year` | number | `128000` |
| `time_savings_annual` | number | `2112000` |
| `realisation_rate_pct` | number | `30` |
| `blended_hourly_rate` | number | `55` |

### Headline totals
| Field | Type | Example |
|---|---|---|
| `annual_savings` | number | `8962000` |
| `three_year_total` | number | `26886000` |

### Scenario comparison
```javascript
data.scenarios.conservative.annual  // 6200000
data.scenarios.expected.annual      // 8962000
data.scenarios.stretch.annual       // 11800000
// Each has: annual, total3, decom, time
```

### Support & SAR
| Field | Type | Example |
|---|---|---|
| `tickets_baseline_monthly` | number | `68` |
| `tickets_after_monthly` | number | `18` |
| `tickets_reduction_pct` | number | `74` |
| `sar_days_before` | number | `12.3` |
| `sar_days_after` | number | `2.6` |
| `sar_reduction_pct` | number | `79` |

### Patient safety (not in financial totals)
| Field | Type | Example |
|---|---|---|
| `safety_med_errors_baseline` | number | `24300` |
| `safety_med_errors_avoided` | number | `6075` |
| `safety_patients_protected` | number | `430` |
| `safety_bed_days_avoided` | number | `495` |

### Pre-formatted values (`data.fmt`)
These are ready to drop straight into templates without formatting:

| Field | Example |
|---|---|
| `fmt.annual_savings` | `"£9.0m"` |
| `fmt.three_year_total` | `"£26.9m"` |
| `fmt.decom_savings` | `"£6.9m"` |
| `fmt.time_savings` | `"£2.1m"` |
| `fmt.total_estate` | `"£11.7m"` |
| `fmt.hours_freed` | `"128,000"` |
| `fmt.clinicians` | `"4,000"` |
| `fmt.systems_total` | `"27"` |
| `fmt.decom_total` | `"20"` |
| `fmt.cost_enterprise` | `"£1.3m"` |
| `fmt.cost_departmental` | `"£299k"` |
| `fmt.cost_standalone` | `"£42k"` |
| `fmt.conservative_annual` | `"£6.2m"` |
| `fmt.conservative_total3` | `"£18.6m"` |
| `fmt.stretch_annual` | `"£11.8m"` |
| `fmt.stretch_total3` | `"£35.4m"` |
| `fmt.date` | `"13 March 2026"` |

---

## Example: Building a custom PDF template

```javascript
// Wait for calculator to be ready
window.addEventListener("roi-calculator-update", (e) => {
  const d = e.detail;
  
  // Use raw values for calculations
  const paybackMonths = Math.round(1000000 / (d.annual_savings / 12));
  
  // Use fmt values for display
  document.getElementById("headline").textContent = d.fmt.three_year_total;
  document.getElementById("org-name").textContent = d.user_org;
  document.getElementById("scenario").textContent = d._scenario;
  
  // Build a table
  const rows = [
    ["Annual decom savings", d.fmt.decom_savings],
    ["Annual time savings", d.fmt.time_savings],
    ["Annual total", d.fmt.annual_savings],
    ["3-year total", d.fmt.three_year_total],
  ];
});
```

## Example: Pulling data into a server-side PDF

```javascript
// In your Cloudflare Worker / Lambda / API route:
// The calculator POSTs this data alongside the PDF blob
// when EMAIL_ENDPOINT is configured.
//
// Request body includes:
//   to, name, org, role, filename, pdf_base64,
//   scenario, annual, total3
//
// For the full dataset, have your page script read
// window.roiCalculatorData and POST it to your endpoint
// before or alongside the form submission.
```

---

## Notes

- All number fields are raw integers/floats (e.g. `5230000` not `"£5.2m"`)
- Use the `fmt.*` fields for display-ready strings
- The object updates on every input change, not just on form submission
- `_scenario` reflects whichever scenario tab the user has selected
- Patient safety fields are always populated but are NOT included in
  `annual_savings` or `three_year_total`
- Flagship details are in the `flagships` array with name, cost, and
  retire status for each
