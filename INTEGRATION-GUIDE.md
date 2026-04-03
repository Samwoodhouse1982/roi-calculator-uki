# ROI Calculator – Integration Setup Guide

## Overview

The calculator has two integrations, both optional. If config values are
left empty, the calculator still works — it just downloads the PDF locally
without sending it or capturing the lead.

---

## 1. HubSpot Lead Capture (Pre-configured)

**Status: LIVE** — HubSpot is already wired in and ready to use.

**What it does:** When the user submits the form, their details are POSTed
to HubSpot's Forms API (EU1 region) as a new contact/submission.

### Current configuration

```javascript
const HUBSPOT_PORTAL_ID = "27174408";
const HUBSPOT_FORM_GUID = "3f860858-5a58-4f1b-8419-a561af17adbe";
const HUBSPOT_REGION = "eu1";
```

**API endpoint:** `https://forms-eu1.hsforms.com/submissions/v3/integration/submit/...`

### Fields submitted

| HubSpot field | Source |
|---|---|
| `firstname` | First word of name input |
| `lastname` | Remainder of name input |
| `email` | Email input |
| `company` | Organisation input |
| `jobtitle` | Role dropdown |
| `message` | Calculator context (scenario, beds, orgs, legacy systems, annual savings, 3-year total, complexity, journey type) |

The `message` field gives the sales team full visibility of what the
user modelled, without needing custom HubSpot properties.

### How it works

No embedded form SDK is needed — the calculator POSTs directly to the
HubSpot Forms API v3. This is lighter than the `hbspt.forms.create()`
widget approach and preserves the calculator's custom styling.

The submission is fire-and-forget — if HubSpot is unreachable, the user
still gets their PDF download. Errors log to `console.warn` only.
### Optional: Custom HubSpot properties

To capture calculator inputs (bed count, scenario, annual savings) in
HubSpot, create custom contact properties and add them to the `fields`
array in the `submitLead` function:

```javascript
{ name: "roi_beds", value: String(inputs.bed_count) },
{ name: "roi_scenario", value: scenarioLabel },
{ name: "roi_annual", value: String(r.annual) },
{ name: "roi_total3", value: String(r.total3) },
```

---

## 2. PDF Email via Serverless Function

**What it does:** After the user submits, the generated PDF is sent to them
by email with a branded HTML message.

### Architecture

```
[Calculator]  →  POST /send-report  →  [Worker]  →  [SendGrid]  →  [User inbox]
   (browser)      { email, pdf_base64 }    (edge)       (API)         (with PDF)
```

### Option A: Cloudflare Worker (recommended)

1. Install Wrangler: `npm install -g wrangler`
2. Create a new worker: `wrangler init roi-email-worker`
3. Copy `email-worker.js` into `src/index.js`
4. Set environment secrets:
   ```bash
   wrangler secret put SENDGRID_API_KEY
   wrangler secret put FROM_EMAIL        # e.g. reports@rldatix.com
   wrangler secret put FROM_NAME         # e.g. "RLDatix Data Solutions"
   wrangler secret put ALLOWED_ORIGIN    # e.g. https://your-site.com
   ```
5. Deploy: `wrangler deploy`
6. Copy the worker URL (e.g. `https://roi-email.your-domain.workers.dev`)
7. In `roi-calculator.html`, set:
   ```javascript
   const EMAIL_ENDPOINT = "https://roi-email.your-domain.workers.dev";
   ```

### Option B: AWS Lambda

Same logic as the Worker, but:
- Use the AWS SDK for SES instead of SendGrid, or call SendGrid via `fetch`
- Wrap in a Lambda handler with API Gateway
- Set env vars in the Lambda console

### Option C: Vercel Edge Function

- Create `api/send-report.ts` in your Vercel project
- Same fetch-to-SendGrid logic
- Env vars via Vercel dashboard

### SendGrid Setup

