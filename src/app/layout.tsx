import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI 智能房屋估值 | Smart Value",
  description:
    "免费 AI 驱动的房屋估值工具。输入地址，即刻获取专业级房屋估价报告，包括近期成交对比、市场趋势分析和学区评分。",
  keywords: ["房屋估值", "AI估价", "home valuation", "房产评估", "real estate"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
