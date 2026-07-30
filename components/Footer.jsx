"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden noise text-cream"
      style={{
        background:
          "radial-gradient(ellipse at bottom right, #1E3C36 0%, #16302B 60%, #122822 100%)",
      }}
    >
      {/* Bronze hairline + decorative rings */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bronze to-transparent" />
      <div className="absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full border border-bronze/10" />
      <div className="absolute -bottom-32 -right-16 w-[350px] h-[350px] rounded-full border border-bronze/15" />

      {/* Watermark dog icon */}
      <img
        src="/logo_icon.png"
        alt=""
        aria-hidden="true"
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-[380px] opacity-[0.04] pointer-events-none select-none"
      />

      <div className="container-x relative z-10 pt-14 pb-12">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-6">
            <Link href="/" className="inline-block mb-7">
              <img
                src="/logo_reversed.png"
                alt="Lazy Dog Capital"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-cream/60 leading-relaxed max-w-md">
              Short-term private capital for fix &amp; flip investors in
              Dallas–Fort Worth. Run by operators, funded with our own money,
              and built to get your project to the finish line.
            </p>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-3 md:pt-3">
            <div className="eyebrow text-bronze mb-6">The Loan</div>
            <ul className="space-y-3.5">
              {[
                ["How it works", "/loan"],
                ["Why Lazy Dog", "/why"],
                ["FAQ", "/faq"],
                ["Apply", "/apply", true],
              ].map(([l, h, isButton]) => (
                <li key={l}>
                  {isButton ? (
                    <Link
                      href={h}
                      className="inline-flex items-center px-4 py-1.5 rounded-full bg-bronze text-cream text-sm font-semibold hover:bg-bronze-light transition-colors"
                    >
                      {l}
                    </Link>
                  ) : (
                    <Link
                      href={h}
                      className="group inline-flex items-center gap-2 text-cream/70 hover:text-bronze transition-colors text-sm"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-bronze transition-all duration-300" />
                      {l}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 md:pt-3">
            <div className="eyebrow text-bronze mb-6">Company</div>
            <ul className="space-y-3.5">
              {[
                ["Who we are", "/why"],
                ["Deal calculator", "/deal-calculator"],
                ["Bring us a deal", "/submit-deal"],
                ["Contact us", "/contact"],
              ].map(([l, h]) => (
                <li key={l}>
                  <Link
                    href={h}
                    className="group inline-flex items-center gap-2 text-cream/70 hover:text-bronze transition-colors text-sm"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-bronze transition-all duration-300" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 pt-8 border-t border-cream/10">
          <p className="text-xs text-cream/40 leading-relaxed max-w-4xl mb-6">
            Lazy Dog Capital lends on non-owner-occupied investment property for
            business purposes only, and does not make consumer or owner-occupied
            residential mortgage loans. Nothing on this site is a commitment or
            offer to lend; all loans are subject to underwriting approval,
            property evaluation, and execution of definitive loan documents.
            Terms are determined on a deal-by-deal basis.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cream/50">
            <div>
              © {new Date().getFullYear()} Lazy Dog Capital, LLC. All rights
              reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
              Built in Texas. Lending in DFW.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
