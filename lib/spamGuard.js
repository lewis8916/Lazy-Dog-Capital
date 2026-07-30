import { NextResponse } from "next/server";

/**
 * Spam protection for the public form endpoints.
 *
 * Two layers:
 *  1. Honeypot — a hidden `website` field. Humans never see it, so anything
 *     that fills it is automated. We return a fake success so the bot has no
 *     signal that it was caught.
 *  2. Rate limit — per-IP sliding window across all forms combined.
 *
 * The limiter is in-memory, so it resets on redeploy and would not be shared
 * across multiple instances. That is fine for a single Node process on
 * Hostinger, and it stops the volumetric abuse we actually care about:
 * a bot draining the Resend quota and burying real applications.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5; // per IP, across all forms
const MAX_TRACKED_IPS = 5000; // bound memory

const hits = new Map(); // ip -> number[] (timestamps)

function clientIp(request) {
  const h = request.headers;
  // Cloudflare sits in front of this site, so cf-connecting-ip is the real
  // client. x-forwarded-for is the fallback; take the first entry.
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimited(ip, now) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Drop stale entries so the map cannot grow without bound.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

/**
 * Returns a Response to send back if the submission should be blocked,
 * or null if it is clean and the caller should carry on.
 */
export function guardRequest(request, data, label = "form") {
  // Honeypot: silently swallow, so scrapers cannot tell they were detected.
  // Field is `ldc_hp`, deliberately not a name browsers autofill — a real
  // applicant whose browser filled in "website" must never be blocked.
  if (String(data?.ldc_hp ?? "").trim()) {
    console.warn(`[${label}] honeypot triggered from ${clientIp(request)}`);
    return NextResponse.json({ ok: true, emailed: false });
  }

  const ip = clientIp(request);
  if (rateLimited(ip, Date.now())) {
    console.warn(`[${label}] rate limited ${ip}`);
    return NextResponse.json(
      {
        error:
          "Too many submissions from this connection. Please wait a few minutes, or call us at 214-740-4989.",
      },
      { status: 429 }
    );
  }

  return null;
}
