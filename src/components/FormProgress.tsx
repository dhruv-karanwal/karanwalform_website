"use client";

import React from "react";
import { motion } from "framer-motion";

interface FormProgressProps {
  filledCount: number;
  totalCount: number;
}

export default function FormProgress({ filledCount, totalCount }: FormProgressProps) {
  const percentage = Math.round((filledCount / totalCount) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 sm:text-sm">
        <span>
          Form Progress <span className="text-indigo-600 font-medium">/ फॉर्म प्रगति</span>
        </span>
        <span className="text-indigo-600 font-bold">
          {percentage}% Completed <span className="text-slate-400 font-normal font-sans">/ {percentage}% पूर्ण</span>
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 sm:text-xs">
        <span>
          {filledCount} of {totalCount} fields completed / {totalCount} में से {filledCount} क्षेत्र पूर्ण
        </span>
      </div>
    </div>
  );
}
