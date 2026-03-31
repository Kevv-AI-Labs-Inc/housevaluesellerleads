"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Check } from "lucide-react";

export function PricingCTA() {
  const { t } = useI18n();

  const features = [
    t("pricing.feature1"),
    t("pricing.feature2"),
    t("pricing.feature3"),
  ];

  return (
    <div className="pricing-cta-card">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-semibold uppercase tracking-wide mb-3">
            {t("pricing.badge")}
          </span>
          <h3 className="heading-section text-lg mb-1">{t("pricing.title")}</h3>
          <p className="text-zinc-500 text-sm">
            {t("pricing.subtitle")}{" "}
            <span className="text-zinc-800 font-bold text-base font-mono-num">
              {t("pricing.price")}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-5">
        {features.map((f) => (
          <span
            key={f}
            className="flex items-center gap-1.5 text-sm text-zinc-600"
          >
            <Check size={14} className="text-emerald-500" />
            {f}
          </span>
        ))}
      </div>

      <Link
        href="/pricing"
        className="btn-primary inline-flex items-center gap-2 text-sm"
      >
        {t("pricing.button")}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
