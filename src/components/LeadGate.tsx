"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  ArrowRight,
  Loader2,
  Lock,
  Home,
} from "lucide-react";

interface LeadGateProps {
  estimatedValue: number;
  estimatedValueLow: number;
  estimatedValueHigh: number;
  address: string;
  agentSlug: string;
  onLeadCaptured: () => void;
  valuationResult: unknown;
}

export function LeadGate({
  estimatedValue,
  estimatedValueLow,
  estimatedValueHigh,
  address,
  agentSlug,
  onLeadCaptured,
  valuationResult,
}: LeadGateProps) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatFullPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError(t("gate.error.email"));
      return;
    }
    if (phone.replace(/\D/g, "").length < 7) {
      setError(t("gate.error.phone"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          name: name || undefined,
          address,
          agentSlug,
          valuationResult,
        }),
      });
      onLeadCaptured();
    } catch {
      // Still reveal report — lead capture shouldn't block UX
      onLeadCaptured();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      {/* Blurred preview of value */}
      <div className="glass-card p-5 sm:p-8 text-center mb-4 sm:mb-6 relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Home size={18} className="text-teal-600" />
          <span className="text-slate-500 text-sm font-medium">
            {t("gate.estimated")}
          </span>
        </div>
        <div className="value-display gradient-text mb-2 gate-value-blur">
          {formatFullPrice(estimatedValueLow)} —{" "}
          {formatFullPrice(estimatedValueHigh)}
        </div>
        <p className="text-slate-400 text-sm gate-value-blur">
          {formatFullPrice(estimatedValue)}
        </p>
        {/* Overlay blur mask */}
        <div className="gate-blur-overlay" />
      </div>

      {/* Lead capture form */}
      <motion.div
        className="glass-card p-8 pulse-glow"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("gate.ready")}</h2>
          <p className="text-slate-500 text-sm">{t("gate.subtitle")}</p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="email"
              className="input-field pl-11"
              placeholder={t("gate.email.placeholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="tel"
              className="input-field pl-11"
              placeholder={t("gate.phone.placeholder")}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Name (optional) */}
          <div className="relative">
            <User
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              className="input-field pl-11"
              placeholder={t("gate.name.placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {t("gate.button")}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <p className="text-slate-400 text-xs mt-4 text-center leading-relaxed">
          <Lock size={10} className="inline mr-1" />
          {t("gate.privacy")}
        </p>
      </motion.div>
    </motion.div>
  );
}
