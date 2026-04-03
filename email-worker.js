/**
 * ROI Calculator – Email PDF Report
 * Cloudflare Worker (or adapt for AWS Lambda / Vercel Edge Function)
 *
 * Receives the PDF as base64 from the calculator and emails it
 * to the user via SendGrid (swap for Mailgun/SES if preferred).
 *
 * Environment variables (set in Cloudflare dashboard):
 *   SENDGRID_API_KEY   – your SendGrid API key
 *   FROM_EMAIL         – sender address e.g. reports@rldatix.com
 *   FROM_NAME          – sender name e.g. "RLDatix Data Solutions"
 *   ALLOWED_ORIGIN     – the domain hosting the calculator (for CORS)
 */

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const { to, name, org, role, filename, pdf_base64, scenario, annual, total3 } = body;

      if (!to || !pdf_base64) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Format currency for the email body
      const fmtK = (n) =>
        n >= 1e6
          ? `£${(n / 1e6).toFixed(1)}m`
          : n >= 1000
          ? `£${Math.round(n / 1000).toLocaleString("en-GB")}k`
          : `£${Math.round(n).toLocaleString("en-GB")}`;

      // Build email HTML
      const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1F2937; line-height: 1.6; max-width: 600px; margin: 0 auto;">
  <div style="background: #0F4146; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fff; font-size: 20px; margin: 0 0 4px;">Your ROI Estimate</h1>
    <p style="color: #80F8E4; font-size: 14px; margin: 0;">EPR Migration & Clinical Data Archiving</p>
  </div>
  <div style="padding: 24px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Hi ${name ? name.split(" ")[0] : "there"},</p>
    <p>Thanks for using the ROI Calculator. Your personalised report is attached.</p>
    
    ${annual ? `
    <div style="background: #EEF7F1; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Estimated annual savings (${scenario || "Expected"})</div>
      <div style="font-size: 28px; font-weight: 800; color: #0F4146; margin: 4px 0;">${fmtK(annual)}/yr</div>
      <div style="font-size: 13px; color: #6B7280;">${fmtK(total3)} over 3 years</div>
    </div>
    ` : ""}

    <p>This estimate is based on the inputs you provided. Every figure in the calculator is adjustable — revisit it any time to refine the numbers as your programme develops.</p>
    
    <p>If you'd like to discuss your programme or explore how we can help, reply to this email or contact the RLDatix Data Solutions team directly.</p>
    
    <p style="color: #6B7280; font-size: 13px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      RLDatix Data Solutions Group<br>
      <a href="https://www.rldatix.com" style="color: #0F4146;">rldatix.com</a>
    </p>
  </div>
</body>
</html>`;

      // Send via SendGrid
      const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to, name: name || "" }],
              subject: `Your ROI Estimate${org ? " – " + org : ""}`,
            },
          ],
          from: {
            email: env.FROM_EMAIL || "reports@rldatix.com",
            name: env.FROM_NAME || "RLDatix Data Solutions",
          },
          reply_to: {
            email: env.FROM_EMAIL || "reports@rldatix.com",
            name: env.FROM_NAME || "RLDatix Data Solutions",
          },
          content: [
            { type: "text/html", value: emailHtml },
          ],
          attachments: [
            {
              content: pdf_base64,
              filename: filename || "ROI-Estimate.pdf",
              type: "application/pdf",
              disposition: "attachment",
            },
          ],
          // Optional: BCC internal team
          // personalizations[0].bcc: [{ email: "leads@rldatix.com" }],
        }),
      });

      if (!sgResponse.ok) {
        const errText = await sgResponse.text();
        console.error("SendGrid error:", sgResponse.status, errText);
        return new Response(JSON.stringify({ error: "Email send failed" }), {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
        },
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
        },
      });
    }
  },
};
