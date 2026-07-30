import { NextResponse } from "next/server";

// TEMPORARY DIAGNOSTIC — remove once the Resend env vars are confirmed working.
// Reports only whether variables are visible to the running process. Never
// returns a value, so the API key cannot leak through this endpoint.

export const dynamic = "force-dynamic"; // must evaluate at request time, not build time

const TOKEN = "ldc-envcheck-7f3a";

const WATCHED = [
  "RESEND_API_KEY",
  "APPLICATION_TO_EMAIL",
  "APPLICATION_FROM_EMAIL",
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("token") !== TOKEN) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const report = {};
  for (const name of WATCHED) {
    const raw = process.env[name];
    report[name] = {
      present: typeof raw === "string",
      length: typeof raw === "string" ? raw.length : 0,
      blank: typeof raw === "string" && raw.trim() === "",
      padded: typeof raw === "string" && raw !== raw.trim(),
    };
  }

  // Surface any similarly-named vars so a typo (RESEND_APIKEY, APPLICATION_EMAIL,
  // stray whitespace in the key) shows up instead of staying invisible.
  const related = Object.keys(process.env)
    .filter((k) => /RESEND|APPLICATION|EMAIL|SMTP|MAIL/i.test(k))
    .sort();

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV ?? null,
    report,
    relatedEnvNames: related,
    totalEnvCount: Object.keys(process.env).length,
  });
}
