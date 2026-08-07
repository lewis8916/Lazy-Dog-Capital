// Shared client-side submit helper.
//
// A failing request does not always return JSON. When the Node app dies or a
// proxy steps in, the body is an HTML error page, and calling res.json() on it
// throws "Unexpected token '<'" — which is what the borrower ends up reading.
// This turns any non-JSON failure into a sentence a person can act on.

const FALLBACK =
  "Something went wrong on our end and your details may not have reached us. Please call 214-740-4989 so we don't lose your deal.";

export async function submitForm(endpoint, payload) {
  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network dropped, offline, request blocked.
    throw new Error(
      "We couldn't reach our server. Check your connection, or call 214-740-4989."
    );
  }

  // Read as text first — the body may not be JSON at all.
  const raw = await res.text().catch(() => "");
  let body = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    // Prefer the server's own message; never surface a parse error or raw HTML.
    throw new Error(body?.error || FALLBACK);
  }

  return body ?? {};
}
