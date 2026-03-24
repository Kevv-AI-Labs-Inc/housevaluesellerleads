"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  TrendingUp,
  Home,
  Search,
  Star,
  Building2,
  BarChart3,
  GraduationCap,
  MessageCircle,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LeadGate } from "@/components/LeadGate";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { ShareButtons } from "@/components/ShareButtons";
import { PricingCTA } from "@/components/PricingCTA";

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

export default function HomePage() {
  const { t, locale } = useI18n();
  const [address, setAddress] = useState("");
  const [viewState, setViewState] = useState<ViewState>("input");
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");
  const [agentSlug, setAgentSlug] = useState("");

  // Read ?agent=xxx from URL on mount
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

    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.trim(),
          agentSlug: agentSlug || undefined,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const code = data.errorCode || "VALUATION_FAILED";
        throw new Error(t(`error.${code}` as Parameters<typeof t>[0]));
      }

      setValuation(data.valuation);
      // Go to gate instead of report
      setViewState("gate");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("error.VALUATION_FAILED")
      );
      setViewState("input");
    }
  };

  const handleLeadCaptured = () => {
    setViewState("report");
    // Show chat widget after a delay
    setTimeout(() => setShowChat(true), 3000);
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
    setShowChat(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 600,
            height: 600,
            top: "-10%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: 500,
            height: 500,
            bottom: "10%",
            left: "-5%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)",
          }}
        />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div /> {/* Spacer */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
              <Sparkles size={14} />
              {t("header.badge")}
            </div>
            <LanguageSwitcher />
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {/* ======== INPUT STATE ======== */}
          {viewState === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  <span className="gradient-text">{t("hero.title1")}</span>
                  <br />
                  <span className="text-white">{t("hero.title2")}</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </div>

              {/* Address Input Card */}
              <div className="glass-card p-8 md:p-10 max-w-2xl mx-auto pulse-glow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                    <MapPin size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {t("input.label")}
                    </h2>
                    <p className="text-sm text-slate-500">
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
                      className="text-red-400 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    onClick={handleValuation}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Search size={18} />
                    {t("input.button")}
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                  {[
                    { icon: BarChart3, label: t("input.feature.market") },
                    { icon: Building2, label: t("input.feature.comps") },
                    { icon: GraduationCap, label: t("input.feature.school") },
                  ].map((feature) => (
                    <div
                      key={feature.label}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <feature.icon size={18} className="text-indigo-400" />
                      <span className="text-xs text-slate-500">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-8 text-slate-600 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500/60" />
                  {t("trust.free")}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500/60" />
                  {t("trust.fast")}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500/60" />
                  {t("trust.safe")}
                </span>
              </div>
            </motion.div>
          )}

          {/* ======== LOADING STATE ======== */}
          {viewState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Loader2
                    size={32}
                    className="text-indigo-400 animate-spin"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
              </div>

              <h2 className="text-2xl font-bold mb-3">{t("loading.title")}</h2>
              <p className="text-slate-400 mb-8 text-center max-w-md">
                {t("loading.subtitle", { address: submittedAddress })}
              </p>

              <div className="w-full max-w-md space-y-3">
                {[
                  t("loading.step1"),
                  t("loading.step2"),
                  t("loading.step3"),
                  t("loading.step4"),
                  t("loading.step5"),
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.6 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.6 + 0.3 }}
                    >
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </motion.div>
                    <span className="text-slate-400">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======== GATE STATE (Lead Capture) ======== */}
          {viewState === "gate" && valuation && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
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

          {/* ======== REPORT STATE ======== */}
          {viewState === "report" && valuation && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Report Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                  <span className="gradient-text">{t("report.title")}</span>
                </h1>
                <p className="text-slate-400 flex items-center justify-center gap-2">
                  <MapPin size={14} />
                  {submittedAddress}
                </p>
              </div>

              {/* Main Value Card */}
              <motion.div
                className="glass-card p-8 text-center pulse-glow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Home size={20} className="text-indigo-400" />
                  <span className="text-slate-400 text-sm font-medium">
                    {t("report.estimatedValue")}
                  </span>
                </div>
                <div className="value-display gradient-text mb-2">
                  {formatFullPrice(valuation.estimatedValueLow)} —{" "}
                  {formatFullPrice(valuation.estimatedValueHigh)}
                </div>
                <p className="text-slate-500 text-sm mb-6">
                  {t("report.bestEstimate")}:{" "}
                  {formatFullPrice(valuation.estimatedValue)}
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span
                    className={`stat-badge ${valuation.appreciationRate >= 0 ? "positive" : "neutral"}`}
                  >
                    <TrendingUp size={14} />
                    {valuation.appreciationRate >= 0
                      ? t("report.appreciation.up")
                      : t("report.appreciation.change")}{" "}
                    {Math.abs(valuation.appreciationRate).toFixed(1)}%
                  </span>
                  <span className="stat-badge neutral">
                    <Star size={14} />
                    {t("report.schoolRating")}: {valuation.schoolRating}/10
                  </span>
                </div>
              </motion.div>

              {/* Property Details */}
              <motion.div
                className="report-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-400" />
                  {t("report.propertyInfo")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    <div
                      key={item.label}
                      className="p-3 rounded-xl bg-white/[0.02]"
                    >
                      <p className="text-xs text-slate-500 mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-200">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Comparable Sales */}
              <motion.div
                className="report-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-cyan-400" />
                  {t("report.comps")}
                </h3>
                <div className="space-y-2">
                  {valuation.comparableSales.map((comp, i) => (
                    <div key={i} className="comp-row">
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {comp.address}
                        </p>
                        <p className="text-xs text-slate-500">
                          {comp.beds}
                          {locale === "zh" ? "卧" : "bd"} ·{" "}
                          {comp.baths}
                          {locale === "zh" ? "浴" : "ba"} ·{" "}
                          {comp.sqft.toLocaleString()} sqft
                        </p>
                      </div>
                      <span className="text-sm font-bold text-indigo-300">
                        {formatPrice(comp.price)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {comp.date}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Market Summary */}
              <motion.div
                className="report-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-400" />
                  {t("report.marketTrend")}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {valuation.marketSummary}
                </p>
                <div className="mt-3">
                  <span
                    className={`stat-badge ${valuation.neighborhoodTrend === "rising" ? "positive" : "neutral"}`}
                  >
                    {t("report.trendLabel")}:{" "}
                    {valuation.neighborhoodTrend === "rising"
                      ? t("report.trend.rising")
                      : valuation.neighborhoodTrend === "stable"
                        ? t("report.trend.stable")
                        : t("report.trend.declining")}
                  </span>
                </div>
              </motion.div>

              {/* Share Buttons */}
              <ShareButtons
                address={submittedAddress}
                estimatedValue={valuation.estimatedValue}
                agentSlug={agentSlug}
              />

              {/* Pricing CTA */}
              <PricingCTA />

              {/* New Valuation Button */}
              <div className="text-center pt-4">
                <button
                  onClick={resetAll}
                  className="text-slate-500 hover:text-indigo-400 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Search size={14} />
                  {t("report.newValuation")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8 text-slate-600 text-xs">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-1">
            {t("footer.copyright", {
              year: new Date().getFullYear().toString(),
            })}
          </p>
        </footer>
      </main>

      {/* AI Chat Widget */}
      <AnimatePresence>
        {showChat && viewState === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="chat-widget"
          >
            <div className="relative">
              <button
                onClick={() => setShowChat(false)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
              <div className="chat-bubble">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle size={14} />
                  <span className="font-semibold">{t("chat.title")}</span>
                </div>
                <p>{t("chat.message")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
