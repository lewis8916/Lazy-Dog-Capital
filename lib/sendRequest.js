import { NextResponse } from "next/server";
import { Resend } from "resend";
import { renderRequestEmail } from "./formEmail.js";
import { validateRequest } from "./requestForms.js";
import { guardRequest } from "./spamGuard.js";

/** Shared handler for the borrower request forms (draw, payoff). */
export async function handleRequest(schema, request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const blocked = guardRequest(request, data, schema.id);
  if (blocked) return blocked;

  const problem = validateRequest(schema, data);
  if (problem) {
    return NextResponse.json({ error: problem }, { status: 400 });
  }

  const { subject, html, text } = renderRequestEmail(schema, data);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLICATION_TO_EMAIL;
  const from = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      `[${schema.id}] RESEND_API_KEY or APPLICATION_TO_EMAIL not set — email not sent.`
    );
    console.log(`[${schema.id}] received:\n` + text);
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

    console.log(`[${schema.id}] emailed ${sent?.id} for ${data.address}`);
    return NextResponse.json({ ok: true, emailed: true });
  } catch (err) {
    console.error(`[${schema.id}] email delivery failed:`, err.message);
    console.log(`[${schema.id}] UNDELIVERED:\n` + text);
    return NextResponse.json(
      {
        error:
          "We could not confirm delivery. Please call us at 214-740-4989 so nothing gets lost.",
      },
      { status: 502 }
    );
  }
}
