import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateDraw } from "@/lib/requestForms";
import { renderDrawEmail } from "@/lib/drawEmail";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const problem = validateDraw(data);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const { subject, html, text } = renderDrawEmail(data);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLICATION_TO_EMAIL;
  const from = process.env.APPLICATION_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      "[draw-request] RESEND_API_KEY or APPLICATION_TO_EMAIL not set — email not sent."
    );
    console.log("[draw-request] received:\n" + text);
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
      attachments: (data.attachments || []).map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    if (error) throw new Error(error.message || "Resend rejected the message");

    console.log(
      `[draw-request] emailed ${sent?.id} — draw #${data.draw_no} for ${data.property}` +
        ` (${(data.attachments || []).length} attachments)`
    );
    return NextResponse.json({ ok: true, emailed: true });
  } catch (err) {
    console.error("[draw-request] email delivery failed:", err.message);
    console.log("[draw-request] UNDELIVERED:\n" + text);
    return NextResponse.json(
      {
        error:
          "We could not confirm delivery. Please call us at 214-740-4989 so nothing gets lost.",
      },
      { status: 502 }
    );
  }
}
