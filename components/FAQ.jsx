"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How fast can you actually close?",
    a: "Our average close is 7 business days from a complete file. We've closed clean deals in 72 hours when title and insurance are pre-ordered. The pace is set by appraisal and title — not by us.",
  },
  {
    q: "What are your minimum credit and experience requirements?",
    a: "We prefer 660+ FICO for fix-and-flip and bridge products, but we lend below that with stronger asset coverage. First-time investors are welcome; we just structure the deal accordingly (typically lower LTC and a stricter rehab budget).",
  },
  {
    q: "Do you lend in every state?",
    a: "We currently lend in 42 states. Excluded: AK, HI, MN, ND, NV, SD, UT, VT. DSCR rental loans are available in all 50 states.",
  },
  {
    q: "What documentation do you need to issue a term sheet?",
    a: "For an indicative term sheet: property address, purchase price, rehab budget, ARV estimate, and a one-page sponsor bio. We turn most term sheets in 4 business hours.",
  },
  {
    q: "Are there prepayment penalties?",
    a: "Short-term bridge and fix-and-flip loans have no prepay. DSCR 30-year loans default to a 3-2-1 step-down, with buy-down options at pricing.",
  },
  {
    q: "How are your rehab draws handled?",
    a: "Draws are reimbursement-based and released within 48 hours of inspection. We use third-party inspectors with a $250 flat fee per draw — no junk lender fees on top.",
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
                <span className="eyebrow text-bronze">FAQ</span>
              </div>
              <h2 className="display text-teal text-4xl sm:text-5xl mb-5">
                Straight answers.
              </h2>
              <p className="text-teal/70 leading-relaxed">
                If your question isn't here, call a loan officer directly. We'd
                rather have a 10-minute conversation than send you a 30-page PDF.
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
