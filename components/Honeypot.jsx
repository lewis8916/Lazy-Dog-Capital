"use client";

/**
 * Hidden field that only automated submitters fill in. Anything arriving with
 * `ldc_hp` set is treated as spam by lib/spamGuard.js.
 *
 * Positioned off-screen rather than `display:none` — some bots skip fields that
 * are explicitly hidden. `tabIndex={-1}` keeps keyboard users from ever landing
 * on it, and the field name is deliberately not one browsers autofill.
 */
export default function Honeypot({ value, onChange }) {
  return (
    <div
      aria-hidden="true"
      className="absolute w-px h-px overflow-hidden"
      style={{ left: "-9999px", top: "auto" }}
    >
      <label htmlFor="ldc_hp">Leave this field empty</label>
      <input
        id="ldc_hp"
        name="ldc_hp"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
