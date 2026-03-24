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
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
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
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle size={22} />
              <span className="agent-cta-badge" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="agent-cta-panel"
          >
            {/* Header */}
            <div className="agent-cta-header">
              <div className="agent-cta-avatar">
                {isAgentLinked ? (
                  <span className="text-lg font-bold text-white">
                    {agentSlug.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">
                  {isAgentLinked
                    ? t("agent.linked.title")
                    : t("agent.generic.title")}
                </h3>
                <p className="text-xs text-slate-400 truncate">
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
                <span className="text-xs text-slate-500">
                  {t("agent.about")}
                </span>
                <span className="text-xs font-semibold text-indigo-300 truncate">
                  {address}
                </span>
                <span className="text-xs font-bold text-emerald-400">
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
                      className="flex-1 text-xs text-slate-500 hover:text-slate-300 py-2 transition-colors"
                    >
                      {locale === "zh" ? "返回" : "Back"}
                    </button>
                    <button
                      onClick={handleScheduleSubmit}
                      disabled={!form.name || !form.phone}
                      className="agent-cta-submit"
                    >
                      {t("agent.schedule.submit")}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4 px-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <CalendarCheck
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {t("agent.schedule.confirmed")}
                  </p>
                  <p className="text-xs text-slate-400">
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
                  className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
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
