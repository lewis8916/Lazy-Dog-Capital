// Writes deal submissions to the Prospects table.
//
// Secondary destination by design: the notification email is what must not be
// lost. Every function here swallows its own errors and reports back rather
// than throwing, so a bad token or a schema change can never cost us a lead.

import { parseMoney } from "./dealMath.js";

const TABLE = "tblEad66cDnriv1UN"; // Prospects

// Formula fields on the table — Airtable computes these and rejects any write:
// Loan Amount, Down Payment, Disbursed at Closing, Holdback, Fits.
// Never add them here.

/** Airtable date field, written as YYYY-MM-DD. */
function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Money arrives as "310,000" or "$310,000" — Airtable needs a number. */
function money(v) {
  const n = parseMoney(v);
  return n > 0 ? n : undefined;
}

function whole(v) {
  const n = Number(String(v ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Drop keys with undefined values so we never send empty cells. */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")
  );
}

export function buildProspectFields(d) {
  return compact({
    "Property Address": String(d.address ?? "").trim() || undefined,
    "Contact Name": String(d.name ?? "").trim() || undefined,
    Phone: String(d.phone ?? "").trim() || undefined,
    Email: String(d.email ?? "").trim() || undefined,
    "Purchase Price": money(d.price),
    "Rehab Budget": money(d.rehab),
    ARV: money(d.arv),
    "Months to Complete": whole(d.months),
    Submitted: today(),
    Status: "New",
  });
}

/**
 * Best-effort write. Never throws — returns a result object instead.
 */
export async function createProspect(data) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    console.warn(
      "[airtable] AIRTABLE_TOKEN or AIRTABLE_BASE_ID not set — skipping record."
    );
    return { ok: false, reason: "not configured" };
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [{ fields: buildProspectFields(data) }],
          // Lets Airtable coerce the Status string onto the select option.
          typecast: true,
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`${res.status} ${res.statusText} — ${body.slice(0, 300)}`);
    }

    const json = await res.json();
    const id = json?.records?.[0]?.id;
    console.log(`[airtable] created prospect ${id} for ${data.address}`);
    return { ok: true, id };
  } catch (err) {
    // "fetch failed" on its own says nothing — the useful detail is in cause.
    const detail = err?.cause?.message ? ` (${err.cause.message})` : "";
    console.error(
      `[airtable] could not create prospect: ${err.message}${detail}`
    );
    // Logged loudly, but never rethrown — the lead still reaches the inbox.
    return { ok: false, reason: `${err.message}${detail}` };
  }
}
