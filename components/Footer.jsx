"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-cream relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bronze to-transparent" />

      <div className="container-x py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-bronze flex items-center justify-center">
                <span className="text-cream font-bold">L</span>
              </div>
              <div>
                <div className="font-bold tracking-wide">LAZY DOG</div>
                <div className="text-bronze text-[10px] tracking-[0.3em] -mt-0.5">
                  CAPITAL
                </div>
              </div>
            </div>
            <p className="text-cream/65 leading-relaxed max-w-md mb-8">
              Private capital for real estate investors. Direct lender. Common-sense
              underwriting. Built to fund deals, not push paper.
            </p>

            <div className="space-y-3 text-sm">
              <a
                href="tel:+18005551234"
                className="flex items-center gap-3 text-cream/80 hover:text-bronze transition-colors"
              >
                <Phone size={16} className="text-bronze" /> (800) 555-1234
              </a>
              <a
                href="mailto:loans@lazydogcapital.com"
                className="flex items-center gap-3 text-cream/80 hover:text-bronze transition-colors"
              >
                <Mail size={16} className="text-bronze" /> loans@lazydogcapital.com
              </a>
              <div className="flex items-center gap-3 text-cream/80">
                <MapPin size={16} className="text-bronze" /> Scottsdale, AZ · Nationwide
              </div>
            </div>
          </div>

          <FooterCol
            title="Products"
            links={[
              ["Fix & Flip", "#products"],
              ["Ground-Up", "#products"],
              ["Bridge Loans", "#products"],
              ["DSCR Rental", "#products"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["Why Lazy Dog", "#why"],
              ["Case Studies", "#"],
              ["FAQ", "#faq"],
              ["Apply", "#apply"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["Licensing", "#"],
              ["Privacy Policy", "#"],
              ["Terms of Use", "#"],
              ["Disclosures", "#"],
            ]}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-cream/50">
          <div>
            © {new Date().getFullYear()} Lazy Dog Capital, LLC. All rights reserved.
          </div>
          <div>
            NMLS #1234567 · Equal Housing Lender · Loans subject to credit approval.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="md:col-span-2">
      <div className="eyebrow text-bronze mb-5">{title}</div>
      <ul className="space-y-3">
        {links.map(([l, h]) => (
          <li key={l}>
            <a
              href={h}
              className="text-cream/75 hover:text-bronze transition-colors text-sm"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
