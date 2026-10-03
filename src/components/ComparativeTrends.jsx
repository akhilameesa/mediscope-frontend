import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Compass
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function ComparativeTrends({
  activePatient,
  onNavigateTab
}) {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activePatient?.id) {
      loadTrends();
    }
  }, [activePatient?.id]);

  const loadTrends = async () => {
    if (!activePatient?.id) return;
    setLoading(true);
    try {
      const data = await apiClient.getPatientTrends(activePatient.id);
      setTrendsData(data);
    } catch (e) {
      console.error('Failed to load trends', e);
    } finally {
      setLoading(false);
    }
  };

  if (!activePatient) {
    return (
      <div className="med-card p-10 text-center text-[#8697C4] text-xs font-semibold">
        Please select an active patient context to compute historical biomarker deltas.
      </div>
    );
  }

  const comparisons = trendsData?.comparisons || [];

  return (
    <div className="med-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8F5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#3D52A0] tracking-tight">
              Longitudinal Delta Tracking & Comparative Trends
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
              Prior vs. Present Reports
            </span>
          </div>
          <p className="text-xs text-[#8697C4] font-medium mt-0.5">
            Subject: <strong className="text-[#3D52A0]">{activePatient.full_name}</strong> ({activePatient.relationship}) • {trendsData?.report_count || 0} Total Records on File
          </p>
        </div>

        <button
          onClick={loadTrends}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-xs font-bold text-[#3D52A0] border border-[#ADBBDA] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Deltas</span>
        </button>
      </div>

      {/* Historical Report Delta Calculation Notice */}
      {trendsData && !trendsData.has_historical_comparison && (
        <div className="p-4 rounded-xl bg-[#EDE8F5] border border-[#ADBBDA] text-xs text-[#3D52A0] space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-[#7091E6]" />
            <span>Baseline Assessment Mode</span>
          </div>
          <p className="font-medium text-[#8697C4]">
            {trendsData.message} To observe dynamic delta changes (e.g. Fasting Glucose 128 mg/dL &rarr; 115 mg/dL | Delta: -13 mg/dL), upload a follow-up report using the preset buttons in the Report Ingestion zone.
          </p>
        </div>
      )}

      {trendsData?.has_historical_comparison && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-extrabold">Active Delta Comparison Pair:</span>
              <div className="text-[11px] text-emerald-800">
                Prior: {trendsData.previous_report_name} ({trendsData.previous_date}) &rarr; Present: {trendsData.current_report_name} ({trendsData.current_date})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparisons Table / List */}
      <div className="space-y-3">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8697C4] border-b border-[#EDE8F5]">
          <div className="col-span-4">Biomarker / Panel</div>
          <div className="col-span-2 text-center">Prior Evaluation</div>
          <div className="col-span-2 text-center">Current Result</div>
          <div className="col-span-2 text-center">Computed Delta</div>
          <div className="col-span-2 text-right">Trajectory</div>
        </div>

        {comparisons.length === 0 ? (
          <div className="text-center py-12 text-[#8697C4] text-xs">
            No lab reports available yet. Upload reports in the Ingestion zone to visualize trends.
          </div>
        ) : (
          comparisons.map((c, i) => {
            const isImproved = c.trend_direction === 'IMPROVED';
            const isWorsened = c.trend_direction === 'WORSENED';

            return (
              <div
                key={i}
                className="p-4 sm:px-4 sm:py-3.5 rounded-2xl bg-white border border-[#ADBBDA] hover:border-[#7091E6] transition-all grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-xs"
              >
                {/* Biomarker Name */}
                <div className="col-span-4">
                  <div className="text-xs font-black text-[#3D52A0]">
                    {c.test_name}
                  </div>
                  <div className="text-[10px] text-[#8697C4] font-medium">
                    Unit: {c.unit}
                  </div>
                </div>

                {/* Prior Evaluation */}
                <div className="col-span-2 text-left sm:text-center flex sm:block justify-between items-center text-xs">
                  <span className="sm:hidden text-[#8697C4] font-semibold">Prior:</span>
                  <div>
                    {c.previous_value !== null ? (
                      <span className="font-bold text-[#3D52A0]">
                        {c.previous_value} {c.unit}
                      </span>
                    ) : (
                      <span className="text-[#8697C4] italic">None (Baseline)</span>
                    )}
                    {c.status_previous && (
                      <span className="block text-[9px] font-bold text-[#8697C4]">
                        [{c.status_previous}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Current Result */}
                <div className="col-span-2 text-left sm:text-center flex sm:block justify-between items-center text-xs">
                  <span className="sm:hidden text-[#8697C4] font-semibold">Current:</span>
                  <div>
                    <span className="font-extrabold text-[#3D52A0]">
                      {c.current_value} {c.unit}
                    </span>
                    {c.status_current && (
                      <span
                        className={`block text-[9px] font-black uppercase ${
                          c.status_current === 'NORMAL' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        [{c.status_current}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Computed Delta */}
                <div className="col-span-2 text-left sm:text-center flex sm:block justify-between items-center text-xs">
                  <span className="sm:hidden text-[#8697C4] font-semibold">Delta:</span>
                  <div>
                    {c.previous_value !== null ? (
                      <span
                        className={`font-black text-sm ${
                          isImproved ? 'text-emerald-700' : isWorsened ? 'text-rose-700' : 'text-[#3D52A0]'
                        }`}
                      >
                        {c.delta_formatted || `${c.delta} ${c.unit}`}
                      </span>
                    ) : (
                      <span className="text-[#8697C4] text-xs font-semibold">Baseline</span>
                    )}
                  </div>
                </div>

                {/* Trajectory Badge */}
                <div className="col-span-2 text-left sm:text-right flex sm:block justify-between items-center">
                  <span className="sm:hidden text-[#8697C4] font-semibold text-xs">Trajectory:</span>
                  {isImproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <TrendingDown className="w-3 h-3" />
                      <span>Favorable Drop</span>
                    </span>
                  ) : isWorsened ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-300">
                      <TrendingUp className="w-3 h-3" />
                      <span>Elevation</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
                      <Minus className="w-3 h-3" />
                      <span>{c.trend_direction || 'Stable'}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================================ */}
      {/* UPCOMING TREATMENT & NEXT-STEP GUIDANCE                                      */}
      {/* ============================================================================ */}
      <div className="med-glass rounded-2xl p-6 border border-[#ADBBDA] space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#7091E6]" />
          <h4 className="text-base font-extrabold text-[#3D52A0]">
            Upcoming Treatment & Next-Step Guidance
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-[#ADBBDA] space-y-1.5">
            <div className="font-bold text-[#3D52A0]">1. Clinical Pathways</div>
            <p className="text-[#8697C4] font-medium leading-relaxed">
              Consolidate historical lab prints with this digital briefing before your follow-up visit. Review flagged glucose or lipid trajectories with your physician.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#ADBBDA] space-y-1.5">
            <div className="font-bold text-[#3D52A0]">2. Lifestyle Modifications</div>
            <p className="text-[#8697C4] font-medium leading-relaxed">
              Adopt evidence-backed nutritional protocols: prioritize low-glycemic Mediterranean dietary patterns, hydrate consistently, and monitor weekly resting vitals.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#ADBBDA] space-y-1.5">
            <div className="font-bold text-[#3D52A0]">3. Follow-up Lab Panels</div>
            <p className="text-[#8697C4] font-medium leading-relaxed">
              Consider repeating your Comprehensive Metabolic Panel and HbA1c in 90 days to verify whether delta trends continue to move into normal physiological ranges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
