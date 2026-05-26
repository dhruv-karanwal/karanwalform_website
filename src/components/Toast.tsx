"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  show: boolean;
  onClose: () => void;
  messageEn: string;
  messageHi: string;
}

export default function Toast({ show, onClose, messageEn, messageHi }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-xl backdrop-blur-md shadow-emerald-500/5"
          >
            {/* Animated Success Check Ring */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-md shadow-emerald-200">
              <Check className="h-5 w-5 text-white" />
            </div>

            {/* Success Message Details */}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800">
                Submission Successful! <span className="text-emerald-600 font-medium">/ सफल सबमिशन!</span>
              </h4>
              <p className="text-[11px] font-medium text-slate-500 sm:text-xs">
                {messageEn}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-indigo-600 sm:text-xs font-sans">
                {messageHi}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
