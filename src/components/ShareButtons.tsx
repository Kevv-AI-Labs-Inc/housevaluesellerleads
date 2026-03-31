"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  address: string;
  estimatedValue: number;
  agentSlug?: string;
}

export function ShareButtons({
  address,
  estimatedValue,
  agentSlug,
}: ShareButtonsProps) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  const shareText =
    locale === "zh"
      ? `我的房子估值 ${formatPrice(estimatedValue)}！用 AI 免费查看你的房子值多少 →`
      : `My home is valued at ${formatPrice(estimatedValue)}! Get a free AI home valuation →`;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = agentSlug
    ? `${baseUrl}?agent=${agentSlug}`
    : baseUrl;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const channels = [
    {
      key: "whatsapp",
      label: t("share.whatsapp"),
      color: "#25D366",
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      key: "facebook",
      label: t("share.facebook"),
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      key: "twitter",
      label: t("share.twitter"),
      color: "#18181B",
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      key: "wechat",
      label: t("share.wechat"),
      color: "#07C160",
      url: `weixin://dl/text/?text=${encodedText} ${shareUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.18 2.426c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h3 className="heading-section text-base mb-4 flex items-center gap-2">
        <Share2 size={16} className="text-emerald-600" />
        {t("share.title")}
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {channels.map((ch) => (
          <a
            key={ch.key}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn"
            style={{ "--share-color": ch.color } as React.CSSProperties}
          >
            {ch.icon}
            <span>{ch.label}</span>
          </a>
        ))}
        <button onClick={handleCopy} className="share-btn share-btn-copy">
          {copied ? (
            <Check size={14} className="text-emerald-500" />
          ) : (
            <Copy size={14} />
          )}
          <span>{copied ? t("share.copied") : t("share.copy")}</span>
        </button>
      </div>
    </div>
  );
}
