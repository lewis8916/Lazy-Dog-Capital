import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderDealEmail } from "@/lib/dealEmail";
import { guardRequest } from "@/lib/spamGuard";
import { sendAutoReply } from "@/lib/autoReply";
import { createProspect } from "@/lib/airtable";

const REQUIRED = ["name", "phone", "email", "address", "price", "rehab", "arv"];

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const blocked = guardRequest(request, data, "submit-deal");
  if (blocked) return blocked;

  const missing = REQUIRED.filter((k) => !String(data?.[k] ?? "").trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  // Written before the email, not after, so the lead is captured even when
  // email delivery fails or isn't configured. createProspect never throws.
  const airtable = await createProspect(data);

  const { subject, html, text } = renderDealEmail(data);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLICATION_TO_EMAIL;
  const from = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      "[deal] RESEND_API_KEY or APPLICATION_TO_EMAIL not set — email not sent."
    );
    console.log("[deal] submission received:\n" + text);
    return NextResponse.json({
      ok: true,
      emailed: false,
      recorded: airtable.ok,
    });
  }

  try {
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from: `Lazy Dog Capital <${from}>`,
      to: to.split(",").map((a) => a.trim()),
      replyTo: data.email,
      subject,
      html,
      text,
    });

    if (error) throw new Error(error.message || "Resend rejected the message");

    console.log(`[deal] emailed submission ${sent?.id} for ${data.address}`);

    // Acknowledge to the sender. Best-effort — never fails the submission.
    const ack = await sendAutoReply("deal", data, data.email);

    return NextResponse.json({
      ok: true,
      emailed: true,
      acknowledged: ack.sent,
      recorded: airtable.ok,
    });
  } catch (err) {
    console.error("[deal] email delivery failed:", err.message);
    console.log("[deal] UNDELIVERED submission:\n" + text);

    // The lead is only lost if Airtable missed it too. When the row exists we
    // have the deal, so the borrower gets the normal success screen and the
    // email failure is ours to chase.
    if (airtable.ok) {
      return NextResponse.json({ ok: true, emailed: false, recorded: true });
    }

    // Deliberately 200, not 5xx: a 5xx gets replaced by the CDN's own HTML
    // error page, so the borrower never sees the sentence below.
    return NextResponse.json({
      ok: false,
      error:
        "We received your deal but could not confirm delivery. Please call 214-740-4989 so we can make sure nothing was lost.",
    });
  }
}