1. Create a free account at [sendgrid.com](https://sendgrid.com)
2. Verify a sender identity (the FROM_EMAIL address)
3. Create an API key with "Mail Send" permission
4. Add it as the `SENDGRID_API_KEY` secret

Free tier allows 100 emails/day — more than enough for lead gen.

---

## 3. Request Payload Reference

The calculator POSTs this JSON to `EMAIL_ENDPOINT`:

```json
{
  "to": "user@example.com",
  "name": "Jane Smith",
  "org": "Example NHS Trust",
  "role": "CIO/CCIO",
  "filename": "ROI-Estimate-Example-NHS-Trust.pdf",
  "pdf_base64": "JVBERi0xLjQK...",
  "scenario": "Expected",
  "annual": 5230000,
  "total3": 15690000
}
```

The HubSpot submission uses the standard
[Forms API v3](https://developers.hubspot.com/docs/api/marketing/forms)
format — no authentication required.

---

## 4. Testing

### Without integrations
Leave all three config constants empty. The calculator downloads the PDF
locally and shows "Your PDF has been saved."

### With HubSpot only
Set `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_GUID`. Submissions will appear
in HubSpot under Marketing → Forms → Submissions. The PDF still downloads
locally.

### With email endpoint only
Set `EMAIL_ENDPOINT`. The PDF downloads locally AND is emailed to the user.
Success message shows "A copy is also being sent to {email}."

### With both
Set all three. Lead goes to HubSpot, PDF is emailed, and a local copy
downloads. This is the recommended production setup.

### Error handling
Both integrations are fire-and-forget — if HubSpot or the email endpoint
fails, the user still gets their PDF download. Errors are logged to
`console.warn` for debugging. No error is shown to the user unless both
the download AND the network requests fail.

---

## 5. CORS

The email worker needs to allow requests from wherever the calculator is
hosted. Set `ALLOWED_ORIGIN` to your domain. During development, you can
use `"*"` but restrict it for production.

HubSpot's Forms API handles CORS automatically — no config needed.

---

## 6. PDF Branding (Logo & Company Name)

The PDF report includes a branded header with configurable logo and
company name. Set these constants in the calculator:

```javascript
const PDF_LOGO_BASE64 = "";     // Base64-encoded PNG or JPEG (no data: prefix)
const PDF_LOGO_FORMAT = "PNG";  // "PNG" or "JPEG"
const PDF_LOGO_WIDTH = 42;      // Width in mm (height auto-scales)
const PDF_COMPANY_NAME = "RLDatix Data Solutions Group";
```

### How to get the base64 string

Open browser console, drag your logo file in:
```javascript
const input = document.createElement("input");
input.type = "file"; input.accept = "image/*";
input.onchange = () => {
  const r = new FileReader();
  r.onload = () => console.log(r.result.split(",")[1]);
  r.readAsDataURL(input.files[0]);
};
input.click();
```
Copy the output and paste it into `PDF_LOGO_BASE64`.

### Recommended logo specs
- **Format:** PNG with transparent background (preferred) or JPEG
- **Size:** 600×150px or similar wide aspect ratio
- **Colour:** White or light-coloured (it sits on a dark teal bar)

### What appears in the PDF
- **Page 1:** Full teal header bar with title on the left, logo on the
  right, seafoam accent strip underneath
- **Pages 2+:** Slim 14mm teal header strip with condensed title + logo
- **All pages:** Branded footer with company name, date, page numbers,
  and a seafoam accent bar at the very bottom

If `PDF_LOGO_BASE64` is empty, the headers still render cleanly —
just without the image.

---

## 7. Privacy / GDPR

- The form includes consent text ("We may reach out to see if we can help")
- HubSpot submission includes `legalConsentOptions` with `consentToProcess: true`
- No data is stored in the calculator itself — it's stateless
- The email worker processes data transiently (no logging of PDF content)
- Add a privacy policy link to the form if required by your legal team
