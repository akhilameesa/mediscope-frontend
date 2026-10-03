import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info,
  Filter,
  ShieldCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function LabResultsDisplay({
  reportData,
  activePatient,
  onNavigateTab
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'FLAGGED', 'NORMAL'
  const [expandedTest, setExpandedTest] = useState(null);

  if (!reportData) return null;

  const biomarkers = reportData.extracted_biomarkers || [];
  const ragSummary = reportData.rag_summary || {};

  const filtered = biomarkers.filter((b) => {
    if (filter === 'FLAGGED') return b.status === 'HIGH' || b.status === 'LOW';
    if (filter === 'NORMAL') return b.status === 'NORMAL';
    return true;
  });

  const highCount = biomarkers.filter(b => b.status === 'HIGH').length;
  const lowCount = biomarkers.filter(b => b.status === 'LOW').length;
  const normalCount = biomarkers.filter(b => b.status === 'NORMAL').length;

  return (
    <div className="med-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE8F5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#3D52A0] tracking-tight">
              Biomarker Analysis & Range Indicators
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
              {reportData.report_name}
            </span>
          </div>
          <p className="text-xs text-[#8697C4] font-medium mt-1">
            Recorded {reportData.report_date} • {biomarkers.length} Total Laboratory Markers Analyzed
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#EDE8F5]/60 p-1 rounded-xl border border-[#ADBBDA] text-xs font-bold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'ALL' ? 'bg-[#7091E6] text-white shadow-xs' : 'text-[#3D52A0] hover:bg-white'
            }`}
          >
            All ({biomarkers.length})
          </button>
          <button
            onClick={() => setFilter('FLAGGED')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'FLAGGED' ? 'bg-[#7091E6] text-white shadow-xs' : 'text-[#3D52A0] hover:bg-white'
            }`}
          >
            Out of Range ({highCount + lowCount})
          </button>
          <button
            onClick={() => setFilter('NORMAL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'NORMAL' ? 'bg-[#7091E6] text-white shadow-xs' : 'text-[#3D52A0] hover:bg-white'
            }`}
          >
            Normal ({normalCount})
          </button>
        </div>
      </div>

      {/* RAG Synthesis Briefing Banner */}
      {ragSummary.educational_briefing && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EDE8F5] to-white border border-[#ADBBDA] space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#3D52A0]">
            <Sparkles className="w-4 h-4 text-[#7091E6]" />
            <span>AI Educational Synthesis Summary:</span>
          </div>
          <p className="text-xs text-[#3D52A0] leading-relaxed font-medium">
            {ragSummary.educational_briefing}
          </p>
        </div>
      )}

      {/* Biomarker Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b, idx) => {
          const isHigh = b.status === 'HIGH';
          const isLow = b.status === 'LOW';
          const isNormal = b.status === 'NORMAL';
          const isExpanded = expandedTest === b.test_name;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                isHigh
                  ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
                  : isLow
                  ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                  : 'border-[#ADBBDA] bg-white hover:border-[#7091E6]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold text-[#3D52A0] leading-snug">
                  {b.test_name}
                </span>

                {/* Status Badges: HIGH, LOW, NORMAL */}
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
                    isHigh
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : isLow
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Value & Reference Range */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-black text-[#3D52A0]">
                  {b.value}
                </span>
                <span className="text-xs font-bold text-[#8697C4]">
                  {b.unit}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 border border-[#ADBBDA]/50 space-y-1 text-xs">
                <div className="flex justify-between text-[11px] text-[#8697C4]">
                  <span>Reference Interval:</span>
                  <span className="font-bold text-[#3D52A0]">
                    {b.reference_low} - {b.reference_high} {b.unit}
                  </span>
                </div>
              </div>

              {/* Toggle Educational Explanation */}
              <div className="mt-3 pt-2 border-t border-[#EDE8F5]">
                <button
                  type="button"
                  onClick={() => setExpandedTest(isExpanded ? null : b.test_name)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-[#7091E6] hover:text-[#3D52A0] cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide Context' : 'Educational Context'}</span>
                  </span>
                  <span>{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 p-2.5 rounded-xl bg-[#EDE8F5]/50 border border-[#ADBBDA] text-[11px] text-[#3D52A0] leading-relaxed space-y-1.5 animate-in fade-in duration-200">
                    <div className="font-semibold text-[#7091E6]">
                      Biomarker Purpose:
                    </div>
                    <p>
                      {b.status === 'HIGH'
                        ? `Elevated levels indicate potential physiological acceleration or decreased clearance. Consult your doctor to interpret in light of clinical symptoms.`
                        : b.status === 'LOW'
                        ? `Subnormal concentrations indicate potential metabolic deficiency or diminished biological output.`
                        : `Biomarker falls within standard healthy clinical reference ranges.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation */}
      <div className="pt-4 border-t border-[#EDE8F5] flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        <span className="text-[#8697C4]">
          Next Recommended Clinical Briefing Steps:
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('trends')}
            className="text-[#7091E6] hover:text-[#3D52A0] hover:underline"
          >
            Compare Longitudinal Deltas &rarr;
          </button>
          <button
            onClick={() => onNavigateTab('questions')}
            className="px-4 py-2 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white shadow-xs transition-all"
          >
            Synthesize Doctor Questions &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
