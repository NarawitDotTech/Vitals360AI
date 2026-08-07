"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Activity, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/derm", label: t.nav.skinScreening },
    { href: "/lung", label: language === 'th' ? 'ตรวจปอด' : 'Lung Screening' },
    { href: "/vitals", label: t.nav.vitals },
    { href: "/settings", label: t.nav.settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-serif">
              Vitals360 <em className="text-terracotta not-italic">AI</em>
            </span>
          </Link>

          {/* Navigation Links + Language Switcher */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-pill text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-terracotta text-white"
                    : "text-muted hover:text-terracotta hover:bg-terracotta-tint"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="ml-4 flex items-center gap-1 bg-surface rounded-pill p-1">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-3 py-1.5 rounded-pill text-xs font-medium transition-all",
                  language === 'en'
                    ? "bg-terracotta text-white"
                    : "text-muted hover:text-terracotta"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('th')}
                className={cn(
                  "px-3 py-1.5 rounded-pill text-xs font-medium transition-all",
                  language === 'th'
                    ? "bg-terracotta text-white"
                    : "text-muted hover:text-terracotta"
                )}
              >
                TH
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
