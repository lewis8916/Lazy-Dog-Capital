"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden noise"
      style={{
        background:
          "radial-gradient(ellipse at top left, #2a5249 0%, #1E3C36 45%, #16302B 100%)",
      }}
    >
      {/* Decorative gold rings */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-bronze/15" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-bronze/20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-bronze/5 blur-3xl" />

      <div className="container-x relative z-10 pt-32 pb-24">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 animate-fade-up">
            <div className="flex items-center gap-3 mb-7">
              <span className="bronze-bar" />
              <span className="eyebrow text-bronze">
                Private Capital · Dallas–Fort Worth
              </span>
            </div>

            <h1 className="display text-cream text-5xl sm:text-6xl lg:text-7xl mb-7">
              Your first flip
              <br />
              deserves a lender
              <br />
              <span className="text-bronze italic font-normal">
                who&apos;s done it.
              </span>
            </h1>

            <p className="text-cream/75 text-lg max-w-xl leading-relaxed mb-10">
              Fix &amp; flip capital from people who buy, build, and sell houses
              for a living. One loan covers the purchase and the rehab — and it
              closes at the speed the deal requires.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <Link
                href="/submit-deal"
                className="btn-primary sm:col-span-2 justify-center whitespace-nowrap"
              >
                Submit a Deal <ArrowRight size={18} />
              </Link>
              <Link
                href="/apply"
                className="btn-ghost justify-center whitespace-nowrap !px-5"
              >
                Start Your Application <ArrowRight size={18} />
              </Link>
              <Link
                href="/loan"
                className="btn-ghost justify-center whitespace-nowrap !px-5"
              >
                How the loan works <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust stats — the real ones */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl">
              {[
                { v: "800+", l: "Deals behind us" },
                { v: "23 yrs", l: "In real estate" },
                { v: "DFW", l: "Our home market" },
              ].map((s) => (
                <div key={s.l} className="border-l border-bronze/40 pl-4">
                  <div className="text-cream text-2xl sm:text-3xl font-bold">
                    {s.v}
                  </div>
                  <div className="text-cream/60 text-xs tracking-widest uppercase mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual side card — loan structure, no rates */}
          <div className="md:col-span-5 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-bronze/10 rounded-3xl blur-2xl" />
              <div className="relative bg-cream rounded-3xl p-8 shadow-2xl">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="eyebrow text-bronze">The Structure</div>
                    <div className="text-teal text-2xl font-bold mt-1">
                      How Your Loan Works
                    </div>
                  </div>
                  <img
                    src="/logo_icon.png"
                    alt="Lazy Dog Capital"
                    className="w-12 h-auto"
                  />
                </div>

                <div className="space-y-4">
                  {[
                    ["Covers", "Purchase + full rehab"],
                    ["Loan cap", "80% of after-repair value"],
                    ["You bring", "10%+ down payment", "Based on purchase price"],
                    ["Rehab funds", "Staged draws, as work verifies"],
                    ["Early payoff", "Anytime — no penalty"],
                  ].map(([k, v, note]) => (
                    <div
                      key={k}
                      className="flex justify-between items-center gap-4 pb-3 border-b border-teal/10 last:border-0"
                    >
                      <span className="text-teal/60 text-sm flex-shrink-0">{k}</span>
                      <span className="text-right">
                        <span className="block text-teal font-semibold">{v}</span>
                        {note && (
                          <span className="block text-teal/50 text-xs mt-0.5">
                            {note}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-teal/5">
                  <div className="flex items-center gap-2 text-teal text-sm">
                    <span className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
                    Terms quoted per deal — it costs nothing to hear them
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
