"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

// Answers may be a string or an array of paragraphs.
const groups = [
  {
    heading: "Getting Started",
    items: [
      {
        q: "Does it matter how many flips I've done?",
        a: "Not much. Whether this is your first or your fiftieth, what matters is a sound deal and a willingness to do the work. Experienced operators get moved along faster; newer investors get more help pressure-testing the numbers before anyone signs anything.",
      },
      {
        q: "What do you need from me to look at a deal?",
        a: "Eight things, and it takes about two minutes: your name, phone, and email, the property address, the purchase price, your rehab budget, what you think it's worth finished, and how many months you need. We check the numbers and the comps ourselves — that review costs you nothing.",
        cta: { href: "/submit-deal", label: "Submit a deal" },
      },
      {
        q: "How much can I borrow?",
        a: "Up to 80% of the home's after-repair value. We determine that value ourselves from the comps rather than taking a number on faith — sizing the loan conservatively protects you as much as it protects us.",
      },
      {
        q: "How much of my own money do I need?",
        a: "At least 10% of the purchase price as a down payment, plus closing costs. That goes in ahead of any loan money. Some deals need more than 10% — we'll tell you before you sign anything. Your stake in the deal is part of what makes it a good one.",
      },
      {
        q: "What kinds of properties do you lend on?",
        a: "Non-owner-occupied single-family fix & flip projects in Dallas–Fort Worth. These are business-purpose loans for investment property — not loans on a home you plan to live in.",
      },
    ],
  },
  {
    heading: "The Loan",
    items: [
      {
        q: "Does the loan cover the renovation?",
        a: "Yes — one loan funds the purchase and the rehab. Your verified rehab budget is held back at closing and released as the work gets done, so the money for the job is committed before you start.",
      },
      {
        q: "How long is the loan?",
        a: "Up to twelve months to buy it, fix it, and sell it. If you need more time, an extension may be available as long as you're not in default. Ask before the maturity date, not after.",
      },
      {
        q: "What does the loan cost?",
        a: [
          "Rates start at 9.9%, interest only, paid monthly. The principal comes back at payoff.",
          "There are points at closing and a few flat fees, plus the usual third-party costs — title and escrow, lender's title policy, survey, insurance, recording, and document preparation.",
          "No application fee, and nothing buried in the paperwork. Every number appears on your Loan Proposal before you sign anything.",
        ],
      },
      {
        q: "Will you roll the points into the loan?",
        a: "Yes, as long as there's room under the 80% of after-repair value cap. Rolling them in costs half a point more than paying them at closing. Your down payment still comes from you in cash; that part doesn't get financed. Your loan is just a little larger.",
      },
      {
        q: "How is interest calculated?",
        a: "Daily, on the money actually advanced — not on the full loan amount. Interest is figured on a 360-day year for the actual number of days elapsed. Because each draw increases your balance, your payment changes month to month. Your monthly statement always shows the exact amount and the math behind it.",
      },
      {
        q: "When are payments due?",
        a: "The 1st of each month. Late on the 4th, and a late charge applies after the 10th. We don't draft your account — we send a statement a few days before the 1st and you send the payment.",
      },
      {
        q: "Can I pay the loan off early?",
        a: "Any time, with no penalty. Sell in month four instead of month eight and you simply pay less interest.",
      },
      {
        q: "Who owns the property during the loan?",
        a: "You do. Title is in your name and we hold a recorded lien, the same way any mortgage lender does. When you sell, the loan pays off at closing and everything above it is yours.",
      },
    ],
  },
  {
    heading: "During The Project",
    items: [
      {
        q: "How do rehab draws work?",
        a: [
          "Draws are reimbursement. You pay for the work, send a bank or card statement showing the money left your account, and one of us comes out and inspects it in person. Then we reimburse you. Minimum draw is $5,000, and there's no limit on how many you take.",
          "Receipts and invoices alone aren't enough. If you paid cash, we just need to see the withdrawal.",
        ],
        cta: { href: "/resources/draw-request", label: "Request a draw" },
      },
      {
        q: "So I have to pay for the rehab myself first?",
        a: "For each stage, yes — you pay the contractor, then we reimburse you once we've inspected the work. Plan your cash accordingly: you'll need enough on hand to front a stage of work before the draw comes back to you.",
      },
      {
        q: "What if I need money before I've spent anything?",
        a: "Ask. We can sometimes release up to $5,000 up front to get you started. It's case by case, but the answer isn't automatically no.",
      },
      {
        q: "What about the last draw?",
        a: "The final release waits until the project is complete and passes inspection. If you come in under budget, whatever is left in the holdback is still yours to draw at that point.",
      },
      {
        q: "What do I have to keep up with while the loan is open?",
        a: "Keep insurance active with Lazy Dog Capital named as mortgagee and loss payee, and keep property taxes current. If a contractor or supplier ever sends you a lien notice, forward it to us that week — those are much easier to fix early.",
      },
    ],
  },
  {
    heading: "If Things Get Hard",
    items: [
      {
        q: "What if the project takes longer than planned?",
        a: "Talk to us early. We've run hundreds of these projects and would rather help you solve a problem than watch it grow. Interest continues while the loan is open, so speed matters, but a slow month isn't a crisis.",
      },
      {
        q: "What if the budget blows up, or the city shuts me down?",
        a: "Call us. Seriously. We've seen every version of a project going sideways, and we're easier to deal with than you'd expect. What we can't help with is a problem we find out about in month seven.",
      },
      {
        q: "What happens if I really can't finish?",
        a: "You'd get written notice and time to cure before anything else happens. And because we've run hundreds of these projects ourselves, a stalled one usually has more options than you'd think — we'd rather help you find one than watch it sit.",
      },
    ],
  },
];

export default function FAQ() {
  // Composite key so the same index in two groups doesn't collide.
  const [open, setOpen] = useState("0-0");

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

          <div className="md:col-span-8 space-y-12">
            {groups.map((group, gi) => (
              <div key={group.heading}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bronze-bar !w-8" />
                  <h3 className="eyebrow text-bronze">{group.heading}</h3>
                </div>

                <div className="border-t border-teal/15">
                  {group.items.map((f, i) => {
                    const key = `${gi}-${i}`;
                    const isOpen = open === key;
                    const paragraphs = Array.isArray(f.a) ? f.a : [f.a];
                    return (
                      <div key={f.q} className="border-b border-teal/15">
                        <button
                          onClick={() => setOpen(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                        >
                          <span
                            className={`font-semibold text-lg transition-colors ${
                              isOpen
                                ? "text-bronze"
                                : "text-teal group-hover:text-bronze"
                            }`}
                          >
                            {f.q}
                          </span>
                          <span
                            className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                              isOpen
                                ? "bg-bronze text-cream"
                                : "bg-teal/5 text-teal group-hover:bg-bronze group-hover:text-cream"
                            }`}
                          >
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        </button>
                        <div
                          className={`grid transition-all duration-500 ease-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100 pb-6"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            {paragraphs.map((p, pi) => (
                              <p
                                key={pi}
                                className={`text-teal/75 leading-relaxed pr-12 ${
                                  pi > 0 ? "mt-4" : ""
                                }`}
                              >
                                {p}
                              </p>
                            ))}
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
