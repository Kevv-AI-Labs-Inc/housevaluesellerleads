"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4">
      <div className="mesh-bg" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="relative z-10 text-center max-w-md"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h1 className="heading-display text-2xl mb-3">
          Something Went Wrong
        </h1>
        <p className="body-text text-sm mx-auto mb-8">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-600 transition-colors text-sm"
          >
            <Home size={14} />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
