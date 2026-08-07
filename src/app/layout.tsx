import type { Metadata } from "next";
import { Inter, Fraunces, Sarabun } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  variable: "--font-sarabun",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vitals360 AI - Personal Health Screening",
  description: "AI-powered health screening for skin lesions, respiratory sounds, and vital signs monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} ${sarabun.variable} font-sans antialiased`}>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <DisclaimerFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
