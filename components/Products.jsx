"use client";

import { Hammer, Building2, Home, Layers, ArrowUpRight } from "lucide-react";

const products = [
  {
    icon: Hammer,
    badge: "Most Popular",
    title: "Fix & Flip",
    range: "$100K – $5M",
    term: "6 – 18 months",
    desc: "Acquisition + rehab capital for residential investors. Up to 90% LTC and 100% of rehab costs.",
    uses: ["Single-family", "2–4 unit", "Light rehab", "Heavy rehab"],
  },
  {
    icon: Building2,
    title: "Ground-Up Construction",
    range: "$500K – $20M",
    term: "12 – 24 months",
    desc: "Build from the dirt up. Draw schedules tailored to your project timeline with fast inspection turnaround.",
    uses: ["SFR builds", "Townhomes", "Small multifamily", "Spec homes"],
  },
  {
    icon: Layers,
    title: "Bridge Loans",
    range: "$250K – $15M",
    term: "6 – 24 months",
    desc: "Short-term capital to close fast, reposition assets, or buy time for permanent financing.",
    uses: ["Value-add", "Acquisition", "Refinance", "Cash-out"],
  },
  {
    icon: Home,
    badge: "30-Yr Term",
    title: "Rental / DSCR",
    range: "$150K – $3M",
    term: "30-year fixed",
    desc: "Long-term rental loans qualified on property cash flow — no tax returns, no W-2s, no income docs.",
    uses: ["Long-term rental", "Short-term rental", "Portfolio loans"],
  },
];

export default function Products() {
  return (
    <section id="products" className="section bg-cream-light relative">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="bronze-bar" />
            <span className="eyebrow text-bronze">Our Products</span>
          </div>
          <h2 className="display text-teal text-4xl sm:text-5xl mb-5">
            Capital built for the way investors actually work.
          </h2>
          <p className="text-teal/70 text-lg leading-relaxed">
            Four core loan products, structured to move at the speed of the deal.
            No bureaucracy, no surprises — just terms you can underwrite against.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.title} className="card group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal/5 group-hover:bg-bronze/10 flex items-center justify-center transition-colors">
                    <Icon size={26} className="text-teal group-hover:text-bronze transition-colors" />
                  </div>
                  {p.badge && (
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-bronze bg-bronze/10 px-3 py-1.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </div>

                <h3 className="display text-teal text-2xl mb-3">{p.title}</h3>
                <p className="text-teal/70 leading-relaxed mb-6">{p.desc}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-teal/10">
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
                      Loan Range
                    </div>
                    <div className="font-bold text-teal">{p.range}</div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-teal/50 mb-1">
                      Term
                    </div>
                    <div className="font-bold text-teal">{p.term}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.uses.map((u) => (
                    <span
                      key={u}
                      className="text-xs px-3 py-1.5 rounded-full bg-teal/5 text-teal/80"
                    >
                      {u}
                    </span>
                  ))}
                </div>

                <a
                  href="#apply"
                  className="inline-flex items-center gap-2 text-bronze font-semibold group/link"
                >
                  Explore product
                  <ArrowUpRight
                    size={18}
                    className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                  />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
