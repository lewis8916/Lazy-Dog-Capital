"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import logoReversed from "@/public/logo_reversed.png";

const resources = [
  { href: "/apply", label: "Start Your Loan Application" },
  { href: "/resources/pre-qual-letter", label: "Pre-Qual Letter Request" },
  { href: "/resources/draw-request", label: "Draw Request" },
  { href: "/resources/payoff-request", label: "Payoff Request" },
  { href: "/resources/forms", label: "Forms" },
];

const links = [
  { href: "/loan", label: "The Loan" },
  { href: "/why", label: "Why Us" },
  { href: "/deal-calculator", label: "Calculator" },
  { href: "/resources", label: "Resources", children: resources },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null); // open dropdown label
  const pathname = usePathname();
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenu(null);
    };
    const onKey = (e) => e.key === "Escape" && setMenu(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const isActive = (l) =>
    l.children
      ? l.children.some((c) => pathname === c.href) || pathname.startsWith(l.href)
      : pathname === l.href;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-teal/95 backdrop-blur-md shadow-lg shadow-teal/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between py-5">
        <Link href="/" className="flex items-center">
          <img
            src={logoReversed.src}
            alt="Lazy Dog Capital"
            className="h-12 w-auto"
          />
        </Link>

        <nav ref={navRef} className="hidden lg:flex items-center gap-7">
          {links.map((l) =>
            l.children ? (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={() => setMenu(l.label)}
                onMouseLeave={() => setMenu(null)}
              >
                <button
                  type="button"
                  onClick={() => setMenu(menu === l.label ? null : l.label)}
                  aria-expanded={menu === l.label}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1.5 text-base font-medium whitespace-nowrap transition-colors ${
                    isActive(l) || menu === l.label
                      ? "text-bronze"
                      : "text-cream/80 hover:text-bronze"
                  }`}
                >
                  {l.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      menu === l.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menu === l.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4">
                    <div className="w-60 rounded-2xl bg-teal-dark border border-cream/10 shadow-2xl shadow-teal/40 overflow-hidden py-2">
                      {l.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`block px-5 py-3 text-sm transition-colors ${
                            pathname === c.href
                              ? "text-bronze bg-cream/5"
                              : "text-cream/80 hover:text-bronze hover:bg-cream/5"
                          }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`text-base font-medium whitespace-nowrap transition-colors ${
                  isActive(l) ? "text-bronze" : "text-cream/80 hover:text-bronze"
                }`}
              >
                {l.label}
              </Link>
            )
          )}
          <Link
            href="/submit-deal"
            className="px-5 py-2.5 rounded-full bg-bronze text-cream text-base font-semibold whitespace-nowrap hover:bg-bronze-light transition-all shadow-lg shadow-bronze/30"
          >
            Submit a Deal
          </Link>
        </nav>

        <button
          className="lg:hidden text-cream"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-teal-dark border-t border-cream/10 max-h-[75vh] overflow-y-auto">
          <div className="container-x py-6 flex flex-col gap-4">
            {links.map((l) =>
              l.children ? (
                <div key={l.label}>
                  <div className="text-cream/50 text-xs tracking-widest uppercase font-semibold mb-3">
                    {l.label}
                  </div>
                  <div className="flex flex-col gap-3 pl-4 border-l border-cream/15">
                    {l.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`text-base ${
                          pathname === c.href
                            ? "text-bronze"
                            : "text-cream/90 hover:text-bronze"
                        }`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-base ${
                    isActive(l) ? "text-bronze" : "text-cream/90 hover:text-bronze"
                  }`}
                >
                  {l.label}
                </Link>
              )
            )}
            <Link
              href="/submit-deal"
              className="mt-2 inline-block px-5 py-3 text-center rounded-full bg-bronze text-cream font-semibold"
            >
              Submit a Deal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
