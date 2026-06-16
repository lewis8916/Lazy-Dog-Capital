"use client";

import { Quote } from "lucide-react";

const cases = [
  {
    quote:
      "We've closed eleven loans with Lazy Dog over the last two years. They've never blown a closing date, and that's rare in this business.",
    name: "Marcus Reyes",
    role: "Reyes Property Group · Phoenix, AZ",
    metric: { v: "11", l: "Loans funded" },
  },
  {
    quote:
      "Got a term sheet in 90 minutes and wire to title in five days. They saved a deal three other lenders couldn't close.",
    name: "Janelle Park",
    role: "Park Capital Partners · Austin, TX",
    metric: { v: "5 days", l: "Acquisition to close" },
  },
  {
    quote:
      "Their construction draws come out faster than anyone we've used. That's real cash-flow on a 14-unit build.",
    name: "David Mwangi",
    role: "Brick & Beam Builders · Atlanta, GA",
    metric: { v: "$3.4M", l: "Ground-up loan" },
  },
];

export default function Testimonials() {
  return (
    <section className="section bg-cream-light">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="bronze-bar" />
              <span className="eyebrow text-bronze">Case Studies</span>
            </div>
            <h2 className="display text-teal text-4xl sm:text-5xl">
              Trusted by the operators we lend to.
            </h2>
          </div>
          <div className="flex items-center gap-1 text-bronze">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className="text-xl">
                {s}
              </span>
            ))}
            <span className="text-teal/70 text-sm ml-2">4.9 / 5 · 320 reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <article key={c.name} className="card flex flex-col">
              <Quote size={32} className="text-bronze mb-5" />
              <p className="text-teal text-lg leading-relaxed mb-8 flex-1">
                "{c.quote}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-teal/10">
                <div>
                  <div className="font-bold text-teal">{c.name}</div>
                  <div className="text-teal/60 text-xs mt-0.5">{c.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-bronze font-bold text-xl">{c.metric.v}</div>
                  <div className="text-teal/50 text-[10px] tracking-widest uppercase">
                    {c.metric.l}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
