"use client";

import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden noise"
      style={{
        background:
          "radial-gradient(ellipse at top left, #2a5249 0%, #21413A 45%, #1a2f29 100%)",
      }}
    >
      {/* Decorative gold rings */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-bronze/15" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-bronze/20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-bronze/5 blur-3xl" />

      <div className="container-x relative z-10 pt-32 pb-20">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 animate-fade-up">
            <div className="flex items-center gap-3 mb-7">
              <span className="bronze-bar" />
              <span className="eyebrow text-bronze">Private Capital · Est. 2018</span>
            </div>

            <h1 className="display text-cream text-5xl sm:text-6xl lg:text-7xl mb-7">
              Hard Money
              <br />
              Lending
              <span className="text-bronze italic font-normal"> Made </span>
              Simple.
            </h1>

            <p className="text-cream/75 text-lg max-w-xl leading-relaxed mb-10">
              Fast, flexible financing for real estate investors. Close in as little
              as 7 days with transparent terms, common-sense underwriting, and a
              team that picks up the phone.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#apply" className="btn-primary">
                Start Your Application <ArrowRight size={18} />
              </a>
              <a href="tel:+18005551234" className="btn-ghost">
                <Phone size={16} /> (800) 555-1234
              </a>
            </div>

            {/* Trust stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl">
              {[
                { v: "$420M+", l: "Funded" },
                { v: "1,800+", l: "Loans Closed" },
                { v: "7 Days", l: "Avg. Close" },
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

          {/* Visual side card */}
          <div className="md:col-span-5 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-bronze/10 rounded-3xl blur-2xl" />
              <div className="relative bg-cream rounded-3xl p-8 shadow-2xl">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="eyebrow text-bronze">Quick Estimate</div>
                    <div className="text-teal text-2xl font-bold mt-1">
                      Loan Snapshot
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-bronze flex items-center justify-center text-cream font-bold">
                    LD
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Loan Amount", "$485,000"],
                    ["Property Type", "Fix & Flip — SFR"],
                    ["Term", "12 months"],
                    ["Rate (from)", "9.99%"],
                    ["LTV", "Up to 75%"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between items-center pb-3 border-b border-teal/10 last:border-0"
                    >
                      <span className="text-teal/60 text-sm">{k}</span>
                      <span className="text-teal font-semibold">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-teal/5">
                  <div className="flex items-center gap-2 text-teal text-sm">
                    <span className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
                    Pre-qualification in under 5 minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/40 text-xs tracking-widest">
        <div className="flex flex-col items-center gap-2">
          <span>SCROLL</span>
          <span className="w-px h-10 bg-gradient-to-b from-bronze to-transparent" />
        </div>
      </div>
    </section>
  );
}
