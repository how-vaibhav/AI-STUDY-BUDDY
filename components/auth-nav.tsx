"use client";

import React from "react";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export function AuthNav() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-indigo-600/90 backdrop-blur-md border-b border-white/10 h-16"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="h-full flex items-center justify-center px-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-white tracking-wide">
              Cerevia
            </span>
            <span className="text-xs text-white/80">
              The Path to Understanding
            </span>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
