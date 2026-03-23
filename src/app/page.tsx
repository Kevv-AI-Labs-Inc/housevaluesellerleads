"use client";

import { useState } from "react";
import {
  MapPin,
  TrendingUp,
  Home,
  Search,
  Mail,
  Star,
  ArrowRight,
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

type ViewState = "input" | "loading" | "report";

export default function HomePage() {
  const [address, setAddress] = useState("");
  const [viewState, setViewState] = useState<ViewState>("input");
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [submittedAddress, setSubmittedAddress] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState("");

  const handleValuation = async () => {
    if (!address.trim() || address.trim().length < 5) {
      setError("请输入完整的房屋地址");
      return;
    }

    setError("");
    setSubmittedAddress(address.trim());
    setViewState("loading");

    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "估值失败");
      }

      setValuation(data.valuation);
      setViewState("report");

      // Show chat widget after a delay
      setTimeout(() => setShowChat(true), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "估值失败，请重试");
      setViewState("input");
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) return;

    setEmailLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          address: submittedAddress,
          valuationResult: valuation,
        }),
      });
      setEmailSubmitted(true);
    } catch {
      // Still show success to user
      setEmailSubmitted(true);
    }
    setEmailLoading(false);
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            <Sparkles size={14} />
            AI 驱动 · 免费估价
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
                  <span className="gradient-text">您的房子</span>
                  <br />
                  <span className="text-white">现在值多少？</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  输入地址，AI
                  即刻分析公开数据，为您生成专业级房屋估价报告
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
                      输入房屋地址
                    </h2>
                    <p className="text-sm text-slate-500">
                      支持美国所有地区
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="例如: 123 Main St, Flushing, NY 11355"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setError("");
                    }}
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
                    免费 AI 估价
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                  {[
                    { icon: BarChart3, label: "市场分析" },
                    { icon: Building2, label: "成交对比" },
                    { icon: GraduationCap, label: "学区评分" },
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
                  完全免费
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500/60" />
                  60秒出结果
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500/60" />
                  数据安全
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
                  <Loader2 size={32} className="text-indigo-400 animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
              </div>

              <h2 className="text-2xl font-bold mb-3">AI 正在分析...</h2>
              <p className="text-slate-400 mb-8 text-center max-w-md">
                正在搜索 <span className="text-indigo-300">{submittedAddress}</span> 的公开数据
              </p>

              <div className="w-full max-w-md space-y-3">
                {[
                  "搜索税务评估记录...",
                  "分析近期成交数据...",
                  "评估区域市场趋势...",
                  "计算学区评分...",
                  "生成估价报告...",
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
                      <CheckCircle2
                        size={16}
                        className="text-emerald-400"
                      />
                    </motion.div>
                    <span className="text-slate-400">{step}</span>
                  </motion.div>
                ))}
              </div>
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
                  <span className="gradient-text">AI 估价报告</span>
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
                    估算市场价值
                  </span>
                </div>
                <div className="value-display gradient-text mb-2">
                  {formatFullPrice(valuation.estimatedValueLow)} —{" "}
                  {formatFullPrice(valuation.estimatedValueHigh)}
                </div>
                <p className="text-slate-500 text-sm mb-6">
                  最佳估值: {formatFullPrice(valuation.estimatedValue)}
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span
                    className={`stat-badge ${valuation.appreciationRate >= 0 ? "positive" : "neutral"}`}
                  >
                    <TrendingUp size={14} />
                    较去年{valuation.appreciationRate >= 0 ? "增值" : "变化"}{" "}
                    {Math.abs(valuation.appreciationRate).toFixed(1)}%
                  </span>
                  <span className="stat-badge neutral">
                    <Star size={14} />
                    学区评分: {valuation.schoolRating}/10
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
                  房屋信息
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "卧室",
                      value: `${valuation.propertyDetails.beds} 间`,
                    },
                    {
                      label: "浴室",
                      value: `${valuation.propertyDetails.baths} 间`,
                    },
                    {
                      label: "面积",
                      value: `${valuation.propertyDetails.sqft.toLocaleString()} sqft`,
                    },
                    {
                      label: "建成年份",
                      value: `${valuation.propertyDetails.yearBuilt}`,
                    },
                    {
                      label: "占地",
                      value: valuation.propertyDetails.lotSize,
                    },
                    {
                      label: "类型",
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
                  近期可比成交
                </h3>
                <div className="space-y-2">
                  {valuation.comparableSales.map((comp, i) => (
                    <div key={i} className="comp-row">
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {comp.address}
                        </p>
                        <p className="text-xs text-slate-500">
                          {comp.beds}卧 · {comp.baths}浴 ·{" "}
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
                  市场趋势分析
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {valuation.marketSummary}
                </p>
                <div className="mt-3">
                  <span
                    className={`stat-badge ${valuation.neighborhoodTrend === "rising" ? "positive" : "neutral"}`}
                  >
                    区域趋势:{" "}
                    {valuation.neighborhoodTrend === "rising"
                      ? "📈 上涨"
                      : valuation.neighborhoodTrend === "stable"
                        ? "📊 稳定"
                        : "📉 下降"}
                  </span>
                </div>
              </motion.div>

              {/* Email Capture */}
              <motion.div
                className="glass-card p-8 text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {!emailSubmitted ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                      <Mail size={24} className="text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      获取完整报告 + 定制建议
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                      输入邮箱，我们将发送详细的 PDF
                      估价报告，包括个性化的出售建议和最佳时机分析
                    </p>
                    <div className="flex gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        className="input-field flex-1"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleEmailSubmit()
                        }
                      />
                      <button
                        onClick={handleEmailSubmit}
                        disabled={emailLoading || !email.includes("@")}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                      >
                        {emailLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <>
                            获取报告
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2
                        size={28}
                        className="text-emerald-400"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-emerald-300">
                      提交成功！
                    </h3>
                    <p className="text-slate-400 text-sm">
                      完整估价报告将发送到{" "}
                      <span className="text-indigo-300">{email}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* New Valuation Button */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setViewState("input");
                    setAddress("");
                    setValuation(null);
                    setEmailSubmitted(false);
                    setEmail("");
                    setShowChat(false);
                  }}
                  className="text-slate-500 hover:text-indigo-400 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Search size={14} />
                  估价另一个地址
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8 text-slate-600 text-xs">
          <p>
            Powered by AI · 估值仅供参考，不构成投资建议
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Smart Value</p>
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
                  <span className="font-semibold">AI 助手</span>
                </div>
                <p>对估价结果有疑问？需要具体聊聊您的房子吗？💬</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
