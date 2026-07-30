"use client";

import { Hammer, Eye, HandCoins, MapPin, Sprout } from "lucide-react";

const benefits = [
  {
    icon: Hammer,
    title: "Operators, Not Spreadsheets",
    desc: "800+ transactions across flips, sales, construction, rehabs, and remodels. We read your project the way a builder does — not the way a bank's software does.",
  },
  {
    icon: Eye,
    title: "Experienced Eyes on Your Deal",
    desc: "We evaluate every deal as operators, so we can flag problems in scope, budget, or resale value before they become expensive lessons.",
  },
  {
    icon: HandCoins,
    title: "Our Own Money in Every Deal",
    desc: "We put our own capital into every loan we fund. When your flip succeeds, we succeed — that's the business model, not a favor.",
  },
  {
    icon: Sprout,
    title: "Built for First-Timers",
    desc: "New to flipping? That's fine. What matters is a sound deal and a willingness to do the work — we'll help you pressure-test the rest.",
  },
  {
    icon: MapPin,
    title: "DFW, Street by Street",
    desc: "Dallas–Fort Worth is our backyard. We know the neighborhoods, the buyers, and what a finished house should sell for.",
  },
];

export default function WhyChooseUs({ standalone = false }) {
  return (
    <section
      id="why"
      className={`section relative overflow-hidden noise ${
        standalone ? "pt-40" : ""
      }`}
      style={{
        background: "linear-gradient(180deg, #1E3C36 0%, #16302B 100%)",
      }}
    >
      <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-bronze/5 blur-3xl" />

      <div className="container-x relative z-10">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="bronze-bar" />
            <span className="eyebrow text-bronze">Why Lazy Dog</span>
          </div>
          <h2 className="display text-cream text-4xl sm:text-5xl mb-5">
            Built by builders. <br />
            Backed by our own capital. <br />
            <span className="text-bronze italic font-normal">
              Invested in your finish line.
            </span>
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed">
            Lazy Dog Capital is run by two Dallas–Fort Worth investors —
            Lewis McKnight and Stephen Maner — with 800+ deals and 23 years
            in this market behind them.
            Plenty of lenders will run your deal through a spreadsheet.
            We&apos;ve spent decades doing exactly what you&apos;re about to do.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10 border border-cream/10 rounded-3xl overflow-hidden">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            // Odd card count would leave a hole in the last row — let the final
            // card widen to close it.
            const fillsRow = i === benefits.length - 1 && benefits.length % 2 !== 0;
            return (
              <div
                key={b.title}
                className={`bg-teal p-8 group hover:bg-teal-dark transition-colors ${
                  fillsRow ? "md:col-span-2" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center mb-5 group-hover:bg-bronze/20 transition-colors">
                  <Icon size={22} className="text-bronze" />
                </div>
                <h3 className="display text-cream text-xl mb-3">{b.title}</h3>
                <p className="text-cream/70 leading-relaxed text-[15px]">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
