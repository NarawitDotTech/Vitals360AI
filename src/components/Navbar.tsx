"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/derm", label: t.nav.skinScreening },
    { href: "/lung", label: language === 'th' ? 'ตรวจปอด' : 'Lung Screening' },
    { href: "/vitals", label: t.nav.vitals },
    { href: "/settings", label: t.nav.settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight">
            Vitals360 <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 rounded-full border bg-background p-1 md:flex">
          <Globe className="ml-2 h-3.5 w-3.5 text-muted" />
          {(["en", "th"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                language === lang
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-primary"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-1 self-start rounded-full border bg-background p-1">
              <Globe className="ml-2 h-3.5 w-3.5 text-muted" />
              {(["en", "th"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors",
                    language === lang
                      ? "bg-primary text-primary-foreground"
                      : "text-muted"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
