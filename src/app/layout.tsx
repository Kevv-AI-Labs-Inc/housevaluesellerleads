import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://smartvalue.kevv.ai"
  ),
  title: "AI Home Valuation | Smart Value",
  description:
    "Free AI-powered home valuation tool. Enter an address and get a professional valuation report with comparable sales, market trends, and school ratings in 60 seconds.",
  keywords: [
    "home valuation",
    "AI valuation",
    "房屋估值",
    "AI估价",
    "real estate",
    "property value",
    "Zestimate alternative",
    "free home value",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Smart Value — AI Home Valuation",
    description:
      "Get a free AI-powered home valuation in 60 seconds. Comparable sales, market trends, school ratings and more.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Value — AI Home Valuation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Value — AI Home Valuation",
    description:
      "Get a free AI-powered home valuation in 60 seconds.",
    images: ["/og-image.png"],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>

      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </html>
  );
}
