// Single source of truth for deal sizing. Used by the deal calculator, the
// Submit a Deal form, and the notification email so the three cannot drift.

export const parseMoney = (v) =>
  Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

export const formatMoney = (v) => {
  const digits = String(v ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
};

export const usd = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;

export const DOWN_PAYMENT_RATE = 0.1; // borrower brings 10% of purchase price
export const ARV_CAP_RATE = 0.8; // we lend up to 80% of after-repair value

/**
 * The borrower funds 10% of the purchase price, so the loan covers the rest of
 * the purchase plus the full rehab budget. That figure — not the borrower's
 * total project cost — is what gets measured against the 80%-of-ARV cap.
 */
export function computeDeal({ price, rehab, arv }) {
  const p = parseMoney(price);
  const r = parseMoney(rehab);
  const a = parseMoney(arv);

  const down = Math.round(p * DOWN_PAYMENT_RATE);
  const loanNeeded = p - down + r;
  const cap = Math.round(a * ARV_CAP_RATE);
  const totalCost = p + r;
  const spread = a - totalCost;

  return {
    price: p,
    rehab: r,
    arv: a,
    down,
    loanNeeded,
    cap,
    totalCost,
    spread,
    marginPct: a ? Math.round((spread / a) * 100) : 0,
    headroom: cap - loanNeeded,
    inRange: loanNeeded <= cap,
    // Enough entered to say anything meaningful.
    ready: p > 0 && a > 0,
  };
}
