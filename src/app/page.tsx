"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Scan, Wind, Heart, Shield, Zap, Lock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTranslation } from "@/lib/i18n";

export default function HomePage() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="default" className="mb-6">
            {t.home.badge}
          </Badge>

          <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
            {language === 'en' ? (
              <>
                <em className="text-terracotta not-italic">AI-Powered</em> Health
                <br />
                Screening at Your Fingertips
              </>
            ) : (
              <>
                ตรวจสุขภาพด้วย <em className="text-terracotta not-italic">AI</em>
                <br />
                อยู่ในมือคุณ
              </>
            )}
          </h1>

          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/derm">
              <Button size="lg">
                {t.home.startButton}
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="lg">
                {t.home.historyButton}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">
              {language === 'en' ? (
                <>
                  Three Powerful <em className="text-terracotta not-italic">Screening</em> Tools
                </>
              ) : (
                <>
                  เครื่องมือ<em className="text-terracotta not-italic">ตรวจสุขภาพ</em> 3 อย่างที่ทรงพลัง
                </>
              )}
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {t.home.featuresSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Skin Screening */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-terracotta-tint rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Scan className="w-7 h-7 text-terracotta" />
                </div>
                <CardTitle>{t.home.skinCard.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  {t.home.skinCard.description}
                </p>
                <Link href="/derm">
                  <Button variant="outline" className="w-full">
                    {t.home.skinCard.button}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Respiratory */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-terracotta">
              <CardHeader>
                <Badge variant="default" className="mb-2 w-fit">{t.home.respiratoryCard.badge}</Badge>
                <div className="w-14 h-14 bg-terracotta-tint rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wind className="w-7 h-7 text-terracotta" />
                </div>
                <CardTitle>{t.home.respiratoryCard.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  {t.home.respiratoryCard.description}
                </p>
                <Link href="/respiratory">
                  <Button className="w-full">
                    {t.home.respiratoryCard.button}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-terracotta-tint rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-terracotta" />
                </div>
                <CardTitle>{t.home.vitalsCard.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted mb-4">
                  {t.home.vitalsCard.description}
                </p>
                <Link href="/vitals">
                  <Button variant="outline" className="w-full">
                    {t.home.vitalsCard.button}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">
              {language === 'en' ? (
                <>
                  <em className="text-terracotta not-italic">Simple</em> and Secure
                </>
              ) : (
                <>
                  <em className="text-terracotta not-italic">ง่าย</em>และปลอดภัย
                </>
              )}
            </h2>
            <p className="text-lg text-muted">
              {t.home.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-tint rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-serif text-lg mb-2">{t.home.feature1Title}</h3>
              <p className="text-sm text-muted">
                {t.home.feature1Text}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-tint rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-serif text-lg mb-2">{t.home.feature2Title}</h3>
              <p className="text-sm text-muted">
                {t.home.feature2Text}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta-tint rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="font-serif text-lg mb-2">{t.home.feature3Title}</h3>
              <p className="text-sm text-muted">
                {t.home.feature3Text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif mb-4">
            {language === 'en' ? (
              <>
                Ready to Start Your Health <em className="text-terracotta not-italic">Journey</em>?
              </>
            ) : (
              <>
                พร้อม<em className="text-terracotta not-italic">เริ่มต้น</em>การดูแลสุขภาพแล้วหรือยัง?
              </>
            )}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.home.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/derm">
              <Button size="lg" className="min-w-[200px]">
                {t.home.ctaButton1}
              </Button>
            </Link>
            <Link href="/respiratory">
              <Button size="lg" className="min-w-[200px]">
                {t.home.ctaButton2}
              </Button>
            </Link>
            <Link href="/vitals">
              <Button size="lg" className="min-w-[200px]">
                {t.home.ctaButton3}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
