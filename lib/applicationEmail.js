// Renders a submitted loan application into an HTML + plain-text email.

const TEAL = "#1E3C36";
const BRONZE = "#C89430";
const CREAM = "#F8F4EB";

const PURPOSE = {
  purchase: "Purchase + rehab",
  refi: "Refinance + rehab",
  other: "Other",
};
const OCCUPANCY = {
  vacant: "Vacant",
  tenant: "Tenant occupied",
  seller: "Seller occupied",
};
const EXIT = { sell: "Sell", refi: "Refinance and hold", other: "Other" };

const DECLARATION_QUESTIONS = [
  ["dq1", "Bankruptcy in the last seven years"],
  ["dq2", "Foreclosure or deed in lieu"],
  ["dq3", "Outstanding judgments"],
  ["dq4", "Party to any lawsuit"],
  ["dq5", "Delinquent on federal debt"],
  ["dq6", "Loan declined or withdrawn in last 24 months"],
  ["dq7", "Property occupied as a residence"],
  ["dq8", "Property claimed as a homestead"],
];

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const dollars = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return "—";
  return s.startsWith("$") ? s : `$${s}`;
};

const val = (v) => {
  const s = String(v ?? "").trim();
  return s === "" ? "—" : s;
};

/** Rows: [label, value] pairs; blank values are kept so the reader sees gaps. */
function section(title, rows) {
  const body = rows
    .map(
      ([label, v]) => `
      <tr>
        <td style="padding:7px 16px 7px 0;color:#5b6f69;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
        <td style="padding:7px 0;color:${TEAL};font-size:14px;font-weight:600;vertical-align:top;">${esc(v)}</td>
      </tr>`
    )
    .join("");

  return `
  <tr><td style="padding:26px 28px 0;">
    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">${esc(title)}</div>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">${body}</table>
  </td></tr>`;
}

function guarantorRows(d, n) {
  return [
    ["Full legal name", val(d[`g${n}_name`])],
    ["Ownership %", d[`g${n}_pct`] ? `${d[`g${n}_pct`]}%` : "—"],
    ["Date of birth", val(d[`g${n}_dob`])],
    ["Home address", val(d[`g${n}_addr`])],
    ["Phone", val(d[`g${n}_phone`])],
    ["Email", val(d[`g${n}_email`])],
    ["Years investing", val(d[`g${n}_yrs`])],
    ["Flips completed", val(d[`g${n}_flips`])],
  ];
}

function projectsTable(rows) {
  const filled = (rows || []).filter((r) =>
    Object.values(r).some((v) => String(v ?? "").trim())
  );
  if (!filled.length) return "";

  const head = ["Property address", "Purchased", "Sold", "Purchase $", "Sale $"]
    .map(
      (h) =>
        `<th align="left" style="padding:8px 10px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#5b6f69;border-bottom:1px solid #dfd8ca;font-weight:700;">${h}</th>`
    )
    .join("");

  const body = filled
    .map(
      (r) => `<tr>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(val(r.addr))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(val(r.purchased))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(val(r.sold))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(dollars(r.purchase_price))}</td>
        <td style="padding:8px 10px;font-size:13px;color:${TEAL};border-bottom:1px solid #ece5d8;">${esc(dollars(r.sale_price))}</td>
      </tr>`
    )
    .join("");

  return `
  <tr><td style="padding:26px 28px 0;">
    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Recent Projects</div>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
      <tr>${head}</tr>${body}
    </table>
  </td></tr>`;
}

function declarationsBlock(d) {
  const rows = DECLARATION_QUESTIONS.map(([key, label]) => {
    const answer = d[key];
    const isYes = answer === "yes";
    const color = isYes ? "#b91c1c" : TEAL;
    const weight = isYes ? "700" : "600";
    return `<tr>
      <td style="padding:7px 16px 7px 0;color:#5b6f69;font-size:13px;vertical-align:top;">${label}</td>
      <td style="padding:7px 0;color:${color};font-size:14px;font-weight:${weight};text-transform:uppercase;vertical-align:top;">${esc(answer || "—")}</td>
    </tr>`;
  }).join("");

  const flagged = DECLARATION_QUESTIONS.filter(([k]) => d[k] === "yes");
  const banner = flagged.length
    ? `<div style="margin-top:14px;padding:12px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#b91c1c;font-size:13px;line-height:1.5;">
         <strong>${flagged.length} declaration${flagged.length > 1 ? "s" : ""} answered YES</strong> — needs follow-up before underwriting.
       </div>`
    : "";

  return `
  <tr><td style="padding:26px 28px 0;">
    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Declarations</div>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">${rows}</table>
    ${banner}
  </td></tr>`;
}

