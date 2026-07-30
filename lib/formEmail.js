// Generic renderer for the borrower request forms (draw, payoff). Driven by the
// same schema the form and the API route use, so a field added to the schema
// shows up in the email without touching this file.

import { allFields } from "./requestForms.js";

const TEAL = "#1E3C36";
const BRONZE = "#C89430";
const CREAM = "#F8F4EB";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const val = (v) => (String(v ?? "").trim() === "" ? "—" : String(v).trim());

const display = (field, data) => {
  const raw = data[field.name];
  if (field.money) {
    const digits = String(raw ?? "").replace(/[^\d]/g, "");
    return digits ? `$${Number(digits).toLocaleString("en-US")}` : "—";
  }
  if (field.name === "percent_complete" && String(raw ?? "").trim()) {
    return `${raw}%`;
  }
  return val(raw);
};

export function renderRequestEmail(schema, data) {
  const headline =
    val(data.address) !== "—" ? val(data.address) : val(data.entity);

  const sections = schema.sections
    .map((section) => {
      const rows = section.fields
        .map(
          (f) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#5b6f69;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(f.label)}</td>
          <td style="padding:8px 0;color:${TEAL};font-size:14px;font-weight:600;vertical-align:top;white-space:pre-wrap;">${esc(display(f, data))}</td>
        </tr>`
        )
        .join("");

      return `
      <tr><td style="padding:24px 28px 0;">
        <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">${esc(section.heading)}</div>
        <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">${rows}</table>
      </td></tr>`;
    })
    .join("");

  const certs = schema.certifications?.length
    ? `
    <tr><td style="padding:24px 28px 0;">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Certifications</div>
      <div style="margin-top:12px;color:${TEAL};font-size:13px;line-height:1.7;">
        ${schema.certifications
          .map((c) => `<div style="padding:3px 0;">&#10003; ${esc(c)}</div>`)
          .join("")}
      </div>
    </td></tr>`
    : "";

  const signature = schema.signature
    ? `
    <tr><td style="padding:24px 28px 0;">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Signature</div>
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 16px 8px 0;color:#5b6f69;font-size:13px;">Signed</td>
          <td style="padding:8px 0;color:${TEAL};font-size:15px;font-weight:700;font-style:italic;">${esc(val(data.signature))}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px 8px 0;color:#5b6f69;font-size:13px;">Date</td>
          <td style="padding:8px 0;color:${TEAL};font-size:14px;font-weight:600;">${esc(val(data.signature_date))}</td>
        </tr>
      </table>
    </td></tr>`
    : "";

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="620" style="max-width:620px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:26px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">${esc(schema.emailTitle)}</div>
          <div style="color:#F0EADE;font-size:22px;font-weight:700;margin-top:8px;line-height:1.3;">${esc(headline)}</div>
          <div style="color:rgba(240,234,222,.72);font-size:14px;margin-top:6px;">${esc(val(data.entity))} &nbsp;·&nbsp; ${esc(val(data.name))}</div>
        </td></tr>

        ${sections}
        ${certs}
        ${signature}

        <tr><td style="padding:26px 28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:16px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Submitted from lazydogcapital.com. Reply directly to this email to reach ${esc(val(data.name))}.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const lines = [schema.emailTitle.toUpperCase(), ""];
  schema.sections.forEach((section) => {
    lines.push(section.heading.toUpperCase());
    section.fields.forEach((f) => {
      lines.push(`${(f.label + ":").padEnd(30)}${display(f, data)}`);
    });
    lines.push("");
  });
  if (schema.signature) {
    lines.push(`Signed: ${val(data.signature)} on ${val(data.signature_date)}`);
  }

  const subject = `${schema.emailTitle} — ${headline}`;

  return { subject, html, text: lines.join("\n") };
}
