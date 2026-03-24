"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export function PricingCTA() {
  const { t } = useI18n();

  const features = [
    t("pricing.feature1"),
    t("pricing.feature2"),
    t("pricing.feature3"),
  ];

  return (
    <motion.div
      className="pricing-cta-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Sparkles size={12} />
          {t("pricing.badge")}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2">{t("pricing.title")}</h3>
      <p className="text-slate-400 text-sm mb-4">
        {t("pricing.subtitle")}{" "}
        <span className="text-indigo-300 font-bold text-base">
          {t("pricing.price")}
        </span>
      </p>

      <div className="flex flex-wrap gap-4 mb-5">
        {features.map((f) => (
          <span
            key={f}
            className="flex items-center gap-1.5 text-sm text-slate-300"
          >
            <Check size={14} className="text-emerald-400" />
            {f}
          </span>
        ))}
      </div>

      <Link
        href="/pricing"
        className="btn-primary inline-flex items-center gap-2"
      >
        {t("pricing.button")}
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}
