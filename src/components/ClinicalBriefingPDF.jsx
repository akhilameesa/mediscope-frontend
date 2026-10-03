import React from 'react';
import { Printer, X, Download, Activity, ShieldAlert, Award } from 'lucide-react';

export default function ClinicalBriefingPDF({
  isOpen,
  onClose,
  activePatient,
  reportData,
  trendsData,
  questionsData,
  specialists = []
}) {
  if (!isOpen || !activePatient) return null;

  const biomarkers = reportData?.extracted_biomarkers || [];
  const comparisons = trendsData?.comparisons || [];
  const questions = questionsData?.categorized_questions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-[#ADBBDA] rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print bg-[#EDE8F5] border-b border-[#ADBBDA] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3D52A0]">
            <Activity className="w-4 h-4 text-[#7091E6]" />
            <span>Mediscope Clinical Consultation Briefing Document</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#8697C4] hover:text-[#3D52A0] hover:bg-white/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 bg-white text-[#3D52A0]">
          {/* Document Header */}
          <div className="border-b-2 border-[#3D52A0] pb-6 flex items-start justify-between">
            <div>
              <div className="text-3xl font-black tracking-tight text-[#3D52A0]">
                MEDISCOPE
              </div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#7091E6] mt-0.5">
                Clinical Health Report Companion Briefing
              </div>
              <div className="text-xs text-[#8697C4] mt-1">
                Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="font-extrabold text-[#3D52A0] uppercase">Confidential Patient Document</div>
              <div className="text-[#8697C4]">Proprietary Architecture by Akhila Meesa</div>
            </div>
          </div>

          {/* Patient Profile Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#EDE8F5]/50 border border-[#ADBBDA] text-xs">
            <div>
              <span className="text-[#8697C4] block">Patient Name:</span>
              <span className="font-extrabold text-sm">{activePatient.full_name}</span>
            </div>
            <div>
              <span className="text-[#8697C4] block">Relationship:</span>
              <span className="font-bold">{activePatient.relationship}</span>
            </div>
            <div>
              <span className="text-[#8697C4] block">Date of Birth:</span>
              <span className="font-bold">{activePatient.date_of_birth}</span>
            </div>
            <div>
              <span className="text-[#8697C4] block">Blood Group:</span>
              <span className="font-bold">{activePatient.blood_group || 'N/A'}</span>
            </div>
            {activePatient.pre_existing_conditions && (
              <div className="col-span-2 sm:col-span-4 pt-2 border-t border-[#ADBBDA]/30">
                <span className="text-[#8697C4] block">Pre-existing Medical History:</span>
                <span className="font-medium">{activePatient.pre_existing_conditions}</span>
              </div>
            )}
          </div>

          {/* Biomarker Status Summary */}
          {biomarkers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#3D52A0] border-b border-[#ADBBDA] pb-1">
                1. Current Laboratory Biomarkers & Range Indicators
              </h4>
              <table className="w-full text-left text-xs border border-[#ADBBDA] rounded-lg overflow-hidden">
                <thead className="bg-[#EDE8F5] text-[#3D52A0] font-bold">
                  <tr>
                    <th className="p-2.5">Biomarker</th>
                    <th className="p-2.5">Recorded Value</th>
                    <th className="p-2.5">Reference Range</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE8F5]">
                  {biomarkers.map((b, i) => (
                    <tr key={i} className="hover:bg-[#EDE8F5]/20">
                      <td className="p-2.5 font-bold text-[#3D52A0]">{b.test_name}</td>
                      <td className="p-2.5 font-extrabold">{b.value} {b.unit}</td>
                      <td className="p-2.5 text-[#8697C4]">{b.reference_low} - {b.reference_high} {b.unit}</td>
                      <td className="p-2.5 text-right font-black">
                        <span className={b.status === 'NORMAL' ? 'text-emerald-700' : 'text-rose-700'}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Historical Deltas */}
          {comparisons.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#3D52A0] border-b border-[#ADBBDA] pb-1">
                2. Longitudinal Delta Tracking (Prior vs. Present)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {comparisons.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-[#ADBBDA] flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#3D52A0]">{c.test_name}</div>
                      <div className="text-[10px] text-[#8697C4]">
                        Prior: {c.previous_value !== null ? `${c.previous_value} ${c.unit}` : 'Baseline'} &rarr; Present: {c.current_value} {c.unit}
                      </div>
                    </div>
                    <div className="font-black text-sm">
                      {c.delta_formatted || `${c.delta} ${c.unit}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Doctor Consultation Questions */}
          {questions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#3D52A0] border-b border-[#ADBBDA] pb-1">
                3. High-Yield Doctor Consultation Questions
              </h4>
              <div className="space-y-2.5 text-xs">
                {questions.map((q, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#EDE8F5]/30 border border-[#ADBBDA] space-y-1">
                    <div className="font-extrabold text-[#3D52A0]">
                      {i + 1}. "{q.question}"
                    </div>
                    {q.context && (
                      <div className="text-[11px] text-[#8697C4]">
                        Clinical Rationale: {q.context}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================================ */}
          {/* MANDATORY SAFETY DISCLAIMER & COPYRIGHT FOOTER NOTICE                         */}
          {/* ============================================================================ */}
          <div className="pt-6 border-t-2 border-[#3D52A0] space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#EDE8F5] border border-[#ADBBDA] text-[#3D52A0] leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#7091E6] shrink-0 mt-0.5" />
              <div>
                <strong>Safety Disclaimer:</strong> Mediscope is an educational health report companion, NOT a diagnostic platform or medical decision system. All outputs are intended for appointment preparation with a qualified healthcare provider.
              </div>
            </div>

            <div className="text-center font-bold text-[#3D52A0] text-[11px] pt-2">
              Copyright © 2026 Akhila Meesa. All rights reserved. Mediscope is a proprietary platform created, designed, and owned by Akhila Meesa.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
