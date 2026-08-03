// Borrower-facing acknowledgements. These go to the person who filled the form,
// not to us — so they say what happens next and nothing more.
//
// Sending is best-effort by design: the internal notification is the one that
// must not be lost. If an acknowledgement fails (unverified sending domain,
// Resend hiccup), it is logged and the submission still succeeds.

import { Resend } from "resend";
import { computeDeal, usd } from "./dealMath.js";

const TEAL = "#1E3C36";
const BRONZE = "#C89430";
const CREAM = "#F8F4EB";
const PHONE = "214-740-4989";
const SITE = "lazydogcapital.com";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const firstName = (full) => String(full ?? "").trim().split(/\s+/)[0] || "there";

/** Shared shell so all three read as the same company. */
function shell({ eyebrow, heading, lead, body, steps, footNote }) {
  const stepRows = (steps || [])
    .map(
      (s, i) => `
      <tr>
        <td width="34" valign="top" style="padding:6px 12px 6px 0;">
          <div style="width:26px;height:26px;border-radius:50%;border:1px solid rgba(200,148,48,.5);color:${BRONZE};font-size:12px;font-weight:700;text-align:center;line-height:26px;">${i + 1}</div>
        </td>
        <td valign="top" style="padding:6px 0;">
          <div style="color:${TEAL};font-size:14px;font-weight:700;">${esc(s.title)}</div>
          <div style="color:#5b6f69;font-size:13px;line-height:1.6;margin-top:2px;">${esc(s.desc)}</div>
        </td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#eee7db;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#eee7db;padding:24px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:${CREAM};border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(30,60,54,.12);">

        <tr><td style="background:${TEAL};padding:30px 28px;">
          <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${BRONZE};font-weight:700;">${esc(eyebrow)}</div>
          <div style="color:#F0EADE;font-size:26px;font-weight:700;margin-top:10px;line-height:1.25;">${esc(heading)}</div>
        </td></tr>

        <tr><td style="padding:28px 28px 0;">
          <p style="margin:0;color:${TEAL};font-size:16px;line-height:1.65;">${lead}</p>
        </td></tr>

        ${
          body
            ? `<tr><td style="padding:20px 28px 0;">
                 <div style="background:#fff;border:1px solid #e6dfd1;border-radius:10px;padding:18px 20px;">${body}</div>
               </td></tr>`
            : ""
        }

        ${
          stepRows
            ? `<tr><td style="padding:26px 28px 0;">
                 <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${BRONZE};font-weight:700;padding-bottom:12px;border-bottom:2px solid ${BRONZE};display:inline-block;">What Happens Next</div>
                 <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:14px;border-collapse:collapse;">${stepRows}</table>
               </td></tr>`
            : ""
        }

        <tr><td style="padding:26px 28px 0;">
          <div style="background:rgba(200,148,48,.1);border:1px solid rgba(200,148,48,.3);border-radius:10px;padding:16px 20px;">
            <div style="color:${TEAL};font-size:14px;line-height:1.6;">
              Something change, or need us sooner? Just reply to this email or
              call <a href="tel:+12147404989" style="color:${BRONZE};font-weight:700;text-decoration:none;">${PHONE}</a>.
            </div>
          </div>
        </td></tr>

        <tr><td style="padding:28px;">
          <div style="border-top:1px solid #dfd8ca;padding-top:18px;">
            <div style="color:${TEAL};font-size:13px;font-weight:700;">Lazy Dog Capital</div>
            <div style="color:#7d8c87;font-size:12px;line-height:1.6;margin-top:4px;">
              3400 N Central Expy #110-217, Richardson, TX 75080<br />
              ${PHONE} &nbsp;·&nbsp; ${SITE}
            </div>
            <div style="color:#a4b0ab;font-size:11px;line-height:1.6;margin-top:12px;">
              ${esc(footNote)}
            </div>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const kv = (rows) =>
  rows
    .map(
      ([k, v]) => `
    <tr>
      <td style="padding:5px 14px 5px 0;color:#5b6f69;font-size:13px;white-space:nowrap;">${esc(k)}</td>
      <td style="padding:5px 0;color:${TEAL};font-size:14px;font-weight:600;">${esc(v)}</td>
    </tr>`
    )
    .join("");

/* ------------------------------------------------------------ 1. Submit a deal */

export function renderDealAck(d) {
  const c = computeDeal(d);
  const name = firstName(d.name);

  const body = `
    <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${BRONZE};font-weight:700;margin-bottom:10px;">The Deal You Sent</div>
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${kv([
        ["Property", d.address],
        ["Purchase price", usd(c.price)],
        ["Rehab budget", usd(c.rehab)],
        ["Value after repairs", usd(c.arv)],
        ...(d.months ? [["Timeline", `${d.months} months`]] : []),
      ])}
    </table>`;

  const html = shell({
    eyebrow: "Deal Received",
    heading: "We've got your deal.",
    lead: `Thanks, ${esc(name)} — your numbers are in front of us and we're reviewing them now.`,
    body,
    steps: [
      {
        title: "We check the numbers and the comps",
        desc: "We look at what the house should sell for finished, not just what the spreadsheet says.",
      },
      {
        title: "We call you",
        desc: "You'll hear what we'd lend and what it would cost. No credit pull to get there.",
      },
      {
        title: "If it works, we move",
        desc: "Full application, then closing at a title company — fast and on record.",
      },
    ],
    footNote:
      "This is confirmation that we received your submission. It is not a commitment to lend; all loans are subject to underwriting approval and property evaluation.",
  });

  const text = [
    `We've got your deal.`,
    ``,
    `Thanks, ${name} — your numbers are in front of us and we're reviewing them now.`,
    ``,
    `THE DEAL YOU SENT`,
    `Property:            ${d.address}`,
    `Purchase price:      ${usd(c.price)}`,
    `Rehab budget:        ${usd(c.rehab)}`,
    `Value after repairs: ${usd(c.arv)}`,
    ...(d.months ? [`Timeline:            ${d.months} months`] : []),
    ``,
    `WHAT HAPPENS NEXT`,
    `1. We check the numbers and the comps.`,
    `2. We call you with what we'd lend and what it would cost.`,
    `3. If it works, full application and then closing at title.`,
    ``,
    `Reply to this email or call ${PHONE}.`,
    ``,
    `Lazy Dog Capital · 3400 N Central Expy #110-217, Richardson, TX 75080`,
    `Not a commitment to lend; all loans subject to underwriting approval.`,
  ].join("\n");

  return {
    subject: `We got your deal — ${d.address}`,
    html,
    text,
  };
}

