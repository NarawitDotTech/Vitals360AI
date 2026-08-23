"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Scan, Wind, Heart, ShieldCheck, Zap, Lock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";

export default function HomePage() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(28_51%_92%)_0%,transparent_70%)]"
        />
        <div className="container flex flex-col items-center py-24 text-center md:py-32">
          <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm">
            {t.home.badge}
          </Badge>

          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {language === 'en' ? (
              <>
                <span className="text-primary">AI-Powered</span> Health
                <br />
                Screening at Your Fingertips
              </>
            ) : (
              <>
                ตรวจสุขภาพด้วย <span className="text-primary">AI</span>
                <br />
                อยู่ในมือคุณ
              </>
            )}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl">
            {t.home.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/derm">
                {t.home.startButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/settings">{t.home.historyButton}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-y border-border/60 bg-card py-20">
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              {language === 'en' ? (
                <>
                  Three Powerful <span className="text-primary">Screening</span> Tools
                </>
              ) : (
                <>
                  เครื่องมือ<span className="text-primary">ตรวจสุขภาพ</span> 3 อย่างที่ทรงพลัง
                </>
              )}
            </h2>
            <p className="mt-4 text-muted">{t.home.featuresSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Skin Screening */}
            <Card className="group transition-all hover:-translate-y-1 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform group-hover:scale-105">
                  <Scan className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.home.skinCard.title}</CardTitle>
                <CardDescription>{t.home.skinCard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/derm">{t.home.skinCard.button}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Respiratory */}
            <Card className="group relative border-primary shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
              <Badge variant="primary" className="absolute right-5 top-5">
                {t.home.respiratoryCard.badge}
              </Badge>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform group-hover:scale-105">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.home.respiratoryCard.title}</CardTitle>
                <CardDescription>{t.home.respiratoryCard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/respiratory">{t.home.respiratoryCard.button}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card className="group transition-all hover:-translate-y-1 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform group-hover:scale-105">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t.home.vitalsCard.title}</CardTitle>
                <CardDescription>{t.home.vitalsCard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/vitals">{t.home.vitalsCard.button}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              {language === 'en' ? (
                <>
                  <span className="text-primary">Simple</span> and Secure
                </>
              ) : (
                <>
                  <span className="text-primary">ง่าย</span>และปลอดภัย
                </>
              )}
            </h2>
            <p className="mt-4 text-muted">{t.home.howItWorksSubtitle}</p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              { icon: Zap, title: t.home.feature1Title, text: t.home.feature1Text },
              { icon: Lock, title: t.home.feature2Title, text: t.home.feature2Text },
              { icon: ShieldCheck, title: t.home.feature3Title, text: t.home.feature3Text },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground py-20 text-background">
        <div className="container max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            {language === 'en' ? (
              <>
                Ready to Start Your Health <span className="text-orange-400">Journey</span>?
              </>
            ) : (
              <>
                พร้อม<span className="text-orange-400">เริ่มต้น</span>การดูแลสุขภาพแล้วหรือยัง?
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-background/70">{t.home.ctaSubtitle}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/derm">{t.home.ctaButton1}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/respiratory">{t.home.ctaButton2}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/vitals">{t.home.ctaButton3}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
