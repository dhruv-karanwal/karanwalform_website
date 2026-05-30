"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Country {
  name: string;
  nameHi: string;
  code: string;
  flag: string;
  placeholder: string;
  maxLength: number;
}

export const COUNTRIES: Country[] = [
  {
    name: "India",
    nameHi: "भारत",
    code: "+91",
    flag: "🇮🇳",
    placeholder: "98765 43210",
    maxLength: 10,
  },
  {
    name: "United States",
    nameHi: "संयुक्त राज्य अमेरिका",
    code: "+1",
    flag: "🇺🇸",
    placeholder: "201 555 0123",
    maxLength: 10,
  },
  {
    name: "United Kingdom",
    nameHi: "यूनाइटेड किंगडम",
    code: "+44",
    flag: "🇬🇧",
    placeholder: "7911 123456",
    maxLength: 10,
  },
  {
    name: "Canada",
    nameHi: "कनाडा",
    code: "+1",
    flag: "🇨🇦",
    placeholder: "613 555 0123",
    maxLength: 10,
  },
  {
    name: "Australia",
    nameHi: "ऑस्ट्रेलिया",
    code: "+61",
    flag: "🇦🇺",
    placeholder: "412 345 678",
    maxLength: 9,
  },
  {
    name: "United Arab Emirates",
    nameHi: "संयुक्त अरब अमीरात",
    code: "+971",
    flag: "🇦🇪",
    placeholder: "50 123 4567",
    maxLength: 9,
  },
  {
    name: "Saudi Arabia",
    nameHi: "सऊदी अरब",
    code: "+966",
    flag: "🇸🇦",
    placeholder: "50 123 4567",
    maxLength: 9,
  },
  {
    name: "Nepal",
    nameHi: "नेपाल",
    code: "+977",
    flag: "🇳🇵",
    placeholder: "9812345678",
    maxLength: 10,
  },
  {
    name: "Bangladesh",
    nameHi: "बांग्लादेश",
    code: "+880",
    flag: "🇧🇩",
    placeholder: "1712345678",
    maxLength: 10,
  },
  {
    name: "Singapore",
    nameHi: "सिंगापुर",
    code: "+65",
    flag: "🇸🇬",
    placeholder: "8123 4567",
    maxLength: 8,
  },
];

interface PhoneInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  labelEn: string;
  labelHi: string;
  error?: string;
  isValid?: boolean;
  selectedCode: string;
  onCountryChange: (country: Country) => void;
  onChange: (value: string) => void;
}

export default function PhoneInputField({
  labelEn,
  labelHi,
  error,
  isValid,
  className = "",
  id,
  selectedCode,
  onCountryChange,
  onChange,
  value,
  ...props
}: PhoneInputFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently active country object
  const currentCountry = COUNTRIES.find((c) => c.code === selectedCode) || COUNTRIES[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Filter countries based on search term (name, hindi name, or dial code)
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameHi.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div className="w-full space-y-1" ref={dropdownRef}>
      <div className="relative mt-2">
        
        {/* Country Selector Trigger Button (embedded inside the input field layout) */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center h-[calc(100%-12px)]">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 h-full rounded-lg hover:bg-slate-100/60 active:bg-slate-100 transition-colors duration-150 border-r border-slate-200/80 outline-none select-none cursor-pointer"
          >
            <span className="text-base leading-none select-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">{currentCountry.flag}</span>
            <span className="text-sm font-semibold text-slate-700 font-sans tracking-tight">{currentCountry.code}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""}`} />
          </button>
        </div>

        {/* Telephone Number Input Field */}
        <input
          id={id}
          type="tel"
          value={value}
          onChange={(e) => {
            // Strip any non-digit characters for clean processing
            const digits = e.target.value.replace(/\D/g, "");
            onChange(digits);
          }}
          placeholder=" "
          maxLength={currentCountry.maxLength}
          className={`peer w-full rounded-xl border bg-slate-50/30 py-3.5 pl-[102px] pr-10 text-sm text-slate-800 outline-none transition-all duration-200
            ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : isValid
                ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                : "border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            } ${className}`}
          {...props}
        />

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

        {/* Bilingual Floating Label starting exactly after the Country Selector */}
        <label
          htmlFor={id}
          className="bilingual-floating-label absolute left-[102px] top-1/2 -translate-y-1/2 origin-[0] text-sm text-slate-400 transition-all duration-200 pointer-events-none truncate max-w-[calc(100%-7.5rem)]
            peer-focus:-translate-y-[28px] peer-focus:text-xs peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-indigo-600 peer-focus:max-w-none
            peer-[:not(:placeholder-shown)]:-translate-y-[28px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:text-slate-500 peer-[:not(:placeholder-shown)]:max-w-none"
        >
          {labelEn} <span className="font-normal text-slate-400 font-sans">/ {labelHi}</span>
        </label>

        {/* Country Selector Dropdown Overlay Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 mt-2 w-full sm:w-[320px] bg-white/95 border border-slate-100 rounded-xl shadow-2xl backdrop-blur-md z-50 p-2 overflow-hidden flex flex-col max-h-[300px]"
            >
              {/* Search Field Box */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country... / देश खोजें..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500/80 focus:bg-white transition-all duration-150"
                />
              </div>

              {/* Scrollable list of countries */}
              <div className="overflow-y-auto flex-grow space-y-0.5 pr-0.5 custom-scrollbar">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => {
                    const isSelected = country.code === selectedCode;
                    return (
                      <button
                        key={`${country.name}-${country.code}`}
                        type="button"
                        onClick={() => {
                          onCountryChange(country);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-150 cursor-pointer text-left
                          ${
                            isSelected
                              ? "bg-indigo-50/80 text-indigo-700 font-semibold"
                              : "hover:bg-slate-50 text-slate-600 active:bg-slate-100"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none filter drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.05)]">{country.flag}</span>
                          <span className="truncate max-w-[150px]">
                            {country.name} <span className="text-[10px] text-slate-400 font-sans font-normal">/ {country.nameHi}</span>
                          </span>
                        </div>
                        <span className={`font-mono text-[11px] ${isSelected ? "text-indigo-600" : "text-slate-400"}`}>
                          {country.code}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-xs text-slate-400 font-medium">
                    No results found / कोई परिणाम नहीं मिला
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Validation Error Message */}
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
