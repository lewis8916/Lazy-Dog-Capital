"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Hammer, MessageCircleQuestion } from "lucide-react";

const cards = [
  {
    icon: FileText,
    kicker: "The Loan",
    title: "One loan, purchase to finish line",
    desc: "Purchase and rehab funded together, capped at 80% of after-repair value, with staged draws and no prepayment penalty.",
    href: "/loan",
    cta: "See how it works",
  },
  {
    icon: Hammer,
    kicker: "Why Lazy Dog",
    title: "Lenders who've swung the hammer",
    desc: "800+ deals, in-house crews, and 23 years in DFW real estate. We read your project like builders, not bankers.",
    href: "/why",
    cta: "Meet the operators",
  },
  {
    icon: MessageCircleQuestion,
    kicker: "FAQ",
    title: "Every question, answered straight",
    desc: "What it costs, how much you can borrow, how draws release — plain answers with no fine print to decode.",
    href: "/faq",
    cta: "Read the answers",
  },
];

export default function HomeShowcase() {
  return (
    <section className="section bg-cream-light relative overflow-hidden">
      <div className="container-x">
        {/* Section heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="bronze-bar" />
              <span className="eyebrow text-bronze">Start Here</span>
            </div>
            <h2 className="display text-teal text-4xl sm:text-5xl">
              Everything you need to
              <span className="text-bronze italic font-normal"> fund your flip.</span>
            </h2>
          </div>
          <p className="text-teal/70 leading-relaxed max-w-sm">
            Three minutes of reading and you&apos;ll know exactly how we lend,
            who you&apos;re working with, and what happens next.
          </p>
        </div>

        {/* Explore cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href} className="card group flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal/5 group-hover:bg-bronze/10 flex items-center justify-center transition-colors">
                    <Icon
                      size={26}
                      className="text-teal group-hover:text-bronze transition-colors"
                    />
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-teal/30 group-hover:text-bronze group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <div className="eyebrow text-bronze mb-2">{c.kicker}</div>
                <h3 className="display text-teal text-2xl mb-3">{c.title}</h3>
                <p className="text-teal/70 leading-relaxed mb-6 flex-1">{c.desc}</p>
                <span className="inline-flex items-center gap-2 text-bronze font-semibold">
                  {c.cta}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA band */}
        <div
          className="relative overflow-hidden rounded-3xl noise"
          style={{
            background:
              "radial-gradient(ellipse at top right, #2a5249 0%, #1E3C36 55%, #16302B 100%)",
          }}
        >
          <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full border border-bronze/20" />
          <div className="absolute -bottom-32 -left-16 w-[350px] h-[350px] rounded-full bg-bronze/5 blur-3xl" />

          <div className="relative z-10 px-8 py-14 sm:px-14 flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bronze-bar" />
                <span className="eyebrow text-bronze">No Obligation</span>
              </div>
              <h3 className="display text-cream text-3xl sm:text-4xl mb-4">
                Found a house? Let&apos;s talk about it.
              </h3>
              <p className="text-cream/70 text-lg leading-relaxed max-w-xl">
                Bring us the address, the price, and your rehab budget. We&apos;ll
                tell you what we&apos;d lend and what it would cost — it takes
                minutes, and it costs nothing to hear your terms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 flex-shrink-0">
              <Link href="/apply" className="btn-primary justify-center">
                Start Your Application <ArrowRight size={18} />
              </Link>
              <Link href="/faq" className="btn-ghost justify-center">
                Questions first? Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
