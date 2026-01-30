"use client";

import React from "react";
import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessDisplayProps {
  message: string | null;
  onDismiss?: () => void;
  autoHide?: number;
}

export function SuccessDisplay({
  message,
  onDismiss,
  autoHide = 3000,
}: SuccessDisplayProps) {
  const [visible, setVisible] = React.useState(!!message);

  React.useEffect(() => {
    if (message) {
      setVisible(true);
      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, autoHide);
        return () => clearTimeout(timer);
      }
    }
  }, [message, autoHide, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg p-4 flex items-start gap-3 shadow-md hover:shadow-lg transition-shadow">
            <div className="shrink-0 pt-0.5">
              <motion.div
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                {message}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 ml-auto p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              aria-label="Dismiss success"
            >
              <X className="h-4 w-4 text-green-600 dark:text-green-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