/* ---------------------------------------------------------- 2. Loan application */

export function renderApplicationAck(d) {
  const name = firstName(d.g1_name || d.s1_name);

  const body = `
    <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${BRONZE};font-weight:700;margin-bottom:10px;">Your Application</div>
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${kv([
        ["Borrowing entity", d.e_name],
        ["Property", d.pr_addr],
        ["Amount requested", d.req_amount ? `$${String(d.req_amount).replace(/^\$/, "")}` : "—"],
        ["Desired closing", d.req_close || "—"],
      ])}
    </table>`;

  const html = shell({
    eyebrow: "Application Received",
    heading: "Your application is in.",
    lead: `Thanks, ${esc(name)} — we have your application and we're reviewing it now. Nothing else is needed from you at this moment.`,
    body,
    steps: [
      {
        title: "We review the file",
        desc: "The entity, the principals, the property, and the numbers all get a look.",
      },
      {
        title: "We may come back with questions",
        desc: "If something needs clarifying or a document is missing, we'll reach out directly.",
      },
      {
        title: "Terms, then closing",
        desc: "If it's a fit, you'll get terms in plain English and we'll set a closing date at title.",
      },
    ],
    footNote:
      "This is confirmation that we received your application. It is not a commitment to lend; all loans are subject to underwriting approval, property evaluation, and execution of definitive loan documents.",
  });

  const text = [
    `Your application is in.`,
    ``,
    `Thanks, ${name} — we have your application and we're reviewing it now.`,
    `Nothing else is needed from you at this moment.`,
    ``,
    `YOUR APPLICATION`,
    `Borrowing entity: ${d.e_name || "—"}`,
    `Property:         ${d.pr_addr || "—"}`,
    `Amount requested: ${d.req_amount ? "$" + String(d.req_amount).replace(/^\$/, "") : "—"}`,
    `Desired closing:  ${d.req_close || "—"}`,
    ``,
    `WHAT HAPPENS NEXT`,
    `1. We review the file — entity, principals, property, numbers.`,
    `2. We may come back with questions if something needs clarifying.`,
    `3. If it's a fit, terms in plain English and a closing date at title.`,
    ``,
    `Reply to this email or call ${PHONE}.`,
    ``,
    `Lazy Dog Capital · 3400 N Central Expy #110-217, Richardson, TX 75080`,
    `Not a commitment to lend; all loans subject to underwriting approval.`,
  ].join("\n");

  return {
    subject: `We got your application — ${d.pr_addr || d.e_name || "Lazy Dog Capital"}`,
    html,
    text,
  };
}

