import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderContactEmail } from "@/lib/contactEmail";
import { guardRequest } from "@/lib/spamGuard";
import { sendAutoReply } from "@/lib/autoReply";

const REQUIRED = ["name", "phone", "email", "message"];

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const blocked = guardRequest(request, data, "contact");
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

  const { subject, html, text } = renderContactEmail(data);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLICATION_TO_EMAIL;
  const from = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      "[contact] RESEND_API_KEY or APPLICATION_TO_EMAIL not set — email not sent."
    );
    console.log("[contact] message received:\n" + text);
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

    console.log(`[contact] emailed message ${sent?.id} from ${data.name}`);

    // Acknowledge to the sender. Best-effort — never fails the submission.
    const ack = await sendAutoReply("contact", data, data.email);

    return NextResponse.json({ ok: true, emailed: true, acknowledged: ack.sent });
  } catch (err) {
    console.error("[contact] email delivery failed:", err.message);
    console.log("[contact] UNDELIVERED message:\n" + text);
    return NextResponse.json(
      {
        error:
          "We could not confirm your message was delivered. Please call us at 214-740-4989 so nothing gets lost.",
      },
      { status: 502 }
    );
  }
}
