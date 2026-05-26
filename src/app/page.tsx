"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Users, Phone, MapPin, Send, Loader2, AlertCircle } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormProgress from "@/components/FormProgress";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import Toast from "@/components/Toast";

// Paste your Google Apps Script URL here if not using .env.local
const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbxgrTJHnKjWzHYoyNwI3GdxlgOkn5ZTJR3Q-A7x9CHWlhLOS4LtjhEI0LFVm6oaPDleeQ/exec";

interface FormValues {
  fullName: string;
  age: string;
  fathersName: string;
  contactNumber: string;
  address: string;
}

type FieldName = keyof FormValues;

export default function Home() {
  // Form values state
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    age: "",
    fathersName: "",
    contactNumber: "",
    address: "",
  });

  // Track field touch state (prevents showing validation warnings immediately)
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    fullName: false,
    age: false,
    fathersName: false,
    contactNumber: false,
    address: false,
  });

  // Track validation errors
  const [errors, setErrors] = useState<Record<FieldName, string>>({
    fullName: "",
    age: "",
    fathersName: "",
    contactNumber: "",
    address: "",
  });

  // Track field validity
  const [validFields, setValidFields] = useState<Record<FieldName, boolean>>({
    fullName: false,
    age: false,
    fathersName: false,
    contactNumber: false,
    address: false,
  });

  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track submission/network errors from Apps Script API
  const [apiError, setApiError] = useState<string>("");

  // Validation function
  const validateField = (name: FieldName, val: string): { err: string; valid: boolean } => {
    let err = "";
    let valid = false;

    switch (name) {
      case "fullName": {
        const cleaned = val.trim();
        if (cleaned.length === 0) {
          err = "";
        } else if (cleaned.length < 3) {
          err = "Name must be at least 3 characters / नाम कम से कम 3 अक्षर का होना चाहिए";
        } else if (!/^[a-zA-Z\s]+$/.test(cleaned)) {
          err = "Letters and spaces only / केवल अक्षर और स्पेस मान्य हैं";
        } else {
          valid = true;
        }
        break;
      }
      case "age": {
        const parsed = parseInt(val, 10);
        if (val === "") {
          err = "";
        } else if (isNaN(parsed) || !/^\d+$/.test(val)) {
          err = "Please enter a valid age number / कृपया एक मान्य आयु संख्या दर्ज करें";
        } else if (parsed < 1 || parsed > 120) {
          err = "Age must be between 1 and 120 / आयु 1 से 120 के बीच होनी चाहिए";
        } else {
          valid = true;
        }
        break;
      }
      case "fathersName": {
        const cleaned = val.trim();
        if (cleaned.length === 0) {
          err = "";
        } else if (cleaned.length < 3) {
          err = "Father's name must be at least 3 characters / पिता का नाम कम से कम 3 अक्षर का होना चाहिए";
        } else if (!/^[a-zA-Z\s]+$/.test(cleaned)) {
          err = "Letters and spaces only / केवल अक्षर और स्पेस मान्य हैं";
        } else {
          valid = true;
        }
        break;
      }
      case "contactNumber": {
        if (val === "") {
          err = "";
        } else if (!/^[6-9]\d{9}$/.test(val)) {
          err = "Enter a valid 10-digit number starting with 6-9 / 6-9 से शुरू होने वाला मान्य 10-अंकीय नंबर दर्ज करें";
        } else {
          valid = true;
        }
        break;
      }
      case "address": {
        const cleaned = val.trim();
        if (cleaned.length === 0) {
          err = "";
        } else if (cleaned.length < 15) {
          err = "Address must be at least 15 characters / पता कम से कम 15 अक्षर का होना चाहिए";
        } else if (cleaned.length > 300) {
          err = "Address cannot exceed 300 characters / पता 300 अक्षरों से अधिक नहीं हो सकता";
        } else {
          valid = true;
        }
        break;
      }
    }

    return { err, valid };
  };

  // Perform live validation on change
  useEffect(() => {
    const newErrors = { ...errors };
    const newValid = { ...validFields };

    Object.keys(values).forEach((key) => {
      const field = key as FieldName;
      const { err, valid } = validateField(field, values[field]);
      newErrors[field] = err;
      newValid[field] = valid;
    });

    setErrors(newErrors);
    setValidFields(newValid);
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const filledCount = Object.values(validFields).filter(Boolean).length;
  const totalCount = Object.keys(values).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(""); // Clear previous errors

    // Touch all fields to show validation status on blank/partial items
    const allTouched = { ...touched };
    Object.keys(touched).forEach((key) => {
      allTouched[key as FieldName] = true;
    });
    setTouched(allTouched);

    const allValid = Object.values(validFields).every(Boolean);

    if (!allValid) {
      // Find first invalid key and focus it
      const firstInvalidKey = Object.keys(validFields).find(
        (key) => !validFields[key as FieldName]
      ) as FieldName | undefined;

      if (firstInvalidKey) {
        const fieldErrors = { ...errors };
        Object.keys(values).forEach((k) => {
          const f = k as FieldName;
          if (!values[f]) {
            if (f === "fullName") fieldErrors[f] = "Full Name is required / पूरा नाम आवश्यक है";
            if (f === "age") fieldErrors[f] = "Age is required / आयु आवश्यक है";
            if (f === "fathersName") fieldErrors[f] = "Father's Name is required / पिता का नाम आवश्यक है";
            if (f === "contactNumber") fieldErrors[f] = "Contact Number is required / संपर्क संख्या आवश्यक है";
            if (f === "address") fieldErrors[f] = "Address is required / आवासीय पता आवश्यक है";
          }
        });
        setErrors(fieldErrors);

        const el = document.getElementById(firstInvalidKey);
        el?.focus();
      }
      return;
    }

    // Submission flow using fetch & Google Apps Script
    setIsSubmitting(true);

    try {
      // Resolve Apps Script API endpoint (env URL takes precedence over fallback constant)
      const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || DEFAULT_SHEET_URL;

      if (!endpoint || endpoint.includes("PASTE_YOUR_COPIED_URL_HERE")) {
        throw new Error("API URL is not configured. Please paste your Google Apps Script URL. / एपीआई यूआरएल कॉन्फ़िगर नहीं है। कृपया अपना Google Apps Script URL पेस्ट करें।");
      }

      // We transmit the JSON body as "text/plain" to bypass CORS pre-flight OPTIONS blockades
      const response = await fetch(endpoint, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status} / एचटीटीपी त्रुटि स्थिति: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        setShowToast(true);
        // Reset Form State on absolute success
        setValues({
          fullName: "",
          age: "",
          fathersName: "",
          contactNumber: "",
          address: "",
        });
        setTouched({
          fullName: false,
          age: false,
          fathersName: false,
          contactNumber: false,
          address: false,
        });
      } else {
        throw new Error(result.message || "Failed to save submission / सबमिशन सहेजने में विफल");
      }

    } catch (err: any) {
      console.error("Submission failed:", err);
      // Map server or network failure messages beautifully
      const errMsg = err.message || err.toString();
      if (errMsg.includes("Failed to fetch")) {
        setApiError("Network Connection Timeout. Please check your internet connection or verify script deployment. / नेटवर्क कनेक्शन समय समाप्त। कृपया अपना इंटरनेट कनेक्शन जांचें या स्क्रिप्ट परिनियोजन सत्यापित करें।");
      } else {
        setApiError(errMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Modern premium visual background blobs */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-10 right-10 -z-10 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Intro Text header */}
          <div className="text-center mb-8 space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Bilingual Survey & Registration Portal
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Registration Form <span className="text-indigo-600 font-medium font-sans">/ पंजीकरण फॉर्म</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto sm:text-sm">
              Please enter your accurate personal credentials below. Every field marked is essential for dynamic profile creation.
              <span className="block mt-1 font-sans text-indigo-500 font-semibold text-xs leading-relaxed">
                कृपया नीचे अपने सटीक व्यक्तिगत क्रेडेंशियल दर्ज करें। प्रोफ़ाइल निर्माण के लिए प्रत्येक क्षेत्र आवश्यक है।
              </span>
            </p>
          </div>

          {/* Form Card wrapper */}
          <div className="bg-white/95 border border-slate-100/80 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Live Progress Bar */}
            <FormProgress filledCount={filledCount} totalCount={totalCount} />

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <InputField
                id="fullName"
                name="fullName"
                type="text"
                labelEn="Full Name"
                labelHi="पूरा नाम"
                icon={User}
                value={values.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                error={touched.fullName ? errors.fullName : ""}
                isValid={touched.fullName && validFields.fullName}
                maxLength={50}
                required
              />

              {/* Age */}
              <InputField
                id="age"
                name="age"
                type="text"
                labelEn="Age (in years)"
                labelHi="आयु (वर्षों में)"
                icon={Calendar}
                value={values.age}
                onChange={handleChange}
                onBlur={() => handleBlur("age")}
                error={touched.age ? errors.age : ""}
                isValid={touched.age && validFields.age}
                maxLength={3}
                required
              />

              {/* Father's Name */}
              <InputField
                id="fathersName"
                name="fathersName"
                type="text"
                labelEn="Father's Name"
                labelHi="पिता का नाम"
                icon={Users}
                value={values.fathersName}
                onChange={handleChange}
                onBlur={() => handleBlur("fathersName")}
                error={touched.fathersName ? errors.fathersName : ""}
                isValid={touched.fathersName && validFields.fathersName}
                maxLength={50}
                required
              />

              {/* Contact Number */}
              <InputField
                id="contactNumber"
                name="contactNumber"
                type="tel"
                labelEn="Contact Number"
                labelHi="संपर्क संख्या"
                icon={Phone}
                value={values.contactNumber}
                onChange={handleChange}
                onBlur={() => handleBlur("contactNumber")}
                error={touched.contactNumber ? errors.contactNumber : ""}
                isValid={touched.contactNumber && validFields.contactNumber}
                maxLength={10}
                required
              />

              {/* Residential Address */}
              <TextareaField
                id="address"
                name="address"
                labelEn="Residential Address"
                labelHi="आवासीय पता"
                icon={MapPin}
                value={values.address}
                onChange={handleChange}
                onBlur={() => handleBlur("address")}
                error={touched.address ? errors.address : ""}
                isValid={touched.address && validFields.address}
                maxLength={300}
                required
              />

              {/* Animated API Error Notification Banner */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-2.5 rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs leading-relaxed text-rose-700 sm:text-sm"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                    <div>
                      <p className="font-bold">Transmission Failed / ट्रांसमिशन विफल रहा</p>
                      <p className="mt-1 font-medium">{apiError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full relative py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-lg shadow-indigo-200/50 outline-none flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing... / प्रक्रिया जारी है...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4.5 w-4.5" />
                      <span>Submit Form <span className="font-normal font-sans text-indigo-100 opacity-90">/ फॉर्म जमा करें</span></span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        messageEn="Your profile credentials have been successfully registered."
        messageHi="आपके प्रोफ़ाइल क्रेडेंशियल्स को सफलतापूर्वक पंजीकृत कर लिया गया है।"
      />

      <Footer />
    </>
  );
}
