"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/loan", label: "The Loan" },
  { href: "/why", label: "Why Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/apply", label: "Apply" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
            src="/logo_reversed.png"
            alt="Lazy Dog Capital"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-base font-medium transition-colors ${
                pathname === l.href
                  ? "text-bronze"
                  : "text-cream/80 hover:text-bronze"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="px-5 py-2.5 rounded-full bg-bronze text-cream text-base font-semibold hover:bg-bronze-light transition-all shadow-lg shadow-bronze/30"
          >
            Get Funded
          </Link>
        </nav>

        <button
          className="md:hidden text-cream"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-teal-dark border-t border-cream/10">
          <div className="container-x py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-base ${
                  pathname === l.href
                    ? "text-bronze"
                    : "text-cream/90 hover:text-bronze"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="mt-2 inline-block px-5 py-3 text-center rounded-full bg-bronze text-cream font-semibold"
            >
              Get Funded
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
