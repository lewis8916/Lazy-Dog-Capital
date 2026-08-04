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
const MAX_PER_WINDOW = 10; // per IP, across all forms — generous for a human
                           // who resubmits after validation errors, still far
                           // below what an abusive script would attempt
const MAX_TRACKED_IPS = 5000; // bound memory

const hits = new Map(); // ip -> number[] (timestamps)

const IP_HEADERS = [
  "cf-connecting-ip", // Cloudflare fronts this site — most reliable when present
  "x-forwarded-for", // may be a comma-separated chain; the client is first
  "x-real-ip",
  "true-client-ip",
  "x-client-ip",
  "forwarded",
];

/**
 * Returns the caller's IP, or null if no proxy header identifies them.
 *
 * Returning null matters: an earlier version fell back to the string "unknown",
 * which keyed every visitor to the *same* bucket, so five submissions site-wide
 * locked out everybody. Callers must treat null as "cannot rate limit" and let
 * the request through rather than sharing a bucket.
 */
export function clientIp(request) {
  for (const name of IP_HEADERS) {
    const raw = request.headers.get(name);
    if (!raw) continue;
    const first = raw.split(",")[0].trim();
    if (first) return first;
  }
  return null;
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
  // Honeypot: LOG ONLY — deliberately does not block.
  //
  // It previously returned a fake success, which silently discarded a real
  // submission when a password manager or browser autofill populated the hidden
  // field. Losing one loan application costs far more than the spam this
  // stops, and the failure is invisible to both sides: the sender sees success
  // and nothing arrives. Rate limiting below is the real protection.
  if (String(data?.ldc_hp ?? "").trim()) {
    console.warn(
      `[${label}] honeypot field was filled by ${clientIp(request) ?? "unknown"} — allowing through anyway`
    );
  }

  const ip = clientIp(request);

  // Fail open. If we cannot tell callers apart, rate limiting would either do
  // nothing or — worse — block every visitor at once. The honeypot above still
  // applies, and blocking a real loan application is far costlier than spam.
  if (!ip) {
    console.warn(`[${label}] no client IP header present — rate limit skipped`);
    return null;
  }

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
