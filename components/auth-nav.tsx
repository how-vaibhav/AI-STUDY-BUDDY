"use client";

import React from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export function AuthNav() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-indigo-600/95 via-purple-600/95 to-indigo-600/95 dark:from-slate-950/95 dark:via-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl border-b border-white/10 dark:border-slate-700/30 h-16 shadow-lg"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="h-full flex items-center justify-between px-6 max-w-7xl mx-auto w-full">
        <Link
          href="/welcome"
          aria-label="Back to welcome"
          className="flex items-center gap-4"
        >
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className="p-2.5 rounded-lg bg-white/15 dark:bg-slate-700/40 backdrop-blur-sm border border-white/20 dark:border-slate-600/20 hover:bg-white/25 dark:hover:bg-slate-700/60 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-6 h-6 text-white dark:text-indigo-300" />
            </motion.div>
            <motion.div className="flex flex-col leading-tight">
              <motion.span
                className="text-lg font-bold text-white dark:text-slate-100 tracking-tight"
                initial={{ letterSpacing: "0.05em" }}
                animate={{ letterSpacing: "0em" }}
                transition={{ duration: 0.6 }}
              >
                Cerevia
              </motion.span>
              <motion.span
                className="text-xs text-white/75 dark:text-slate-300/70 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The Path to Understanding
              </motion.span>
            </motion.div>
          </motion.div>
        </Link>

        {/* Decorative line */}
        <motion.div
          className="flex-1 h-px bg-linear-to-r from-white/0 via-white/20 to-white/0 dark:from-slate-600/0 dark:via-slate-500/20 dark:to-slate-600/0 mx-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Status indicator */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white/70 dark:text-slate-300/70 font-medium">
            Ready
          </span>
        </motion.div>
      </div>
    </motion.nav>
  );
}
