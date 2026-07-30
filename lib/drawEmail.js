// Renders a construction draw request, laid out to match
// Construction_Draw_Request_Form_Fillable.pdf.

import { DRAW_REQUEST, computeDraw } from "./requestForms.js";
import { usd } from "./dealMath.js";

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

const row = (label, value, strong) => `
  <tr>
    <td style="padding:7px 16px 7px 0;color:#5b6f69;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
    <td style="padding:7px 0;color:${TEAL};font-size:${strong ? "16px" : "14px"};font-weight:${strong ? "700" : "600"};vertical-align:top;white-space:pre-wrap;">${esc(value)}</td>
  </tr>`;

const block = (heading, inner) => `
  <tr><td style="padding:24px 28px 0;">
    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">${esc(heading)}</div>
    ${inner}
  </td></tr>`;

export function renderDrawEmail(data) {
  const d = computeDraw(data);

  const itemRows = d.items
    .map(
      (r) => `<tr>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(val(r.desc))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(val(r.inv))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(val(r.pay))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;font-weight:600;">${esc(usd(Number(String(r.amt).replace(/[^\d]/g, "")) || 0))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(r.pct ? `${r.pct}%` : "—")}</td>
      </tr>`
    )
    .join("");

  const head = ["Description of work / item", "Invoice #", "Payable to", "Amount", "%"]
    .map(
      (h) =>
        `<th align="left" style="padding:8px 10px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#5b6f69;border-bottom:1px solid #dfd8ca;font-weight:700;">${h}</th>`
    )
    .join("");

  const attached = DRAW_REQUEST.attachments
    .map(
      (a, i) =>
        `<div style="padding:3px 0;color:${data[`att_${i}`] ? TEAL : "#a4b0ab"};font-size:13px;">${data[`att_${i}`] ? "&#10003;" : "&#9744;"} ${esc(a)}</div>`
    )
    .join("");

  const certs = DRAW_REQUEST.certifications
    .map(
      (c) =>
        `<div style="padding:4px 0;color:${TEAL};font-size:13px;line-height:1.6;">&#10003; ${esc(c)}</div>`
    )
    .join("");

  const mismatch =
    d.thisDraw > 0 && !d.itemsMatch
      ? `<div style="margin-top:14px;padding:12px 16px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:13px;">
           <strong>Line items don't match the draw.</strong> Items total ${esc(usd(d.itemsTotal))} against a ${esc(usd(d.thisDraw))} request.
         </div>`
      : "";

  const overdrawn = d.overAvailable
    ? `<div style="margin-top:14px;padding:12px 16px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:13px;">
         <strong>Request exceeds the balance available</strong> by ${esc(usd(d.thisDraw - d.available))}.
       </div>`
    : "";

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="660" style="max-width:660px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:26px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">Draw Request #${esc(val(data.draw_no))}</div>
          <div style="color:#F0EADE;font-size:22px;font-weight:700;margin-top:8px;line-height:1.3;">${esc(val(data.property))}</div>
          <div style="color:rgba(240,234,222,.72);font-size:14px;margin-top:6px;">
            ${esc(val(data.borrower))} &nbsp;·&nbsp; ${esc(usd(d.thisDraw))} requested
          </div>
        </td></tr>

        ${block(
          "The Loan",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Borrower", val(data.borrower))}
            ${row("Loan #", val(data.loan_no))}
            ${row("Property address", val(data.property))}
            ${row("Mailing address", val(data.mailing))}
            ${row("Draw #", val(data.draw_no))}
            ${row("Date", val(data.draw_date))}
          </table>`
        )}

        ${block(
          "Reimbursement",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Method", val(data.reimbursement))}
            ${row("Bank name", val(data.bank_name))}
            ${row("Name on account", val(data.acct_name))}
          </table>
          <div style="margin-top:12px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Account and routing numbers are not collected through the website —
            pay to the account on file.
          </div>`
        )}

        ${block(
          "Funds Request",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Total construction holdback", usd(d.holdback))}
            ${row("Less draws previously released", usd(d.previous))}
            ${row("Balance available to draw", usd(d.available))}
            ${row("Less this draw request", usd(d.thisDraw), true)}
            ${row("Balance remaining after this draw", usd(d.after))}
          </table>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:16px;padding-top:12px;border-top:1px solid #dfd8ca;border-collapse:collapse;">
            ${row("Total draw requested", usd(d.thisDraw))}
            ${row("Less draw request fee", usd(d.fee))}
            ${row("Net draw funded", usd(d.net), true)}
          </table>
          ${overdrawn}`
        )}

        ${block(
          "Items To Inspect",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            <tr>${head}</tr>
            ${itemRows}
            <tr>
              <td colspan="3" style="padding:10px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#5b6f69;font-weight:700;">Total</td>
              <td colspan="2" style="padding:10px;font-size:15px;color:${TEAL};font-weight:700;">${esc(usd(d.itemsTotal))}</td>
            </tr>
          </table>
          ${mismatch}`
        )}

        ${block(
          "Property Access",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Contact 1", `${val(data.contact1)} · ${val(data.phone1)}`)}
            ${row("Contact 2", data.contact2 ? `${val(data.contact2)} · ${val(data.phone2)}` : "—")}
            ${row("Access", val(data.access))}
            ${row("Email", val(data.email))}
          </table>`
        )}

        ${block("Attached", `<div style="margin-top:12px;">${attached}</div>`)}
        ${block("Borrower Certifies", `<div style="margin-top:12px;">${certs}</div>`)}

        ${block(
          "Signature",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            <tr>
              <td style="padding:7px 16px 7px 0;color:#5b6f69;font-size:13px;">Signed</td>
              <td style="padding:7px 0;color:${TEAL};font-size:15px;font-weight:700;font-style:italic;">${esc(val(data.sig))}</td>
            </tr>
            ${row("Printed name", val(data.sig_name))}
            ${row("Title", val(data.sig_title))}
            ${row("Date", val(data.sig_date))}
          </table>`
        )}

        <tr><td style="padding:26px 28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:16px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Submitted from lazydogcapital.com. Funds release only after the
            completed work is inspected and verified. Reply to reach ${esc(val(data.sig_name || data.contact1))}.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `DRAW REQUEST #${val(data.draw_no)}`,
    ``,
    `Borrower:   ${val(data.borrower)}`,
    `Property:   ${val(data.property)}`,
    `Loan #:     ${val(data.loan_no)}`,
    `Date:       ${val(data.draw_date)}`,
    `Method:     ${val(data.reimbursement)}`,
    ``,
    `FUNDS REQUEST`,
    `Holdback:            ${usd(d.holdback)}`,
    `Less previous draws: ${usd(d.previous)}`,
    `Available:           ${usd(d.available)}`,
    `This request:        ${usd(d.thisDraw)}`,
    `Remaining after:     ${usd(d.after)}`,
    `Less fee:            ${usd(d.fee)}`,
    `Net funded:          ${usd(d.net)}`,
    ``,
    `ITEMS TO INSPECT`,
    ...d.items.map(
      (r) =>
        `  ${val(r.desc)} — ${usd(Number(String(r.amt).replace(/[^\d]/g, "")) || 0)}${r.pct ? ` (${r.pct}%)` : ""}${r.pay ? ` · ${r.pay}` : ""}`
    ),
    `  TOTAL: ${usd(d.itemsTotal)}`,
    d.thisDraw > 0 && !d.itemsMatch
      ? `  ** items do not match the ${usd(d.thisDraw)} request **`
      : "",
    ``,
    `ACCESS`,
    `${val(data.contact1)} · ${val(data.phone1)}`,
    data.contact2 ? `${val(data.contact2)} · ${val(data.phone2)}` : "",
    val(data.access),
    ``,
    `Signed: ${val(data.sig)} (${val(data.sig_name)}${data.sig_title ? `, ${data.sig_title}` : ""}) on ${val(data.sig_date)}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  return {
    subject: `Draw Request #${val(data.draw_no)} — ${val(data.property)} · ${usd(d.thisDraw)}`,
    html,
    text,
  };
}
