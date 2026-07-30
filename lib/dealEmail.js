// Renders a quick deal submission (short form) into an HTML + plain-text email.

const TEAL = "#1E3C36";
const BRONZE = "#C89430";
const CREAM = "#F8F4EB";

const EXIT = {
  sell: "Sell",
  refi: "Refinance and hold",
  unsure: "Not sure yet",
};

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const num = (v) => Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const usd = (n) => `$${n.toLocaleString("en-US")}`;
const val = (v) => (String(v ?? "").trim() === "" ? "—" : String(v).trim());

export function renderDealEmail(d) {
  const price = num(d.price);
  const rehab = num(d.rehab);
  const arv = num(d.arv);
  const totalCost = price + rehab;
  const cap = Math.round(arv * 0.8);
  const inRange = totalCost <= cap;
  const spread = arv - totalCost;
  const marginPct = arv ? Math.round((spread / arv) * 100) : 0;

  const row = (label, value, strong) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#5b6f69;font-size:13px;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:8px 0;color:${TEAL};font-size:${strong ? "16px" : "14px"};font-weight:${strong ? "700" : "600"};">${esc(value)}</td>
    </tr>`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:26px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">New Deal Submitted</div>
          <div style="color:#F0EADE;font-size:22px;font-weight:700;margin-top:8px;line-height:1.3;">${esc(val(d.address))}</div>
          <div style="color:rgba(240,234,222,.72);font-size:14px;margin-top:6px;">
            ${esc(val(d.name))} &nbsp;·&nbsp; ${esc(val(d.phone))}
          </div>
        </td></tr>

        <tr><td style="padding:24px 28px 0;">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">The Numbers</div>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Purchase price", usd(price))}
            ${row("Rehab budget", usd(rehab))}
            ${row("Total cost", usd(totalCost), true)}
            ${row("Their ARV", usd(arv), true)}
            ${row("80% of ARV", usd(cap))}
            ${row("Spread", `${usd(spread)} (${marginPct}% of ARV)`)}
            ${row("Months to complete", val(d.months))}
            ${row("Exit strategy", EXIT[d.exit] || val(d.exit))}
          </table>

          <div style="margin-top:16px;padding:12px 16px;border-radius:8px;background:${inRange ? "#f0f7f2" : "#fef6ec"};border:1px solid ${inRange ? "#c9e2d2" : "#f0d9b4"};">
            <span style="font-size:13px;font-weight:700;color:${inRange ? "#1f6b45" : "#9a6318"};">
              ${inRange ? "IN RANGE" : "TIGHT"}
            </span>
            <span style="font-size:13px;color:#5b6f69;">
              — total cost ${inRange ? "sits under" : "exceeds"} 80% of their stated ARV by ${esc(usd(Math.abs(cap - totalCost)))}.
            </span>
          </div>
        </td></tr>

        <tr><td style="padding:24px 28px 0;">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Contact</div>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Name", val(d.name))}
            ${row("Phone", val(d.phone))}
            ${row("Email", val(d.email))}
          </table>
        </td></tr>

        ${
          String(d.notes || "").trim()
            ? `<tr><td style="padding:24px 28px 0;">
                 <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Notes</div>
                 <div style="margin-top:12px;color:${TEAL};font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(d.notes)}</div>
               </td></tr>`
            : ""
        }

        <tr><td style="padding:26px 28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:16px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Quick deal submission from lazydogcapital.com — not a full application.
            Reply directly to this email to reach ${esc(val(d.name))}.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `NEW DEAL SUBMITTED`,
    ``,
    `Property:   ${val(d.address)}`,
    `From:       ${val(d.name)} · ${val(d.phone)} · ${val(d.email)}`,
    ``,
    `THE NUMBERS`,
    `Purchase:   ${usd(price)}`,
    `Rehab:      ${usd(rehab)}`,
    `Total cost: ${usd(totalCost)}`,
    `Their ARV:  ${usd(arv)}`,
    `80% of ARV: ${usd(cap)}`,
    `Spread:     ${usd(spread)} (${marginPct}% of ARV)`,
    `Timeline:   ${val(d.months)} months`,
    `Exit:       ${EXIT[d.exit] || val(d.exit)}`,
    ``,
    `${inRange ? "IN RANGE" : "TIGHT"} — total cost ${inRange ? "under" : "over"} 80% of ARV by ${usd(Math.abs(cap - totalCost))}`,
    ``,
    String(d.notes || "").trim() ? `NOTES\n${d.notes}` : "",
  ].join("\n");

  const subject = `New deal — ${val(d.address)} · ${usd(totalCost)} in, ${usd(arv)} ARV`;

  return { subject, html, text };
}
