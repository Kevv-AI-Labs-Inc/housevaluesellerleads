"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  Phone,
  MessageCircle,
  CalendarCheck,
  User,
  X,
  ArrowRight,
  Star,
  ChevronUp,
} from "lucide-react";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

interface AgentCTAProps {
  agentSlug: string;
  address: string;
  estimatedValue?: string;
}

export function AgentCTA({ agentSlug, address, estimatedValue }: AgentCTAProps) {
  const { t, locale } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", time: "" });
  const [submitted, setSubmitted] = useState(false);

  const isAgentLinked = !!agentSlug && agentSlug !== "default";

  const handleScheduleSubmit = async () => {
    if (!form.name || !form.phone) return;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `${form.phone}@schedule.smartvalue`,
          phone: form.phone,
          name: form.name,
          address,
          agentSlug,
          valuationResult: { action: "schedule_call", preferredTime: form.time },
        }),
      });
    } catch {
      // Non-blocking
    }
    setSubmitted(true);
  };

  const handleActionClick = async (action: string) => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `${action}@action.smartvalue`,
          phone: "",
          name: "",
          address,
          agentSlug,
          valuationResult: { action },
        }),
      });
    } catch {
      // Non-blocking
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, ...springTransition }}
        onClick={() => setExpanded(!expanded)}
        className="agent-cta-trigger"
        aria-label="Contact Agent"
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={springTransition}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={springTransition}
              className="relative"
            >
              <MessageCircle size={20} />
              <span className="agent-cta-badge" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expanded Panel — Liquid Glass */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.93 }}
            transition={springTransition}
            className="agent-cta-panel"
          >
            {/* Header */}
            <div className="agent-cta-header">
              <div className="agent-cta-avatar">
                {isAgentLinked ? (
                  <span className="text-lg font-bold text-white/90">
                    {agentSlug.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zinc-800 truncate">
                  {isAgentLinked
                    ? t("agent.linked.title")
                    : t("agent.generic.title")}
                </h3>
                <p className="text-xs text-zinc-500 truncate">
                  {isAgentLinked
                    ? t("agent.linked.subtitle")
                    : t("agent.generic.subtitle")}
                </p>
              </div>
              {isAgentLinked && (
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Context */}
            {estimatedValue && (
              <div className="agent-cta-context">
                <span className="text-xs text-zinc-400">
                  {t("agent.about")}
                </span>
                <span className="text-xs font-semibold text-zinc-700 truncate">
                  {address}
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono-num">
                  {estimatedValue}
                </span>
              </div>
            )}

            {/* Schedule Form or Actions */}
            <AnimatePresence mode="wait">
              {showSchedule && !submitted ? (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={springTransition}
                  className="agent-cta-schedule"
                >
                  <input
                    type="text"
                    placeholder={t("agent.schedule.name")}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="agent-cta-input"
                  />
                  <input
                    type="tel"
                    placeholder={t("agent.schedule.phone")}
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="agent-cta-input"
                  />
                  <select
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    className="agent-cta-input"
                  >
                    <option value="">{t("agent.schedule.time")}</option>
                    <option value="morning">
                      {locale === "zh" ? "上午 (9-12)" : "Morning (9-12)"}
                    </option>
                    <option value="afternoon">
                      {locale === "zh" ? "下午 (12-5)" : "Afternoon (12-5)"}
                    </option>
                    <option value="evening">
                      {locale === "zh" ? "晚上 (5-8)" : "Evening (5-8)"}
                    </option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSchedule(false)}
                      className="flex-1 text-xs text-zinc-400 hover:text-zinc-600 py-2 transition-colors"
                    >
                      {locale === "zh" ? "返回" : "Back"}
                    </button>
                    <button
                      onClick={handleScheduleSubmit}
                      disabled={!form.name || !form.phone}
                      className="agent-cta-submit"
                    >
                      {t("agent.schedule.submit")}
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springTransition}
                  className="text-center py-4 px-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                    <CalendarCheck
                      size={18}
                      className="text-emerald-600"
                    />
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 mb-1">
                    {t("agent.schedule.confirmed")}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {t("agent.schedule.confirmedSub")}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="actions" className="agent-cta-actions">
                  {/* Call */}
                  <button
                    onClick={() => {
                      handleActionClick("call");
                      window.open("tel:+1234567890");
                    }}
                    className="agent-cta-action agent-cta-action--call"
                  >
                    <Phone size={16} />
                    <span>{t("agent.action.call")}</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      handleActionClick("whatsapp");
                      const msg = encodeURIComponent(
                        `Hi, I just got an AI valuation for ${address}${estimatedValue ? ` (${estimatedValue})` : ""} and I'd like to learn more.`
                      );
                      window.open(
                        `https://wa.me/?text=${msg}`,
                        "_blank"
                      );
                    }}
                    className="agent-cta-action agent-cta-action--wa"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>

                  {/* Schedule */}
                  <button
                    onClick={() => {
                      handleActionClick("schedule");
                      setShowSchedule(true);
                    }}
                    className="agent-cta-action agent-cta-action--schedule"
                  >
                    <CalendarCheck size={16} />
                    <span>{t("agent.action.schedule")}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom teaser */}
            {!showSchedule && !submitted && (
              <div className="text-center pt-1 pb-2">
                <button
                  onClick={() => setShowSchedule(true)}
                  className="text-[10px] text-zinc-400 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                >
                  <ChevronUp size={10} />
                  {t("agent.cta.teaser")}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
