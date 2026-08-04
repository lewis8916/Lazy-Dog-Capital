import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderApplicationEmail } from "@/lib/applicationEmail";
import { guardRequest, clientIp } from "@/lib/spamGuard";
import { sendAutoReply } from "@/lib/autoReply";

// Fields that must be present for an application to be actionable.
const REQUIRED = [
  "req_amount",
  "req_close",
  "purpose",
  "e_name",
  "e_type",
  "e_state",
  "e_phone",
  "e_email",
  "e_addr",
  "g1_name",
  "g1_pct",
  "g1_dob",
  "g1_addr",
  "g1_phone",
  "g1_email",
  "g1_yrs",
  "g1_flips",
  "pr_addr",
  "pr_county",
  "occupancy",
  "d_price",
  "d_down",
  "d_rehab",
  "d_months",
  "d_resale",
  "d_source",
  "exit",
  "fs_liquid",
  "fs_reserves",
  "s_entity",
  "s1_name",
  "s1_sig",
  "s1_date",
];

const CERTIFICATIONS = ["a1", "a2", "a3", "a4", "a5"];
const DECLARATIONS = ["dq1", "dq2", "dq3", "dq4", "dq5", "dq6", "dq7", "dq8"];

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const blocked = guardRequest(request, data, "apply");
  if (blocked) return blocked;

  const missing = REQUIRED.filter((k) => !String(data?.[k] ?? "").trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  if (DECLARATIONS.some((k) => !data[k])) {
    return NextResponse.json(
      { error: "All declarations must be answered." },
      { status: 400 }
    );
  }

  if (!CERTIFICATIONS.every((k) => data[k] === true)) {
    return NextResponse.json(
      { error: "All certifications must be accepted." },
      { status: 400 }
    );
  }

  // Owner-occupied or homestead property cannot be financed.
  if (data.dq7 === "yes" || data.dq8 === "yes") {
    return NextResponse.json(
      {
        error:
          "This loan cannot be made on owner-occupied or homestead property. Please contact us to discuss the deal.",
      },
      { status: 422 }
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(data.e_email)) {
    return NextResponse.json({ error: "Enter a valid entity email." }, { status: 400 });
  }

  if (data.esign_consent !== true) {
    return NextResponse.json(
      { error: "You must agree to sign electronically before submitting." },
      { status: 400 }
    );
  }

  // The signing record. The date typed into the form is the applicant's claim;
  // this is when we actually received it, and from where.
  data.signed_record = {
    receivedAt: new Date().toISOString(),
    ip: clientIp(request) ?? "unavailable",
    userAgent: request.headers.get("user-agent") ?? "unavailable",
    consent: true,
  };

  const { subject, html, text } = renderApplicationEmail(data);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLICATION_TO_EMAIL;
  const from = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  // Without a key configured (local dev), log the application so nothing is lost
  // and let the applicant through.
  if (!apiKey || !to) {
    console.warn(
      "[apply] RESEND_API_KEY or APPLICATION_TO_EMAIL not set — email not sent."
    );
    console.log("[apply] application received:\n" + text);
    return NextResponse.json({ ok: true, emailed: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from: `Lazy Dog Capital <${from}>`,
      to: to.split(",").map((a) => a.trim()),
      replyTo: data.g1_email || data.e_email,
      subject,
      html,
      text,
    });

    if (error) throw new Error(error.message || "Resend rejected the message");

    console.log(`[apply] emailed application ${sent?.id} for ${data.e_name}`);

    // Acknowledge to the applicant. Best-effort — never fails the submission.
    const ack = await sendAutoReply(
      "application",
      data,
      data.g1_email || data.e_email
    );

    return NextResponse.json({ ok: true, emailed: true, acknowledged: ack.sent });
  } catch (err) {
    // Never drop an application silently — log the whole thing, then tell the
    // applicant so they can follow up by phone.
    console.error("[apply] email delivery failed:", err.message);
    console.log("[apply] UNDELIVERED application:\n" + text);
    return NextResponse.json(
      {
        error:
          "We received your application but could not confirm delivery. Please call us so we can make sure nothing was lost.",
      },
      { status: 502 }
    );
  }
}
