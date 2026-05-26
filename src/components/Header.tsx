"use client";

import React from "react";
import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-indigo-200">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-slate-800 sm:text-base">
                KaranwalGroup <span className="text-indigo-600 font-medium font-sans">/ करनवाल ग्रुप</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium sm:text-xs">
                Official Form Service <span className="font-light">/ आधिकारिक फॉर्म सेवा</span>
              </p>
            </div>
          </div>

          {/* Bilingual Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              EN / हिन्दी
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