/* -------------------------------------------------------------- 3. Contact form */

export function renderContactAck(d) {
  const name = firstName(d.name);
  const backTo =
    d.prefer === "email"
      ? "by email"
      : d.prefer === "either"
        ? "by phone or email, whichever reaches you first"
        : "by phone";

  const body = `
    <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${BRONZE};font-weight:700;margin-bottom:10px;">What You Sent Us</div>
    <div style="color:#5b6f69;font-size:12px;margin-bottom:6px;">${esc(d.topic || "Your message")}</div>
    <div style="color:${TEAL};font-size:14px;line-height:1.65;white-space:pre-wrap;">${esc(d.message)}</div>`;

  const html = shell({
    eyebrow: "Message Received",
    heading: "Thanks — we'll be in touch.",
    lead: `Thanks, ${esc(name)}. Your message reached a real person, and we'll get back to you ${esc(backTo)}.`,
    body,
    steps: [
      {
        title: "A person reads it",
        desc: "Not a queue and not a bot — one of us picks it up.",
      },
      {
        title: "We get back to you",
        desc: `We'll reach out ${backTo}. If it's urgent, calling us is always faster.`,
      },
    ],
    footNote:
      "This is confirmation that we received your message. Nothing in this email is a commitment to lend.",
  });

  const text = [
    `Thanks — we'll be in touch.`,
    ``,
    `Thanks, ${name}. Your message reached a real person, and we'll get back to you ${backTo}.`,
    ``,
    `WHAT YOU SENT US`,
    ...(d.topic ? [`Topic: ${d.topic}`, ``] : []),
    String(d.message ?? ""),
    ``,
    `WHAT HAPPENS NEXT`,
    `1. A person reads it — not a queue, not a bot.`,
    `2. We get back to you ${backTo}. If it's urgent, calling is faster.`,
    ``,
    `Reply to this email or call ${PHONE}.`,
    ``,
    `Lazy Dog Capital · 3400 N Central Expy #110-217, Richardson, TX 75080`,
  ].join("\n");

  return {
    subject: `We got your message — Lazy Dog Capital`,
    html,
    text,
  };
}

/* ------------------------------------------------------------------- delivery */

const RENDERERS = {
  deal: renderDealAck,
  application: renderApplicationAck,
  contact: renderContactAck,
};

/**
 * Best-effort acknowledgement to the person who submitted. Never throws — a
 * failure here must not cost us the submission itself.
 */
export async function sendAutoReply(kind, data, recipient) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = String(recipient ?? "").trim();

  if (!apiKey || !to) return { sent: false, reason: "not configured" };

  const from =
    process.env.AUTOREPLY_FROM_EMAIL ||
    process.env.APPLICATION_FROM_EMAIL ||
    "loans@lazydogcapital.com";
  const replyTo = process.env.APPLICATION_TO_EMAIL || from;

  try {
    const { subject, html, text } = RENDERERS[kind](data);
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from: `Lazy Dog Capital <${from}>`,
      to: [to],
      replyTo: replyTo.split(",")[0].trim(),
      subject,
      html,
      text,
    });
    if (error) throw new Error(error.message || "Resend rejected the message");
    console.log(`[autoreply:${kind}] sent ${sent?.id} to ${to}`);
    return { sent: true };
  } catch (err) {
    // Most likely cause early on: the sending domain isn't verified yet.
    console.error(`[autoreply:${kind}] could not send to ${to}:`, err.message);
    return { sent: false, reason: err.message };
  }
}
