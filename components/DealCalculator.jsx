"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { computeDeal, formatMoney, usd } from "@/lib/dealMath";

const initial = { price: "", rehab: "", arv: "", months: "" };

export default function DealCalculator() {
  const [form, setForm] = useState(initial);

  const set = (k) => (e) => {
    const raw = e.target.value;
    const v = ["price", "rehab", "arv"].includes(k) ? formatMoney(raw) : raw;
    setForm((s) => ({ ...s, [k]: v }));
  };

  const d = computeDeal(form);
  const dirty = Object.values(form).some((v) => String(v).trim() !== "");

  // Carry the numbers over so Submit a Deal only needs their contact details.
  // Deal figures only — nothing personally identifying goes in the URL.
  const handoff = new URLSearchParams();
  if (d.price) handoff.set("price", String(d.price));
  if (d.rehab) handoff.set("rehab", String(d.rehab));
  if (d.arv) handoff.set("arv", String(d.arv));
  if (String(form.months).trim()) handoff.set("months", String(form.months).trim());
  const submitHref = `/submit-deal?${handoff.toString()}`;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Inputs — one full-width band, fields side by side */}
      <div className="bg-cream rounded-3xl p-7 sm:p-8 shadow-xl border border-teal/5">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <span className="bronze-bar !w-8" />
            <h3 className="eyebrow text-bronze">The Numbers</h3>
          </div>
          {dirty && (
            <button
              type="button"
              onClick={() => setForm(initial)}
              className="inline-flex items-center gap-2 text-teal/40 hover:text-bronze transition-colors text-xs font-semibold uppercase tracking-widest"
              aria-label="Reset calculator"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
          <Field
            label="Purchase price"
            money
            value={form.price}
            onChange={set("price")}
            placeholder="310,000"
          />
          <Field
            label="Rehab budget"
            money
            value={form.rehab}
            onChange={set("rehab")}
            placeholder="78,000"
          />
          <Field
            label="Value after repairs"
            hint="What it sells for finished"
            money
            value={form.arv}
            onChange={set("arv")}
            placeholder="465,000"
          />
          <Field
            label="Months to complete"
            type="number"
            value={form.months}
            onChange={set("months")}
            placeholder="5"
          />
        </div>
      </div>

      {!d.ready ? (
        <div className="rounded-3xl border-2 border-dashed border-teal/15 flex items-center justify-center py-16 px-10 text-center">
          <div>
            <div className="text-teal/25 text-5xl font-bold mb-4">$</div>
            <p className="text-teal/50 leading-relaxed max-w-sm">
              Enter a purchase price and what the house is worth finished. The
              numbers update as you type.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Verdict — full-width band */}
          <div
            className="relative overflow-hidden rounded-3xl noise p-8 sm:px-10 sm:py-9"
            style={{
              background:
                "radial-gradient(ellipse at top right, #2a5249 0%, #1E3C36 55%, #16302B 100%)",
            }}
          >
            <div className="absolute -top-24 -right-16 w-[280px] h-[280px] rounded-full border border-bronze/20" />
            <div className="absolute -bottom-32 -left-10 w-[300px] h-[300px] rounded-full bg-bronze/5 blur-3xl" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="eyebrow text-bronze mb-3">Rough Fit</div>
                <div
                  className={`display text-4xl sm:text-5xl ${
                    d.inRange ? "text-cream" : "text-bronze"
                  }`}
                >
                  {d.inRange ? "In range." : "Tight."}
                </div>
              </div>
              <p className="text-cream/70 leading-relaxed sm:text-right sm:max-w-xs">
                The loan you&apos;d need is{" "}
                <strong className="text-cream">{usd(Math.abs(d.headroom))}</strong>{" "}
                {d.inRange ? "under" : "over"} 80% of your after-repair value.
              </p>
            </div>
          </div>

          {/* Breakdown — the sizing ladder, then the borrower's own numbers */}
          <div className="bg-cream rounded-3xl p-7 sm:p-8 shadow-xl border border-teal/5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-7">
              <Stat label="Your 10% down" value={usd(d.down)} />
              <Stat label="Loan you'd need" value={usd(d.loanNeeded)} accent />
              <Stat label="80% of your ARV" value={usd(d.cap)} />
              <Stat
                label={d.inRange ? "Room to spare" : "Over by"}
                value={usd(Math.abs(d.headroom))}
                tone={d.inRange ? "good" : "warn"}
              />
              <Stat label="Total project cost" value={usd(d.totalCost)} />
              <Stat
                label="Spread over cost"
                value={`${usd(d.spread)}${d.arv ? ` · ${d.marginPct}%` : ""}`}
                tone={d.spread > 0 ? "good" : "warn"}
              />
            </div>

            <div className="mt-7 pt-6 border-t border-teal/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-bronze font-bold text-base sm:text-lg leading-snug">
                  Tight doesn&apos;t mean no — we make tight deals work.
                </p>
                <p className="text-teal/50 text-xs mt-2 leading-relaxed max-w-xl">
                  A rough guide only. We size every loan on our own review of the
                  property and the comps — send it either way.
                </p>
              </div>
              <Link
                href={submitHref}
                className="btn-primary flex-shrink-0 whitespace-nowrap"
              >
                Submit this deal <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent, tone }) {
  const color =
    tone === "good"
      ? "text-bronze"
      : tone === "warn"
        ? "text-red-600"
        : "text-teal";
  return (
    <div>
      <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
        {label}
      </div>
      <div className={`font-bold ${accent ? "text-2xl" : "text-xl"} ${color}`}>
        {value}
      </div>
    </div>
  );
}

function Field({ label, hint, type = "text", money, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-teal/60 mb-2">
        {label}
        {hint && (
          <span className="block normal-case tracking-normal text-[11px] text-teal/45 font-normal mt-0.5">
            {hint}
          </span>
        )}
      </label>
      <div className="relative">
        {money && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal/40">
            $
          </span>
        )}
        <input
          type={money ? "text" : type}
          inputMode={money ? "numeric" : undefined}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-3.5 rounded-xl border border-teal/15 bg-cream-light text-teal placeholder:text-teal/40 focus:outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20 transition ${
            money ? "pl-9 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}
