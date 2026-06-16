"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#products", label: "Products" },
  { href: "#why", label: "Why Us" },
  { href: "#faq", label: "FAQ" },
  { href: "#apply", label: "Apply" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-teal/95 backdrop-blur-md shadow-lg shadow-teal/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between py-5">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full bg-bronze flex items-center justify-center">
            <span className="text-cream font-bold text-lg">L</span>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cream border-2 border-teal" />
          </div>
          <div className="leading-tight">
            <div className="text-cream font-bold tracking-wide">LAZY DOG</div>
            <div className="text-bronze text-[10px] tracking-[0.3em] -mt-0.5">
              CAPITAL
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-cream/80 hover:text-bronze text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#apply"
            className="px-5 py-2.5 rounded-full bg-bronze text-cream text-sm font-semibold hover:bg-bronze-light transition-all shadow-lg shadow-bronze/30"
          >
            Get Funded
          </a>
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
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-cream/90 hover:text-bronze text-base"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#apply"
              onClick={() => setOpen(false)}
              className="mt-2 inline-block px-5 py-3 text-center rounded-full bg-bronze text-cream font-semibold"
            >
              Get Funded
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
