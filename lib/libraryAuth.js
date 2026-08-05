// HTTP Basic Auth for the internal document library.
//
// Deliberately a Node route handler rather than middleware: the Edge runtime
// middleware sandbox throws "Code generation from strings disallowed" on newer
// Node versions, which turns every request into a 500. A route handler runs on
// the normal Node runtime and behaves the same everywhere.

const REALM = 'Basic realm="Lazy Dog Capital Library", charset="UTF-8"';

/** Constant-time-ish compare so a wrong password can't be timed out char by char. */
function safeEqual(a, b) {
  const x = String(a ?? "");
  const y = String(b ?? "");
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

export function unauthorized(message = "Authentication required.") {
  return new Response(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, private, max-age=0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

/**
 * Returns null when the request is authorised, or a 401 Response when it isn't.
 * With no credentials configured the library is closed rather than open — a
 * missing env var must never fail into "everyone gets in".
 */
export function checkLibraryAuth(request) {
  const user = process.env.LIBRARY_USER;
  const pass = process.env.LIBRARY_PASS;

  if (!user || !pass) {
    console.error(
      "[library] LIBRARY_USER / LIBRARY_PASS are not set — refusing all requests."
    );
    return new Response("Library is not configured.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store, private, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  const header = request.headers.get("authorization") || "";
  if (!header.toLowerCase().startsWith("basic ")) return unauthorized();

  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6).trim(), "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  // Only split on the first colon — passwords may contain colons.
  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized();

  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), pass);

  // Evaluate both regardless, so failure timing doesn't reveal which was wrong.
  return okUser && okPass ? null : unauthorized("Invalid credentials.");
}
