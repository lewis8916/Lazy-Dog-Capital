"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Does it matter how many flips I've done?",
    a: "Not much. Whether this is your first or your fiftieth, what matters is a sound deal and a willingness to do the work. Experienced operators get moved along faster; newer investors get more help pressure-testing the numbers before anyone signs anything.",
  },
  {
    q: "How much can I borrow?",
    a: "The lower of two numbers: 80% of the home's after-repair value, or the purchase price minus your down payment, plus the rehab budget and a 10% buffer on it. Sizing the loan conservatively protects you as much as it protects us.",
  },
  {
    q: "What does the loan cost?",
    a: "Rate and points are set deal by deal and quoted plainly before you commit — and it costs nothing to hear them. You pay interest monthly, and the principal comes back at payoff.",
  },
  {
    q: "Will you roll in the points on the loan?",
    a: "Yes — we'll roll the points into the loan, as long as there's room under our 80% of after-repair value cap. Rolling them in costs a quarter point more than paying them at closing. Your 10% down payment still has to come from you in cash on the purchase price; that part doesn't get financed. Your loan is just a little larger.",
  },
  {
    q: "What do you need from me to look at a deal?",
    a: "Four things: the property address, the purchase price, your rehab scope and budget, and what you believe it's worth finished. We'll check the numbers and the comps ourselves.",
    cta: { href: "/submit-deal", label: "Submit a deal" },
  },
  {
    q: "How do rehab draws work?",
    a: "Finish a stage of work, we verify it, the money for it releases — in up to five draws across the project. It keeps cash flowing to the job and the budget honest.",
  },
  {
    q: "Can I pay the loan off early?",
    a: "Any time, with no penalty. Sell in month four instead of month eight and you simply pay less interest.",
  },
  {
    q: "What kinds of properties do you lend on?",
    a: "Non-owner-occupied single-family fix & flip projects in Dallas–Fort Worth. These are business-purpose loans for investment property — not loans on a home you plan to live in.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section bg-cream-light">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <div className="flex items-center gap-3 mb-5">
                <span className="bronze-bar" />
                <span className="eyebrow text-bronze">Common Questions</span>
              </div>
              <h2 className="display text-teal text-4xl sm:text-5xl mb-5">
                Ask us anything.
              </h2>
              <p className="text-teal/70 leading-relaxed">
                If your question isn&apos;t here, just call us. We&apos;d rather
                have a ten-minute conversation than send you a thirty-page PDF.
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="border-t border-teal/15">
              {faqs.map((f, i) => (
                <div key={f.q} className="border-b border-teal/15">
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  >
                    <span className="text-teal font-semibold text-lg group-hover:text-bronze transition-colors">
                      {f.q}
                    </span>
                    <span className="w-9 h-9 flex-shrink-0 rounded-full bg-teal/5 flex items-center justify-center text-teal group-hover:bg-bronze group-hover:text-cream transition-colors">
                      {open === i ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      open === i
                        ? "grid-rows-[1fr] opacity-100 pb-6"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-teal/75 leading-relaxed pr-12">{f.a}</p>
                      {f.cta && (
                        <Link
                          href={f.cta.href}
                          className="group/cta inline-flex items-center gap-2 mt-4 text-bronze font-semibold hover:underline"
                        >
                          {f.cta.label}
                          <ArrowRight
                            size={16}
                            className="group-hover/cta:translate-x-0.5 transition-transform"
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
