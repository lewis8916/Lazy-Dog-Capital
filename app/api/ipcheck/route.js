import { NextResponse } from "next/server";

// TEMPORARY DIAGNOSTIC — remove once per-IP rate limiting is confirmed working.
// Reports which proxy headers Hostinger/Cloudflare actually pass through, so
// the rate limiter can key on a real client identifier instead of failing open.

export const dynamic = "force-dynamic";

const TOKEN = "ldc-ipcheck-7f3a";

const CANDIDATES = [
  "cf-connecting-ip",
  "x-forwarded-for",
  "x-real-ip",
  "true-client-ip",
  "x-client-ip",
  "forwarded",
  "cf-ray",
  "x-forwarded-host",
  "x-forwarded-proto",
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("token") !== TOKEN) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const present = {};
  for (const name of CANDIDATES) {
    const v = request.headers.get(name);
    if (v) present[name] = v;
  }

  return NextResponse.json({
    ipHeadersPresent: present,
    allHeaderNames: [...request.headers.keys()].sort(),
  });
}
