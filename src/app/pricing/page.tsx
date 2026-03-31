import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Zap,
  BarChart3,
  Bell,
  Globe,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Smart Value for Agents",
  description:
    "Get your own branded AI home valuation page. Capture seller leads automatically with Smart Value's agent subscription.",
};

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Perfect for individual agents getting started with AI lead generation.",
    features: [
      "Your custom branded page",
      "Unlimited AI valuations",
      "Email + phone lead capture",
      "Real-time email notifications",
      "Social sharing with your branding",
      "Monthly lead report",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For high-volume agents who want maximum lead conversion.",
    features: [
      "Everything in Starter",
      "Custom domain support",
      "CRM webhook integration",
      "Priority AI processing",
      "Advanced analytics dashboard",
      "Dedicated support",
      "A/B test landing pages",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$249",
    period: "/mo",
    description: "For brokerages and teams managing multiple agents.",
    features: [
      "Everything in Pro",
      "Up to 10 agent sub-accounts",
      "Centralized lead routing",
      "Team performance analytics",
      "White-label branding",
      "API access",
      "Onboarding support",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const highlights = [
  {
    icon: Zap,
    title: "~$0.01 Per Valuation",
    desc: "AI-powered — no human appraiser fees",
  },
  {
    icon: BarChart3,
    title: "3x More Leads",
    desc: "Compared to traditional farming",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    desc: "Get notified the moment a lead comes in",
  },
  {
    icon: Globe,
    title: "Bilingual",
    desc: "English & Chinese — reach more homeowners",
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-[100dvh]">
      <div className="mesh-bg" />
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-600 transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Header — left-aligned, not centered */}
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10px] font-semibold uppercase tracking-wide mb-4">
            For Real Estate Agents
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl md:text-[3.25rem] mb-4">
            Turn Every Visitor
            <br />
            <span className="text-zinc-400">Into a Seller Lead</span>
          </h1>
          <p className="body-text text-base sm:text-lg">
            Get your own AI-powered home valuation page. Homeowners enter their
            address, get a free valuation, and become your leads — automatically.
          </p>
        </div>

        {/* Value Props — 2x2 grid, not 4-column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 sm:mb-14">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                <h.icon size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-800 mb-0.5">
                  {h.title}
                </h3>
                <p className="text-xs text-zinc-400">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing — Stacked layout with featured plan highlighted */}
        <div className="space-y-4 mb-10 sm:mb-14">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-panel-sm p-6 relative ${
                plan.popular
                  ? "border-emerald-300 ring-1 ring-emerald-200"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-semibold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-bold text-zinc-800">{plan.name}</h3>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-extrabold text-zinc-900 font-mono-num">
                        {plan.price}
                      </span>
                      <span className="text-zinc-400 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm mb-3 md:mb-0 max-w-md">{plan.description}</p>
                </div>
                <a
                  href={`mailto:support@kevv.ai?subject=Smart Value ${plan.name} Plan`}
                  className={`shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
              <div className="border-t border-zinc-100 mt-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {plan.features.map((f) => (
                    <span
                      key={f}
                      className="flex items-start gap-2 text-sm text-zinc-600"
                    >
                      <Check
                        size={14}
                        className="text-emerald-500 mt-0.5 shrink-0"
                      />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Solution */}
        <div className="glass-panel p-6 sm:p-8 max-w-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <Users size={18} className="text-zinc-600" />
            </div>
            <div>
              <h2 className="heading-section text-lg mb-1">
                Need a Custom Solution?
              </h2>
              <p className="text-zinc-500 text-sm mb-3">
                Enterprise brokerages, franchise networks, and tech partners — we
                offer custom integrations, volume pricing, and white-label
                deployments.
              </p>
              <a
                href="mailto:support@kevv.ai?subject=Custom Smart Value Inquiry"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center gap-1 transition-colors"
              >
                Contact our team
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
