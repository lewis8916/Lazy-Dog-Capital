import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderDealEmail } from "@/lib/dealEmail";

const REQUIRED = ["name", "phone", "email", "address", "price", "rehab", "arv"];

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

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

  const { subject, html, text } = renderDealEmail(data);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLICATION_TO_EMAIL;
  const from = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      "[deal] RESEND_API_KEY or APPLICATION_TO_EMAIL not set — email not sent."
    );
    console.log("[deal] submission received:\n" + text);
    return NextResponse.json({ ok: true, emailed: false });
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
    return NextResponse.json({ ok: true, emailed: true });
  } catch (err) {
    console.error("[deal] email delivery failed:", err.message);
    console.log("[deal] UNDELIVERED submission:\n" + text);
    return NextResponse.json(
      {
        error:
          "We received your deal but could not confirm delivery. Please call us so we can make sure nothing was lost.",
      },
      { status: 502 }
    );
  }
}
