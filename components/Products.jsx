"use client";

import { Home, Layers, ClipboardCheck, Landmark, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Home,
    badge: "One Loan",
    title: "Purchase + Rehab Together",
    desc: "One loan funds buying the house and renovating it. Your rehab budget — plus a 10% buffer — is committed at closing, so you're never scrambling to fund the work out of pocket.",
    points: ["Single-family fix & flip", "Dallas–Fort Worth", "First-timers welcome"],
  },
  {
    icon: Landmark,
    title: "Sized Conservatively",
    desc: "Every loan is capped at 80% of the home's after-repair value — or your actual cost basis, whichever is lower. Conservative sizing protects your margin as much as our capital.",
    points: ["80% of ARV max", "10%+ down payment", "We verify the comps"],
  },
  {
    icon: ClipboardCheck,
    title: "Staged Rehab Draws",
    desc: "Renovation money releases as completed work is verified — in up to five draws across the project. It keeps cash flowing to the job and the budget honest.",
    points: ["Up to 5 draws", "Fast verification", "Builder-run inspections"],
  },
  {
    icon: Layers,
    badge: "No Penalty",
    title: "Close Fast, Exit Free",
    desc: "Loans close at a title company, cleanly and on record — in days, not months. Pay off any time with no prepayment penalty; sell early and you simply pay less interest.",
    points: ["Days to close", "Recorded at title", "Payable anytime"],
  },
];

export default function Products() {
  return (
    <section id="loan" className="section bg-cream-light relative">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="bronze-bar" />
            <span className="eyebrow text-bronze">How It Works</span>
          </div>
          <h2 className="display text-teal text-4xl sm:text-5xl mb-5">
            Built the way a flip actually works.
          </h2>
          <p className="text-teal/70 text-lg leading-relaxed">
            We do one thing: short-term loans for fix &amp; flip projects in
            Dallas–Fort Worth. No bureaucracy, no surprises — a structure you can
            underwrite your deal against before you ever call us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.title} className="card group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal/5 group-hover:bg-bronze/10 flex items-center justify-center transition-colors">
                    <Icon
                      size={26}
                      className="text-teal group-hover:text-bronze transition-colors"
                    />
                  </div>
                  {p.badge && (
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-bronze bg-bronze/10 px-3 py-1.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </div>

                <h3 className="display text-teal text-2xl mb-3">{p.title}</h3>
                <p className="text-teal/70 leading-relaxed mb-6">{p.desc}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.points.map((u) => (
                    <span
                      key={u}
                      className="text-xs px-3 py-1.5 rounded-full bg-teal/5 text-teal/80"
                    >
                      {u}
                    </span>
                  ))}
                </div>

                <a
                  href="/apply"
                  className="inline-flex items-center gap-2 text-bronze font-semibold group/link"
                >
                  Bring us your deal
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