export function renderApplicationEmail(d) {
  const hasG2 = String(d.g2_name || "").trim();
  const hasG3 = String(d.g3_name || "").trim();

  const purpose =
    d.purpose === "other"
      ? `Other — ${val(d.p_other_txt)}`
      : PURPOSE[d.purpose] || "—";
  const exit =
    d.exit === "other" ? `Other — ${val(d.x_other_txt)}` : EXIT[d.exit] || "—";

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="640" style="max-width:640px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:26px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">New Loan Application</div>
          <div style="color:#F0EADE;font-size:23px;font-weight:700;margin-top:8px;line-height:1.25;">${esc(val(d.e_name))}</div>
          <div style="color:rgba(240,234,222,.72);font-size:14px;margin-top:6px;">
            ${esc(dollars(d.req_amount))} requested &nbsp;·&nbsp; ${esc(val(d.pr_addr))}
          </div>
        </td></tr>

        ${section("Loan Request", [
          ["Amount requested", dollars(d.req_amount)],
          ["Desired closing", val(d.req_close)],
          ["Purpose", purpose],
        ])}

        ${section("Borrowing Entity", [
          ["Entity name", val(d.e_name)],
          ["Entity type", val(d.e_type)],
          ["State of formation", val(d.e_state)],
          ["Date formed", val(d.e_formed)],
          ["EIN", val(d.e_ein)],
          ["Phone", val(d.e_phone)],
          ["Email", val(d.e_email)],
          ["Mailing address", val(d.e_addr)],
        ])}

        ${section("Principal / Guarantor 1", guarantorRows(d, 1))}
        ${hasG2 ? section("Principal / Guarantor 2", guarantorRows(d, 2)) : ""}
        ${hasG3 ? section("Principal / Guarantor 3", guarantorRows(d, 3)) : ""}

        ${section("Subject Property", [
          ["Address", val(d.pr_addr)],
          ["County", val(d.pr_county)],
          ["Year built", val(d.pr_year)],
          ["Beds / baths", val(d.pr_beds)],
          ["Square feet", val(d.pr_sqft)],
          ["Current occupancy", OCCUPANCY[d.occupancy] || "—"],
        ])}

        ${section("The Deal", [
          ["Purchase price", dollars(d.d_price)],
          ["Contract closing date", val(d.d_close)],
          ["Down payment", dollars(d.d_down)],
          ["Rehab budget", dollars(d.d_rehab)],
          ["Months to complete", val(d.d_months)],
          ["Estimated resale (ARV)", dollars(d.d_resale)],
          ["Source of down payment", val(d.d_source)],
          ["Exit strategy", exit],
        ])}

        ${section("Financial Strength", [
          ["Liquid assets", dollars(d.fs_liquid)],
          ["Reserves after closing", dollars(d.fs_reserves)],
          ["Projects in progress", val(d.fs_projects)],
          ["Balance on active loans", dollars(d.fs_debt)],
        ])}

        ${section("Their Team", [
          ["Title company", val(d.t_title)],
          ["Escrow officer", val(d.t_escrow)],
          ["Insurance agent", `${val(d.t_ins)}${d.t_ins_ph ? ` · ${d.t_ins_ph}` : ""}`],
          ["Real estate agent", `${val(d.t_agent)}${d.t_agent_ph ? ` · ${d.t_agent_ph}` : ""}`],
          ["General contractor", `${val(d.t_gc)}${d.t_gc_ph ? ` · ${d.t_gc_ph}` : ""}`],
        ])}

        ${projectsTable(d.projects)}
        ${declarationsBlock(d)}

        ${section("Signatures", [
          ["Borrowing entity", val(d.s_entity)],
          ["Principal 1", `${val(d.s1_name)}  /  signed: ${val(d.s1_sig)}  /  ${val(d.s1_date)}`],
          ...(String(d.s2_name || "").trim()
            ? [["Principal 2", `${val(d.s2_name)}  /  signed: ${val(d.s2_sig)}  /  ${val(d.s2_date)}`]]
            : []),
          ...(String(d.s3_name || "").trim()
            ? [["Principal 3", `${val(d.s3_name)}  /  signed: ${val(d.s3_sig)}  /  ${val(d.s3_date)}`]]
            : []),
          ["Certifications", "All five accepted"],
        ])}

        ${
          String(d.notes || "").trim()
            ? `<tr><td style="padding:26px 28px 0;">
                 <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Notes</div>
                 <div style="margin-top:12px;color:${TEAL};font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(d.notes)}</div>
               </td></tr>`
            : ""
        }

        <tr><td style="padding:28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:16px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Submitted from lazydogcapital.com. Reply directly to this email to reach the applicant.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `NEW LOAN APPLICATION`,
    ``,
    `Entity:      ${val(d.e_name)}`,
    `Principal:   ${val(d.g1_name)}`,
    `Requested:   ${dollars(d.req_amount)}`,
    `Property:    ${val(d.pr_addr)}, ${val(d.pr_county)} County`,
    `Purpose:     ${purpose}`,
    `Closing:     ${val(d.req_close)}`,
    ``,
    `THE DEAL`,
    `Purchase:    ${dollars(d.d_price)}`,
    `Down:        ${dollars(d.d_down)}`,
    `Rehab:       ${dollars(d.d_rehab)}`,
    `ARV:         ${dollars(d.d_resale)}`,
    `Timeline:    ${val(d.d_months)} months`,
    `Exit:        ${exit}`,
    ``,
    `CONTACT`,
    `${val(d.g1_name)} · ${val(d.g1_phone)} · ${val(d.g1_email)}`,
    ``,
    `Declarations answered YES: ${
      DECLARATION_QUESTIONS.filter(([k]) => d[k] === "yes")
        .map(([, label]) => label)
        .join(", ") || "none"
    }`,
    ``,
    String(d.notes || "").trim() ? `NOTES\n${d.notes}` : "",
  ].join("\n");

  const subject = `New loan application — ${val(d.e_name)} · ${dollars(
    d.req_amount
  )} · ${val(d.pr_addr)}`;

  return { subject, html, text };
}
