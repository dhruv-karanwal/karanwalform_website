"use client";

import React from "react";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-100 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          {/* Security and SSL Statement */}
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-xs font-medium">
              Secure Corporate Portal <span className="font-light text-slate-400 font-sans">/ सुरक्षित कॉर्पोरेट पोर्टल</span>
            </span>
          </div>

          {/* Legal and Disclaimer Notice */}
          <div className="space-y-1 sm:text-right">
            <p className="text-xs font-bold text-slate-500">
              © {new Date().getFullYear()} KaranwalGroup. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              This is a secure official registration utility. Your personal data is protected under absolute privacy regulations.
            </p>
            <p className="text-[10px] font-semibold text-indigo-500 font-sans">
              यह एक सुरक्षित आधिकारिक पंजीकरण उपयोगिता है। आपका व्यक्तिगत डेटा पूर्ण गोपनीयता नियमों के तहत सुरक्षित है।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
