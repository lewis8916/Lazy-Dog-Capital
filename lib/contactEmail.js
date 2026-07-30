// Renders a contact-form message into an HTML + plain-text email.

const TEAL = "#1E3C36";
const BRONZE = "#C89430";
const CREAM = "#F8F4EB";

const PREFER = {
  phone: "Phone",
  email: "Email",
  either: "Either is fine",
};

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const val = (v) => (String(v ?? "").trim() === "" ? "—" : String(v).trim());

export function renderContactEmail(d) {
  const prefer = PREFER[d.prefer] || val(d.prefer);

  const row = (label, value) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#5b6f69;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
      <td style="padding:8px 0;color:${TEAL};font-size:14px;font-weight:600;vertical-align:top;">${esc(value)}</td>
    </tr>`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:26px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">New Website Message</div>
          <div style="color:#F0EADE;font-size:22px;font-weight:700;margin-top:8px;line-height:1.3;">${esc(val(d.name))}</div>
          <div style="color:rgba(240,234,222,.72);font-size:14px;margin-top:6px;">${esc(val(d.topic))}</div>
        </td></tr>

        <tr><td style="padding:24px 28px 0;">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Message</div>
          <div style="margin-top:14px;padding:16px 18px;background:#fff;border:1px solid #e6dfd1;border-radius:10px;color:${TEAL};font-size:15px;line-height:1.65;white-space:pre-wrap;">${esc(val(d.message))}</div>
        </td></tr>

        <tr><td style="padding:24px 28px 0;">
          <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:10px;border-bottom:2px solid ${BRONZE};display:inline-block;">Contact</div>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:12px;border-collapse:collapse;">
            ${row("Name", val(d.name))}
            ${row("Phone", val(d.phone))}
            ${row("Email", val(d.email))}
            ${row("Prefers", prefer)}
          </table>

          <div style="margin-top:16px;padding:12px 16px;border-radius:8px;background:#f0f7f2;border:1px solid #c9e2d2;color:#1f6b45;font-size:13px;">
            Wants to be reached by <strong>${esc(prefer)}</strong>.
          </div>
        </td></tr>

        <tr><td style="padding:26px 28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:16px;color:#7d8c87;font-size:11px;line-height:1.6;">
            Sent from the contact form on lazydogcapital.com. Reply directly to this
            email to reach ${esc(val(d.name))}.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `NEW WEBSITE MESSAGE`,
    ``,
    `From:     ${val(d.name)}`,
    `Phone:    ${val(d.phone)}`,
    `Email:    ${val(d.email)}`,
    `Topic:    ${val(d.topic)}`,
    `Prefers:  ${prefer}`,
    ``,
    `MESSAGE`,
    val(d.message),
  ].join("\n");

  const subject = `Website message — ${val(d.name)} · ${val(d.topic)}`;

  return { subject, html, text };
}
