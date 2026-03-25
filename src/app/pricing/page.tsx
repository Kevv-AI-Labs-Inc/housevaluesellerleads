import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Zap,
  BarChart3,
  Bell,
  Globe,
  Users,
  ArrowRight,
  Palette,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          <Sparkles size={14} />
          For Real Estate Agents
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4">
          <span className="gradient-text">Turn Every Visitor</span>
          <br />
          <span className="text-slate-800">Into a Seller Lead</span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
          Get your own AI-powered home valuation page. Homeowners enter their
          address, get a free valuation, and become your leads — automatically.
        </p>
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-16">
        {highlights.map((h) => (
          <div
            key={h.title}
            className="report-card text-center p-5"
          >
            <h.icon size={22} className="text-teal-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              {h.title}
            </h3>
            <p className="text-xs text-slate-400">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`report-card p-6 relative ${
              plan.popular
                ? "border-teal-400 ring-1 ring-teal-200"
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-semibold">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-extrabold gradient-text">
                {plan.price}
              </span>
              <span className="text-slate-400 text-sm">{plan.period}</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <Check
                    size={16}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={`mailto:support@kevv.ai?subject=Smart Value ${plan.name} Plan`}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                plan.popular
                  ? "btn-primary"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {plan.cta}
              <ArrowRight size={14} />
            </a>
          </div>
        ))}
      </div>

      {/* FAQ-like section */}
      <div className="text-center">
        <div className="glass-card p-5 sm:p-8 max-w-2xl mx-auto">
          <Users size={24} className="text-teal-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Need a Custom Solution?
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Enterprise brokerages, franchise networks, and tech partners — we
            offer custom integrations, volume pricing, and white-label
            deployments.
          </p>
          <a
            href="mailto:support@kevv.ai?subject=Custom Smart Value Inquiry"
            className="text-teal-600 hover:text-teal-700 font-medium text-sm inline-flex items-center gap-1"
          >
            Contact our team
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Footer */}
      <Palette size={0} className="hidden" />
    </div>
  );
}
