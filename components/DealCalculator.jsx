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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <div className="bg-cream rounded-3xl p-7 shadow-xl border border-teal/5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="bronze-bar !w-8" />
                <h3 className="eyebrow text-bronze">The Numbers</h3>
              </div>
              {dirty && (
                <button
                  type="button"
                  onClick={() => setForm(initial)}
                  className="text-teal/40 hover:text-bronze transition-colors"
                  aria-label="Reset calculator"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>

            <div className="space-y-5">
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
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {!d.ready ? (
            <div className="h-full min-h-[380px] rounded-3xl border-2 border-dashed border-teal/15 flex items-center justify-center p-10 text-center">
              <div>
                <div className="text-teal/30 text-5xl font-bold mb-4">$</div>
                <p className="text-teal/50 leading-relaxed max-w-xs">
                  Enter a purchase price and what the house is worth finished.
                  The numbers update as you type.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Headline verdict */}
              <div
                className="relative overflow-hidden rounded-3xl noise p-8"
                style={{
                  background:
                    "radial-gradient(ellipse at top right, #2a5249 0%, #1E3C36 55%, #16302B 100%)",
                }}
              >
                <div className="absolute -top-20 -right-20 w-[240px] h-[240px] rounded-full border border-bronze/20" />
                <div className="relative z-10">
                  <div className="eyebrow text-bronze mb-3">Rough Fit</div>
                  <div
                    className={`display text-4xl sm:text-5xl mb-3 ${
                      d.inRange ? "text-cream" : "text-bronze"
                    }`}
                  >
                    {d.inRange ? "In range." : "Tight."}
                  </div>
                  <p className="text-cream/70 leading-relaxed max-w-md">
                    The loan you&apos;d need is{" "}
                    <strong className="text-cream">
                      {usd(Math.abs(d.headroom))}
                    </strong>{" "}
                    {d.inRange ? "under" : "over"} 80% of your after-repair value.
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-cream rounded-3xl p-7 shadow-xl border border-teal/5">
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <Stat label="Your 10% down" value={usd(d.down)} />
                  <Stat label="Loan you'd need" value={usd(d.loanNeeded)} accent />
                  <Stat label="80% of your ARV" value={usd(d.cap)} />
                  <Stat
                    label={d.inRange ? "Room to spare" : "Over by"}
                    value={usd(Math.abs(d.headroom))}
                    tone={d.inRange ? "good" : "warn"}
                  />
                </div>

                <div className="pt-6 border-t border-teal/10 grid grid-cols-2 gap-5">
                  <Stat label="Total project cost" value={usd(d.totalCost)} />
                  <Stat
                    label="Spread over cost"
                    value={`${usd(d.spread)}${
                      d.arv ? ` · ${d.marginPct}%` : ""
                    }`}
                    tone={d.spread > 0 ? "good" : "warn"}
                  />
                </div>

                <div className="mt-6 pt-5 border-t border-teal/10">
                  <p className="text-bronze font-bold text-base sm:text-lg leading-snug">
                    Tight doesn&apos;t mean no — we make tight deals work.
                  </p>
                  <p className="text-teal/50 text-xs mt-2 leading-relaxed">
                    A rough guide only. We size every loan on our own review of the
                    property and the comps — send it either way.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/submit-deal" className="btn-primary">
                  Submit this deal <ArrowRight size={18} />
                </Link>
                <Link
                  href="/faq"
                  className="text-bronze font-semibold hover:underline"
                >
                  How we size loans
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
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
