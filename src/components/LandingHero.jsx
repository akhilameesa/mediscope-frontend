import React from 'react';
import { ArrowRight, LogIn, FileSpreadsheet, ShieldCheck, Microscope, Sparkles } from 'lucide-react';

export default function LandingHero({ onOpenAuth }) {
  return (
    <section className="relative overflow-hidden py-14 lg:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#EDE8F5] via-[#FFFFFF] to-[#EDE8F5]">
      {/* Decorative background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7091E6]/20 to-[#ADBBDA]/30 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Title & Sequential Text Animation */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#ADBBDA] shadow-xs">
            <Microscope className="w-4 h-4 text-[#7091E6]" />
            <span className="text-xs font-bold text-[#3D52A0] tracking-wide uppercase">
              Next-Gen Medical Report Intelligence
            </span>
          </div>

          {/* ============================================================================ */}
          {/* CRITICAL ANIMATION ZONE: CUMULATIVE SEQUENTIAL TEXT FORMATION               */}
          {/* Text lines MUST NEVER disappear, fade out, replace each other, or shift      */}
          {/* position after appearing. Previous lines stay permanently fixed in place!   */}
          {/* ============================================================================ */}
          <div className="space-y-4 py-2">
            {/* Line 1 (0.2s delay): "MEDISCOPE — HEALTH REPORT COMPANION" */}
            <div
              className="anim-seq-1 text-3xl sm:text-4xl lg:text-5xl font-black text-[#3D52A0] tracking-tight uppercase"
              style={{ animationFillMode: 'forwards' }}
            >
              MEDISCOPE — HEALTH REPORT COMPANION
            </div>

            {/* Line 2 (1.2s delay): "Understand your reports better." (Indented slightly right) */}
            <div
              className="anim-seq-2 pl-6 sm:pl-10 text-xl sm:text-2xl lg:text-3xl font-bold text-[#7091E6] tracking-normal"
              style={{ animationFillMode: 'forwards' }}
            >
              Understand your reports better.
            </div>

            {/* Line 3 (2.2s delay): "Prepare for better conversations with your healthcare professional." (Indented further right) */}
            <div
              className="anim-seq-3 pl-12 sm:pl-20 text-base sm:text-lg lg:text-xl font-semibold text-[#3D52A0] leading-snug"
              style={{ animationFillMode: 'forwards' }}
            >
              Prepare for better conversations with your healthcare professional.
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#8697C4] max-w-xl font-medium leading-relaxed">
            Mediscope bridges the gap between complex diagnostic laboratory metrics and patient clarity. Securely store family health documents, track longitudinal biological deltas, and enter your doctor's office equipped with synthesized clinical consultation questions.
          </p>

          {/* Primary Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-white font-extrabold text-sm sm:text-base bg-[#7091E6] hover:bg-[#3D52A0] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Get Started / Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-[#3D52A0] font-bold text-sm sm:text-base bg-[#FFFFFF] hover:bg-[#EDE8F5] border border-[#ADBBDA] shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#7091E6]" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-[#8697C4]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7091E6]" />
              <span>Encrypted Storage & RAG Context</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-[#7091E6]" />
              <span>Automated Biomarker Range Validation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Medical Graphic / Illustration with Hover Zoom */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md med-card p-4 bg-[#FFFFFF] overflow-hidden group">
            {/* Medical graphic preview card */}
            <div className="med-img-zoom rounded-xl bg-gradient-to-br from-[#EDE8F5] to-[#ADBBDA]/30 p-6 flex flex-col items-center justify-center text-center relative">
              {/* Doctor Reviewing Digital Chart Graphic Representation */}
              <div className="w-24 h-24 rounded-2xl bg-white border border-[#ADBBDA] shadow-md flex items-center justify-center text-[#7091E6] mb-4 group-hover:scale-105 transition-transform duration-300">
                <Microscope className="w-12 h-12 stroke-[1.8]" />
              </div>

              <div className="space-y-1.5 mb-5">
                <div className="text-base font-extrabold text-[#3D52A0]">
                  AI Clinical Intelligence Suite
                </div>
                <div className="text-xs text-[#8697C4] font-medium">
                  PyMuPDF OCR • RAG Knowledge Base • Trend Deltas
                </div>
              </div>

              {/* Sample Lab Preview Badge */}
              <div className="w-full bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-[#ADBBDA] text-left space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3D52A0]">Fasting Blood Glucose</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                    HIGH (128 mg/dL)
                  </span>
                </div>
                <div className="w-full bg-[#EDE8F5] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#7091E6] h-full w-[80%] rounded-full"></div>
                </div>
                <div className="text-[10px] text-[#8697C4] flex justify-between">
                  <span>Standard: 70 - 99 mg/dL</span>
                  <span className="text-[#3D52A0] font-bold">Delta: -13 mg/dL</span>
                </div>
              </div>
            </div>

            {/* Soft decorative badge */}
            <div className="mt-3 py-2 px-3 bg-[#EDE8F5] rounded-xl flex items-center justify-between text-xs font-bold text-[#3D52A0]">
              <span>Proprietary Platform by Akhila Meesa</span>
              <Sparkles className="w-4 h-4 text-[#7091E6]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
