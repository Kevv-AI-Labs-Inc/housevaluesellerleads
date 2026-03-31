"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Home,
  Search,
  Star,
  Building2,
  BarChart3,
  GraduationCap,
  X,
  CheckCircle2,
  ArrowRight,
  Activity,
  Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LeadGate } from "@/components/LeadGate";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { ShareButtons } from "@/components/ShareButtons";
import { PricingCTA } from "@/components/PricingCTA";
import { AgentCTA } from "@/components/AgentCTA";

interface ValuationData {
  estimatedValueLow: number;
  estimatedValueHigh: number;
  estimatedValue: number;
  appreciationRate: number;
  propertyDetails: {
    beds: number;
    baths: number;
    sqft: number;
    yearBuilt: number;
    lotSize: string;
    propertyType: string;
  };
  comparableSales: {
    address: string;
    price: number;
    date: string;
    beds: number;
    baths: number;
    sqft: number;
  }[];
  schoolRating: number;
  neighborhoodTrend: string;
  marketSummary: string;
}

type ViewState = "input" | "loading" | "gate" | "report";

/* ─── Spring physics preset (per skill §4) ─────────────── */
const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ...springTransition },
  },
};
const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springTransition },
};

export default function HomePage() {
  const { t, locale } = useI18n();
  const [address, setAddress] = useState("");
  const [viewState, setViewState] = useState<ViewState>("input");
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [error, setError] = useState("");
  const [agentSlug, setAgentSlug] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agent = params.get("agent");
    if (agent) setAgentSlug(agent);
  }, []);

  const handleValuation = async () => {
    if (!address.trim() || address.trim().length < 5) {
      setError(t("input.error.required"));
      return;
    }

    setError("");
    setSubmittedAddress(address.trim());
    setViewState("loading");

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.trim(),
          agentSlug: agentSlug || undefined,
          locale,
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const code = data.errorCode || "VALUATION_FAILED";
        throw new Error(t(`error.${code}` as Parameters<typeof t>[0]));
      }

      setValuation(data.valuation);
      setViewState("gate");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(t("error.TIMEOUT"));
      } else {
        setError(
          err instanceof Error
            ? err.message
            : t("error.VALUATION_FAILED")
        );
      }
      setViewState("input");
    } finally {
      clearTimeout(timeout);
      abortRef.current = null;
    }
  };

  const handleLeadCaptured = () => {
    setViewState("report");
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  const formatFullPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const resetAll = () => {
    setViewState("input");
    setAddress("");
    setValuation(null);
  };

  return (
    <div className="relative min-h-[100dvh]">
      {/* Mesh gradient background — fixed, no repaints */}
      <div className="mesh-bg" />

      <main className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-6 md:py-12">
        {/* ─── Header ─────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="flex items-center justify-between mb-6 md:mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium">
            <Activity size={12} />
            {t("header.badge")}
          </div>
          <LanguageSwitcher />
        </motion.header>

        <AnimatePresence mode="wait">
          {/* ════════ INPUT STATE ════════ */}
          {viewState === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
            >
              {/* Split-screen hero: Left text / Right input card */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,1.1fr] gap-8 md:gap-12 items-start">
                {/* Left — headline + trust */}
                <div className="pt-2 md:pt-8">
                  <h1 className="heading-display text-3xl sm:text-4xl md:text-[3.25rem] mb-4 md:mb-6">
                    {t("hero.title1")}
                    <br />
                    <span className="text-zinc-500">{t("hero.title2")}</span>
                  </h1>
                  <p className="body-text text-base sm:text-lg mb-6 md:mb-8">
                    {t("hero.subtitle")}
                  </p>

                  {/* Trust indicators — inline, subtle */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      { text: t("trust.free") },
                      { text: t("trust.fast") },
                      { text: t("trust.safe") },
                    ].map((item) => (
                      <span
                        key={item.text}
                        className="flex items-center gap-2 text-sm text-zinc-400"
                      >
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — address input panel */}
                <motion.div
                  className="glass-panel p-6 sm:p-8"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                      <MapPin size={18} className="text-zinc-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-zinc-800">
                        {t("input.label")}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        {t("input.sublabel")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AddressAutocomplete
                      value={address}
                      onChange={(val) => {
                        setAddress(val);
                        setError("");
                      }}
                      onSelect={(place) => setAddress(place.formatted)}
                      placeholder={t("input.placeholder")}
                      onKeyDown={(e) => e.key === "Enter" && handleValuation()}
                    />

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      onClick={handleValuation}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Search size={16} />
                      {t("input.button")}
                    </button>
                  </div>

                  {/* Features — 2 item zig-zag, not 3-col grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {[
                      { icon: BarChart3, label: t("input.feature.market"), desc: locale === "zh" ? "实时数据驱动" : "Real-time data" },
                      { icon: Building2, label: t("input.feature.comps"), desc: locale === "zh" ? "近期成交对比" : "Recent sales" },
                      { icon: GraduationCap, label: t("input.feature.school"), desc: locale === "zh" ? "学区综合评分" : "Comprehensive" },
                    ].map((feature) => (
                      <div
                        key={feature.label}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100"
                      >
                        <feature.icon size={16} className="text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-zinc-700">{feature.label}</span>
                          <span className="text-[10px] text-zinc-400 ml-1.5">{feature.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ════════ LOADING STATE ════════ */}
          {viewState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={springTransition}
              className="flex flex-col items-center justify-center py-16 md:py-24 relative"
            >
              {/* Skeleton shimmer card instead of spinner */}
              <div className="w-full max-w-md glass-panel p-6 sm:p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton-text w-3/4" />
                    <div className="skeleton-text w-1/2" style={{ height: "0.75rem" }} />
                  </div>
                </div>
                <div className="skeleton w-full h-10 rounded-xl mb-3" />
                <div className="skeleton w-2/3 h-6 rounded-lg" />
              </div>

              <h2 className="text-xl font-bold text-zinc-800 mb-2 tracking-tight">
                {t("loading.title")}
              </h2>
              <p className="text-zinc-500 mb-6 text-center max-w-md text-sm">
                {t("loading.subtitle", { address: submittedAddress })}
              </p>

              <motion.div
                className="w-full max-w-md space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {[
                  t("loading.step1"),
                  t("loading.step2"),
                  t("loading.step3"),
                  t("loading.step4"),
                  t("loading.step5"),
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    variants={staggerItem}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.5 + 0.3, ...springTransition }}
                    >
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </motion.div>
                    <span className="text-zinc-500">{step}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Cancel — subtle text link */}
              <button
                onClick={() => {
                  abortRef.current?.abort();
                  setViewState("input");
                  setError("");
                }}
                className="mt-8 text-zinc-400 hover:text-red-500 text-xs transition-colors inline-flex items-center gap-1 underline underline-offset-2"
              >
                <X size={12} />
                {locale === "zh" ? "取消" : "Cancel"}
              </button>
            </motion.div>
          )}

          {/* ════════ GATE STATE (Lead Capture) ════════ */}
          {viewState === "gate" && valuation && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
            >
              <LeadGate
                estimatedValue={valuation.estimatedValue}
                estimatedValueLow={valuation.estimatedValueLow}
                estimatedValueHigh={valuation.estimatedValueHigh}
                address={submittedAddress}
                agentSlug={agentSlug}
                onLeadCaptured={handleLeadCaptured}
                valuationResult={valuation}
              />
            </motion.div>
          )}

          {/* ════════ REPORT STATE ════════ */}
          {viewState === "report" && valuation && (
            <motion.div
              key="report"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-0"
            >
              {/* Report Header */}
              <motion.div variants={staggerItem} className="mb-6 md:mb-8">
                <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-2">
                  {t("report.title")}
                </h1>
                <p className="text-zinc-400 flex items-center gap-2 text-sm">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{submittedAddress}</span>
                </p>
              </motion.div>

              {/* Main Value — glass panel, NO gradient text */}
              <motion.div
                variants={staggerItem}
                className="glass-panel p-6 sm:p-8 text-center mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Home size={18} className="text-emerald-600" />
                  <span className="text-zinc-500 text-sm font-medium">
                    {t("report.estimatedValue")}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tighter mb-2 font-mono-num">
                  {formatFullPrice(valuation.estimatedValueLow)} &mdash;{" "}
                  {formatFullPrice(valuation.estimatedValueHigh)}
                </div>
                <p className="text-zinc-400 text-sm mb-6 font-mono-num">
                  {t("report.bestEstimate")}:{" "}
                  {formatFullPrice(valuation.estimatedValue)}
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span
                    className={`stat-pill ${valuation.appreciationRate >= 0 ? "positive" : "neutral"}`}
                  >
                    {valuation.appreciationRate >= 0 ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {valuation.appreciationRate >= 0
                      ? t("report.appreciation.up")
                      : t("report.appreciation.change")}{" "}
                    <span className="font-mono-num">{Math.abs(valuation.appreciationRate).toFixed(1)}%</span>
                  </span>
                  <span className="stat-pill neutral">
                    <Star size={14} />
                    {t("report.schoolRating")}:
                    <span className="font-mono-num">{valuation.schoolRating}/10</span>
                  </span>
                </div>
              </motion.div>

              {/* Property Details — divider-based, NOT card-boxed */}
              <motion.div variants={staggerItem} className="section-divided">
                <h3 className="heading-section text-base mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-600" />
                  {t("report.propertyInfo")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                  {[
                    {
                      label: t("report.beds"),
                      value: `${valuation.propertyDetails.beds}${locale === "zh" ? " 间" : ""}`,
                    },
                    {
                      label: t("report.baths"),
                      value: `${valuation.propertyDetails.baths}${locale === "zh" ? " 间" : ""}`,
                    },
                    {
                      label: t("report.sqft"),
                      value: `${valuation.propertyDetails.sqft.toLocaleString()} sqft`,
                    },
                    {
                      label: t("report.yearBuilt"),
                      value: `${valuation.propertyDetails.yearBuilt}`,
                    },
                    {
                      label: t("report.lotSize"),
                      value: valuation.propertyDetails.lotSize,
                    },
                    {
                      label: t("report.propertyType"),
                      value: valuation.propertyDetails.propertyType,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-zinc-400 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-zinc-800 font-mono-num">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Comparable Sales — divider-based table rows */}
              <motion.div variants={staggerItem} className="section-divided">
                <h3 className="heading-section text-base mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-emerald-600" />
                  {t("report.comps")}
                </h3>
                <div>
                  {valuation.comparableSales.map((comp, i) => (
                    <div key={i} className="comp-row">
                      <div>
                        <p className="text-sm font-medium text-zinc-700">
                          {comp.address}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {comp.beds}
                          {locale === "zh" ? "卧" : "bd"} ·{" "}
                          {comp.baths}
                          {locale === "zh" ? "浴" : "ba"} ·{" "}
                          <span className="font-mono-num">{comp.sqft.toLocaleString()}</span> sqft
                        </p>
                      </div>
                      <span className="text-sm font-bold text-zinc-800 font-mono-num">
                        {formatPrice(comp.price)}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono-num">
                        {comp.date}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Market Summary — clean typography, NO card box */}
              <motion.div variants={staggerItem} className="section-divided">
                <h3 className="heading-section text-base mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  {t("report.marketTrend")}
                </h3>
                <p className="body-text text-sm mb-3">
                  {valuation.marketSummary}
                </p>
                <span
                  className={`stat-pill ${valuation.neighborhoodTrend === "rising" ? "positive" : "neutral"}`}
                >
                  {valuation.neighborhoodTrend === "rising" ? (
                    <TrendingUp size={14} />
                  ) : valuation.neighborhoodTrend === "declining" ? (
                    <TrendingDown size={14} />
                  ) : (
                    <Minus size={14} />
                  )}
                  {t("report.trendLabel")}:{" "}
                  {valuation.neighborhoodTrend === "rising"
                    ? t("report.trend.rising")
                    : valuation.neighborhoodTrend === "stable"
                      ? t("report.trend.stable")
                      : t("report.trend.declining")}
                </span>
              </motion.div>

              {/* Share Buttons — section-divided */}
              <motion.div variants={staggerItem} className="section-divided">
                <ShareButtons
                  address={submittedAddress}
                  estimatedValue={valuation.estimatedValue}
                  agentSlug={agentSlug}
                />
              </motion.div>

              {/* Pricing CTA */}
              <motion.div variants={staggerItem} className="section-divided">
                <PricingCTA />
              </motion.div>

              {/* New Valuation Button */}
              <motion.div variants={staggerItem} className="text-center pt-6 pb-4">
                <button
                  onClick={resetAll}
                  className="text-zinc-400 hover:text-emerald-600 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Search size={14} />
                  {t("report.newValuation")}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center mt-10 sm:mt-16 pb-6 sm:pb-8 text-zinc-400 text-xs">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-2 flex items-center justify-center gap-3">
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-300">&middot;</span>
            <Link href="/pricing" className="hover:text-emerald-600 transition-colors">
              For Agents
            </Link>
          </p>
          <p className="mt-1">
            {t("footer.copyright", {
              year: new Date().getFullYear().toString(),
            })}
          </p>
        </footer>
      </main>

      {/* Agent CTA — floating action button */}
      {viewState === "report" && (
        <AgentCTA
          agentSlug={agentSlug}
          address={submittedAddress}
          estimatedValue={
            valuation ? formatFullPrice(valuation.estimatedValue) : undefined
          }
        />
      )}
    </div>
  );
}
