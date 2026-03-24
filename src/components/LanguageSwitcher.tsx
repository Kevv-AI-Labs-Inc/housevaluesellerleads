"use client";

import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="lang-switcher"
      aria-label="Switch language"
    >
      <Globe size={14} />
      <span>{locale === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}
