import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  ArrowUpRight,
  ClipboardCheck,
  Banknote,
  FileText,
  Calculator,
  Home,
} from "lucide-react";

export const metadata = {
  title: "Forms",
  description:
    "Every Lazy Dog Capital form in one place: draw requests, payoff requests, the loan application, and the deal calculator.",
};

const GROUPS = [
  {
    heading: "During Your Loan",
    blurb: "For borrowers with a loan already in place.",
    items: [
      {
        icon: ClipboardCheck,
        title: "Draw Request",
        desc: "Finished some line items and paid for them? Request a draw and we'll reimburse you after we've seen the work.",
        href: "/resources/draw-request",
      },
      {
        icon: Banknote,
        title: "Payoff Request",
        desc: "Selling or refinancing? Request a payoff statement and we'll send figures to your title company.",
        href: "/resources/payoff-request",
      },
    ],
  },
  {
    heading: "Before You Borrow",
    blurb: "For anyone sizing up a deal or getting started.",
    items: [
      {
        icon: Calculator,
        title: "Deal Calculator",
        desc: "Run purchase price, rehab budget, and ARV to see roughly where a deal lands. Nothing is sent.",
        href: "/deal-calculator",
      },
      {
        icon: Home,
        title: "Submit a Deal",
        desc: "Send us the numbers and the address. We'll tell you what we'd lend and what it would cost.",
        href: "/submit-deal",
      },
      {
        icon: FileText,
        title: "Loan Application",
        desc: "The full application — entity, principals, the deal, and declarations. Four short steps.",
        href: "/apply",
      },
    ],
  },
];

export default function FormsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Forms."
        blurb="Everything you might need to send us, in one place. If you can't find what you're looking for, just call — 214-740-4989."
      />
      <section className="section bg-cream-light">
        <div className="container-x">
          <div className="max-w-4xl mx-auto space-y-14">
            {GROUPS.map((group) => (
              <div key={group.heading}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bronze-bar !w-8" />
                  <h2 className="eyebrow text-bronze">{group.heading}</h2>
                </div>
                <p className="text-teal/60 text-sm mb-7">{group.blurb}</p>

                <div className="grid md:grid-cols-2 gap-5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="card group flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-13 h-13 p-3.5 rounded-2xl bg-teal/5 group-hover:bg-bronze/10 transition-colors">
                            <Icon
                              size={22}
                              className="text-teal group-hover:text-bronze transition-colors"
                            />
                          </div>
                          <ArrowUpRight
                            size={20}
                            className="text-teal/30 group-hover:text-bronze group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                          />
                        </div>
                        <h3 className="display text-teal text-xl mb-2">
                          {item.title}
                        </h3>
                        <p className="text-teal/70 leading-relaxed text-[15px]">
                          {item.desc}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div
              className="relative overflow-hidden rounded-3xl noise p-8 sm:px-10 sm:py-9"
              style={{
                background:
                  "radial-gradient(ellipse at top right, #2a5249 0%, #1E3C36 55%, #16302B 100%)",
              }}
            >
              <div className="absolute -top-24 -right-16 w-[260px] h-[260px] rounded-full border border-bronze/20" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <div className="eyebrow text-bronze mb-3">Need Something Else?</div>
                  <h3 className="display text-cream text-2xl sm:text-3xl mb-2">
                    Just ask.
                  </h3>
                  <p className="text-cream/70 leading-relaxed max-w-md">
                    Term sheets, payoff quotes, insurance questions — a real
                    person will get back to you.
                  </p>
                </div>
                <Link href="/contact" className="btn-primary flex-shrink-0">
                  Contact us <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
