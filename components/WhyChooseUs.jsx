"use client";

import { Zap, Shield, Users, FileCheck, Clock, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Close in 7 Days",
    desc: "Direct lender with in-house capital. No middlemen, no broker delays — just decisions in hours and funds in days.",
  },
  {
    icon: Shield,
    title: "Common-Sense Underwriting",
    desc: "We evaluate the deal, not just the credit score. Strong asset, strong sponsor, strong exit — we'll find a way.",
  },
  {
    icon: Users,
    title: "Real Humans, Real Phones",
    desc: "Every borrower gets a dedicated relationship manager. The person who quotes your deal is the one who closes it.",
  },
  {
    icon: FileCheck,
    title: "Transparent Terms",
    desc: "No junk fees, no rate surprises at the closing table. Term sheets in plain English, signed and honored.",
  },
  {
    icon: Clock,
    title: "Built for Repeat Borrowers",
    desc: "Streamlined re-approval for active investors. Your fifth loan should be easier than your first — and it is.",
  },
  {
    icon: TrendingUp,
    title: "Scale With Confidence",
    desc: "From your first flip to a 50-door portfolio — we grow with you. Volume pricing kicks in earlier than you'd expect.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why"
      className="section relative overflow-hidden noise"
      style={{
        background:
          "linear-gradient(180deg, #21413A 0%, #1a2f29 100%)",
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
            Built by investors. <br />
            Backed by capital. <br />
            <span className="text-bronze italic font-normal">Driven by speed.</span>
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed">
            We started Lazy Dog Capital because we were tired of losing deals to
            slow lenders. Today we fund more than a hundred loans a month — and
            we still answer on the second ring.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10 border border-cream/10 rounded-3xl overflow-hidden">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-teal p-8 group hover:bg-teal-dark transition-colors"
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
