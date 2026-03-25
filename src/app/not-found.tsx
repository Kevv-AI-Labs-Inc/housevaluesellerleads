"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors"
          >
            <Search size={16} />
            Get Valuation
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
