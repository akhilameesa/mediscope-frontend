import React from 'react';
import { ShieldAlert, Award, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#EDE8F5] border-t border-[#ADBBDA] mt-auto py-8 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Safety Disclaimer Banner */}
        <div className="bg-[#FFFFFF] border border-[#ADBBDA] rounded-xl p-4 sm:p-5 shadow-sm flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-[#EDE8F5] text-[#3D52A0] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-[#3D52A0] leading-relaxed font-medium">
            <span className="font-bold text-[#3D52A0] uppercase tracking-wider mr-1">Safety Notice:</span>
            Mediscope is an educational health report companion, NOT a diagnostic platform or medical decision system. All outputs are intended for appointment preparation with a qualified healthcare provider.
          </p>
        </div>

        {/* Legal Ownership & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 text-center md:text-left text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#3D52A0]">
            <Award className="w-4 h-4 text-[#7091E6]" />
            <span className="font-semibold">
              Proprietary Platform Created & Owned by <span className="underline decoration-[#7091E6] underline-offset-4">Akhila Meesa</span>
            </span>
          </div>

          <div className="text-[#3D52A0] font-medium max-w-2xl leading-relaxed">
            Copyright © 2026 Akhila Meesa. All rights reserved. Mediscope is a proprietary platform created, designed, and owned by Akhila Meesa.
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8697C4]">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> HIPAA/GDPR Aligned Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
