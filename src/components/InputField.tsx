"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelEn: string;
  labelHi: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  isValid?: boolean;
}

export default function InputField({
  labelEn,
  labelHi,
  icon: Icon,
  error,
  isValid,
  className = "",
  id,
  placeholder = " ",
  ...props
}: InputFieldProps) {
  return (
    <div className="w-full space-y-1">
      <div className="relative mt-2">
        {/* Input Element */}
        <input
          id={id}
          placeholder={placeholder}
          className={`peer w-full rounded-xl border bg-slate-50/30 py-3.5 pl-11 pr-10 text-sm text-slate-800 outline-none transition-all duration-200
            ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : isValid
                ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                : "border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            } ${className}`}
          {...props}
        />

        {/* Left Side Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 peer-focus:text-indigo-500 peer-[:not(:placeholder-shown)]:text-indigo-500 pointer-events-none">
          <Icon className="h-5 w-5" />
        </div>

        {/* Right Side Status Icons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-rose-500"
            >
              <AlertCircle className="h-5 w-5" />
            </motion.div>
          )}
          {!error && isValid && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-emerald-500"
            >
              <CheckCircle2 className="h-5 w-5" />
            </motion.div>
          )}
        </div>

        {/* Bilingual Floating Label */}
        <label
          htmlFor={id}
          className="bilingual-floating-label absolute left-11 top-1/2 -translate-y-1/2 origin-[0] text-sm text-slate-400 transition-all duration-200 pointer-events-none truncate max-w-[calc(100%-3.5rem)]
            peer-focus:-translate-y-[28px] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-indigo-600 peer-focus:max-w-none
            peer-[:not(:placeholder-shown)]:-translate-y-[28px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:text-slate-500 peer-[:not(:placeholder-shown)]:max-w-none"
        >
          {labelEn} <span className="font-normal text-slate-400 font-sans">/ {labelHi}</span>
        </label>
      </div>

      {/* Animated Validation Message Container */}
      <div className="h-5 overflow-hidden">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-semibold text-rose-500 pl-1.5"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
