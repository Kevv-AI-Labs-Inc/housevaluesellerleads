import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "Smart Value — AI Home Valuation",
    description:
      "Get a free AI-powered home valuation in 60 seconds. Comparable sales, market trends, school ratings and more.",
    type: "website",
  },
};

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
    </html>
  );
}
