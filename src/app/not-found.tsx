"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function NotFound() {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4">
      <div className="mesh-bg" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="relative z-10 text-center max-w-md"
      >
        <div className="text-8xl font-extrabold text-zinc-200 mb-4 tracking-tighter font-mono-num">
          404
        </div>
        <h1 className="heading-display text-2xl mb-3">
          Page Not Found
        </h1>
        <p className="body-text text-sm mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Home size={14} />
            Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-600 transition-colors text-sm"
          >
            <Search size={14} />
            Get Valuation
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
