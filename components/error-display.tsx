"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  autoHide?: number;
}

export function ErrorDisplay({
  error,
  onDismiss,
  autoHide = 5000,
}: ErrorDisplayProps) {
  const [visible, setVisible] = React.useState(!!error);

  React.useEffect(() => {
    if (error) {
      setVisible(true);
      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, autoHide);
        return () => clearTimeout(timer);
      }
    }
  }, [error, autoHide, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && error && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex items-start gap-3 shadow-md hover:shadow-lg transition-shadow">
            <div className="shrink-0 pt-0.5">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                Error
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 ml-auto p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
