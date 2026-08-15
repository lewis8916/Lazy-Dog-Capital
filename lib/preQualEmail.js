// Renders a pre-qualification letter request, laid out to match
// Proof_of_Funds_Request.pdf.

import { PRE_QUAL_REQUEST } from "./requestForms.js";

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
const money = (v) =>
  `$${(Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0).toLocaleString("en-US")}`;

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

const filledRows = (rows, keys) =>
  (rows || []).filter((r) => keys.some((k) => String(r?.[k] ?? "").trim()));

export function renderPreQualEmail(data) {
  const funds = filledRows(data.funds, ["bank", "balance", "holder"]);
  const flips = filledRows(data.flips, ["address", "purchase", "rehab", "sold", "held"]);
  const projects = filledRows(data.projects, ["address", "purchase_date", "pct_done"]);
  const rentals = filledRows(data.rentals, ["address", "value", "loan_balance", "rent"]);
  const lenders = filledRows(data.lenders, ["lender", "loans", "active", "contact"]);

  const verify = Object.entries(data.verify || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (data.verify_other) verify.push(`Other: ${data.verify_other}`);

  const workWho = Object.entries(data.work_who || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  const everAnswers = (PRE_QUAL_REQUEST.everQuestions || [])
    .map((q) => ({ ...q, a: data.ever?.[q.key] }))
    .filter((q) => q.a);

  const certs = PRE_QUAL_REQUEST.certifications
    .map(
      (c) =>
        `<div style="padding:4px 0;color:${TEAL};font-size:13px;line-height:1.6;">&#10003; ${esc(c)}</div>`
    )
    .join("");

  const uploads = Array.isArray(data.attachments) ? data.attachments : [];
  const kb = (n) =>
    n >= 1024 * 1024 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;

  const fundsRows = funds.length
    ? funds
        .map((f) => row(val(f.bank), `${money(f.balance)} — ${val(f.holder)}`))
        .join("")
    : row("Funds held", "—");

  const flipRows = flips.length
    ? flips
        .map((f) =>
          row(
            val(f.address),
            `Purchase ${money(f.purchase)} · Rehab ${money(f.rehab)} · Sold ${money(f.sold)} · Held ${val(f.held)} mo`
          )
        )
        .join("")
    : "";

  const projectRows = projects.length
    ? projects
        .map((p) => row(val(p.address), `Purchased ${val(p.purchase_date)} · ${val(p.pct_done)}% done`))
        .join("")
    : "";

  const rentalRows = rentals.length
    ? rentals
        .map((r) =>
          row(
            `${val(r.address)}${r.personal ? " (personal residence)" : ""}`,
            `Value ${money(r.value)} · Loan ${money(r.loan_balance)} · Rent ${money(r.rent)}/mo`
          )
        )
        .join("")
    : "";

  const lenderRows = lenders.length
    ? lenders
        .map((l) => row(val(l.lender), `${val(l.loans)} loans · Active: ${val(l.active)} · ${val(l.contact)}`))
        .join("")
    : "";

  const everRows = everAnswers.length
    ? everAnswers.map((q) => row(q.q, q.a)).join("")
    : row("Any yes answers", "None reported");

  const attached = uploads.length
    ? uploads
        .map(
          (u) =>
            `<div style="padding:2px 0;color:${TEAL};font-size:12px;">${esc(u.filename)}${u.size ? ` · ${kb(u.size)}` : ""}</div>`
        )
        .join("")
    : `<div style="padding:2px 0;color:#b08b4f;font-size:12px;">Nothing attached</div>`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="660" style="max-width:660px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:26px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">Pre-Qualification Request</div>
          <div style="color:#F0EADE;font-size:22px;font-weight:700;margin-top:8px;line-height:1.3;">${esc(val(data.entity))}</div>
          <div style="color:rgba(240,234,222,.72);font-size:14px;margin-top:6px;">
            ${esc(val(data.principal))} &nbsp;·&nbsp; ${esc(val(data.property))}
          </div>
        </td></tr>

        ${block(
          "Part 1 — Proof Of Funds",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Down payment funds", money(data.down_payment), true)}
            ${row("Closing costs & fees", money(data.closing_costs))}
            ${fundsRows}
            ${row("Verification provided", verify.length ? verify.join("; ") : "None checked")}
          </table>`
        )}

        ${
          flipRows
            ? block(
                "Part 2 — Completed Flips",
                `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
                  ${row("Last 36 months / lifetime", `${val(data.flips_36)} / ${val(data.flips_life)}`)}
                  ${flipRows}
                </table>`
              )
            : ""
        }

        ${
          projectRows
            ? block(
                "Part 3 — Current Projects",
                `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">${projectRows}</table>`
              )
            : ""
        }

        ${
          rentalRows
            ? block(
                "Part 4 — Rentals & Other Real Estate Held",
                `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">${rentalRows}</table>`
              )
            : ""
        }

        ${block(
          "Part 5 — Experience",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Who does the work", workWho.length ? workWho.join("; ") : "—")}
            ${row("Primary contractor", val(data.primary_contractor))}
            ${row("Years together", val(data.years_together))}
            ${row("Markets", val(data.markets))}
            ${row("Typical project size", val(data.project_size))}
            ${row("Similar to / different from recent work", val(data.similar_diff))}
          </table>`
        )}

        ${block(
          "Part 6 — Lending History",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${lenderRows || row("Other lenders", "—")}
            ${everRows}
            ${row("Explanation", val(data.ever_explain))}
          </table>`
        )}

        ${block(
          uploads.length
            ? `Attached · ${uploads.length} file${uploads.length === 1 ? "" : "s"}`
            : "Attached",
          `<div style="margin-top:12px;">${attached}</div>`
        )}

        ${block("Certifies", `<div style="margin-top:12px;">${certs}</div>`)}

        ${block(
          "Signature",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            <tr>
              <td style="padding:7px 16px 7px 0;color:#5b6f69;font-size:13px;">Signed</td>
              <td style="padding:7px 0;color:${TEAL};font-size:15px;font-weight:700;font-style:italic;">${esc(val(data.signature))}</td>
            </tr>
            ${row("Printed name", val(data.signature_name))}
            ${row("Date", val(data.signature_date))}
          </table>`
        )}

        ${block(
          "Contact",
          `<table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Name", val(data.name))}
            ${row("Phone", val(data.phone))}
            ${row("Email", val(data.email))}
          </table>`
        )}

        <tr><td style="padding:26px 28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:16px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Submitted from lazydogcapital.com. Reply to reach ${esc(val(data.name))} directly.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `PRE-QUALIFICATION REQUEST`,
    ``,
    `Entity:     ${val(data.entity)}`,
    `Principal:  ${val(data.principal)}`,
    `Property:   ${val(data.property)}`,
    ``,
    `PROOF OF FUNDS`,
    `Down payment:    ${money(data.down_payment)}`,
    `Closing costs:   ${money(data.closing_costs)}`,
    ...funds.map((f) => `  ${val(f.bank)} — ${money(f.balance)} (${val(f.holder)})`),
    `Verification:    ${verify.length ? verify.join("; ") : "None checked"}`,
    ``,
    `COMPLETED FLIPS (last 36 mo: ${val(data.flips_36)}, lifetime: ${val(data.flips_life)})`,
    ...flips.map(
      (f) =>
        `  ${val(f.address)} — Purchase ${money(f.purchase)}, Rehab ${money(f.rehab)}, Sold ${money(f.sold)}, Held ${val(f.held)} mo`
    ),
    ``,
    `CURRENT PROJECTS`,
    ...projects.map((p) => `  ${val(p.address)} — purchased ${val(p.purchase_date)}, ${val(p.pct_done)}% done`),
    ``,
    `RENTALS & OTHER REAL ESTATE HELD`,
    ...rentals.map(
      (r) =>
        `  ${val(r.address)}${r.personal ? " (personal residence)" : ""} — Value ${money(r.value)}, Loan ${money(r.loan_balance)}, Rent ${money(r.rent)}/mo`
    ),
    ``,
    `EXPERIENCE`,
    `Who does the work: ${workWho.length ? workWho.join("; ") : "—"}`,
    `Primary contractor: ${val(data.primary_contractor)} (${val(data.years_together)} yrs)`,
    `Markets: ${val(data.markets)}`,
    `Typical size: ${val(data.project_size)}`,
    `Similar/different: ${val(data.similar_diff)}`,
    ``,
    `LENDING HISTORY`,
    ...lenders.map((l) => `  ${val(l.lender)} — ${val(l.loans)} loans, active: ${val(l.active)}, ${val(l.contact)}`),
    ...everAnswers.map((q) => `  ${q.q} ${q.a}`),
    `Explanation: ${val(data.ever_explain)}`,
    ``,
    `ATTACHED (${uploads.length})`,
    ...(uploads.length
      ? uploads.map((u) => `  ${u.filename}${u.size ? ` · ${kb(u.size)}` : ""}`)
      : ["  nothing attached"]),
    ``,
    `Signed: ${val(data.signature)} (${val(data.signature_name)}) on ${val(data.signature_date)}`,
    ``,
    `CONTACT`,
    `${val(data.name)} · ${val(data.phone)} · ${val(data.email)}`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  return {
    subject: `Pre-Qual Request — ${val(data.entity)} · ${val(data.property)}`,
    html,
    text,
  };
}
