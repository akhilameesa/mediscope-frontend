import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  TrendingDown,
  Stethoscope,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function MainOverview({
  user,
  patients = [],
  activePatient,
  onNavigateTab,
  onOpenAddPatient
}) {
  const [outbreakData, setOutbreakData] = useState(null);
  const [loadingOutbreaks, setLoadingOutbreaks] = useState(true);
  const [selectedInfection, setSelectedInfection] = useState(null);

  useEffect(() => {
    fetchOutbreakStats();
  }, []);

  const fetchOutbreakStats = async () => {
    setLoadingOutbreaks(true);
    try {
      const data = await apiClient.getOutbreaks();
      setOutbreakData(data);
      if (data.infections && data.infections.length > 0) {
        setSelectedInfection(data.infections[0]);
      }
    } catch (e) {
      console.error('Failed to load outbreak stats', e);
    } finally {
      setLoadingOutbreaks(false);
    }
  };

  const featureCards = [
    {
      id: 'patients',
      title: 'Multi-Patient Family Records',
      subtitle: 'Portions 5, 6 & 7 Database',
      desc: 'Isolate individual family members with independent chronic conditions, emergency contacts, and complete medical histories.',
      icon: Users,
      badge: `${patients.length} Profiles Active`,
      cta: 'Manage Family Records',
      targetTab: 'patients'
    },
    {
      id: 'ocr',
      title: 'OCR Bio-Marker Extraction',
      subtitle: 'PyMuPDF & Stepper Pipeline',
      desc: 'Seamlessly upload PDF and clinical laboratory imagery. Automatically parses biomarkers, standard reference ranges, and calculates status indicators.',
      icon: FileText,
      badge: '4-Stage Stepper',
      cta: 'Upload Lab Report',
      targetTab: 'reports'
    },
    {
      id: 'trends',
      title: 'Longitudinal Delta Tracking',
      subtitle: 'Historical Lab Comparisons',
      desc: 'Computes exact quantitative deltas across historical reports (e.g. Fasting Glucose 128 -> 115 mg/dL | Delta: -13 mg/dL).',
      icon: TrendingDown,
      badge: 'Visual Trajectories',
      cta: 'Explore Delta Trends',
      targetTab: 'reports'
    },
    {
      id: 'questions',
      title: 'AI Doctor Question Synthesis',
      subtitle: 'Appointment Preparation',
      desc: 'Translates flagged out-of-range clinical metrics into high-yield, articulate doctor consultation questions to maximize physician visits.',
      icon: Stethoscope,
      badge: 'Clinical Prompts',
      cta: 'Generate Questions',
      targetTab: 'questions'
    },
    {
      id: 'specialists',
      title: 'Local Specialist Finder',
      subtitle: 'Tailored Disciplines',
      desc: 'Direct algorithmic mapping connecting out-of-range biomarkers (Endocrine, Renal, Hepatic, Lipidology) with top local specialists.',
      icon: MapPin,
      badge: 'Pre-vetted Network',
      cta: 'Browse Specialists',
      targetTab: 'specialists'
    },
    {
      id: 'reminders',
      title: 'Automated Email Reminders',
      subtitle: 'SMTP Dispatch Pipeline',
      desc: 'Scheduled annual and periodic health checkup reminders dispatched directly to registered user email addresses with family profile tags.',
      icon: Clock,
      badge: 'Automated HTML',
      cta: 'Configure Reminders',
      targetTab: 'reminders'
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* ============================================================================ */}
      {/* 1. HERO VISUAL BANNER                                                        */}
      {/* High-resolution banner showcasing digital medical assistance and AI intelligence */}
      {/* ============================================================================ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#3D52A0] via-[#5A73C8] to-[#7091E6] text-white p-8 sm:p-10 shadow-lg border border-[#ADBBDA]">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome back, {user?.full_name || 'Member'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Intelligent Clinical Health Analytics & Briefing Platform
          </h1>

          <p className="text-sm sm:text-base text-[#EDE8F5] leading-relaxed max-w-2xl font-medium">
            Review digital patient charts, extract laboratory values via PyMuPDF OCR, synthesize tailored doctor consultation questions, and prepare for confident healthcare dialogues.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {patients.length === 0 ? (
              <button
                onClick={onOpenAddPatient}
                className="px-6 py-3 rounded-xl bg-white text-[#3D52A0] hover:bg-[#EDE8F5] font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#7091E6]" />
                <span>Add Your First Patient Profile</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('reports')}
                className="px-6 py-3 rounded-xl bg-white text-[#3D52A0] hover:bg-[#EDE8F5] font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#7091E6]" />
                <span>Upload & Analyze Report</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('specialists')}
              className="px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm border border-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Find Local Specialists</span>
            </button>
          </div>
        </div>

        {/* Decorative visual elements */}
        <div className="absolute right-6 -bottom-10 opacity-15 hidden lg:block pointer-events-none">
          <Activity className="w-96 h-96 stroke-[1]" />
        </div>
      </div>

      {/* ============================================================================ */}
      {/* 2. COMPREHENSIVE FEATURE SHOWCASE (Grid of Interactive Cards)                */}
      {/* ============================================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#3D52A0] tracking-tight">
              Clinical Intelligence Feature Suite
            </h2>
            <p className="text-xs sm:text-sm text-[#8697C4] font-medium">
              Explore the end-to-end capabilities integrated within your Mediscope workspace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="med-card p-6 flex flex-col justify-between group hover:border-[#7091E6] cursor-pointer"
                onClick={() => onNavigateTab(feat.targetTab)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#EDE8F5] text-[#3D52A0] group-hover:bg-[#7091E6] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8697C4]">
                      {feat.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-[#3D52A0] group-hover:text-[#7091E6] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#8697C4] leading-relaxed mt-2 font-medium">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#EDE8F5] flex items-center justify-between text-xs font-bold text-[#7091E6] group-hover:translate-x-1 transition-transform">
                  <span>{feat.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================================ */}
      {/* 3. LIVE HEALTH & INFECTION STATISTICS TRACKER WIDGET                         */}
      {/* Active infections, regional outbreak risk levels, vectors, symptoms & guidelines */}
      {/* ============================================================================ */}
      <div className="med-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8F5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#3D52A0] tracking-tight">
                Live Health & Infection Statistics Tracker
              </h3>
              <p className="text-xs text-[#8697C4] font-medium">
                Real-time regional surveillance • As of {outbreakData?.as_of_date || 'Today'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchOutbreakStats}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-xs font-bold text-[#3D52A0] border border-[#ADBBDA] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOutbreaks ? 'animate-spin' : ''}`} />
            <span>Refresh Surveillance</span>
          </button>
        </div>

        {/* Global Alert Notice */}
        {outbreakData?.global_alert_summary && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold mr-1">Global Epidemiological Advisory:</span>
              {outbreakData.global_alert_summary}
            </div>
          </div>
        )}

        {/* Infections List & Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pathogen Selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8697C4]">
              Active Tracked Pathogens ({outbreakData?.infections?.length || 0})
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {outbreakData?.infections?.map((inf) => {
                const isSelected = selectedInfection?.id === inf.id;
                const isHigh = inf.risk_level === 'High';
                return (
                  <div
                    key={inf.id}
                    onClick={() => setSelectedInfection(inf)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#7091E6] bg-[#EDE8F5]/50 shadow-xs'
                        : 'border-[#ADBBDA] bg-white hover:bg-[#EDE8F5]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#3D52A0] truncate max-w-[200px]">
                        {inf.name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isHigh
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {inf.risk_level} Risk
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8697C4]">
                      <span>{inf.type}</span>
                      <span className="font-semibold text-[#3D52A0]">{inf.spread_trend}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Pathogen Clinical Deep Dive */}
          <div className="lg:col-span-7 bg-[#EDE8F5]/30 border border-[#ADBBDA] rounded-2xl p-5 sm:p-6 space-y-5">
            {selectedInfection ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#7091E6] uppercase tracking-wider">
                      {selectedInfection.type}
                    </span>
                    <h4 className="text-xl font-extrabold text-[#3D52A0]">
                      {selectedInfection.name}
                    </h4>
                    <p className="text-xs text-[#8697C4] font-medium mt-1">
                      Hotspots: {selectedInfection.regional_hotspots}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-[#8697C4]">Risk Profile</span>
                    <div className="text-sm font-black text-rose-600">
                      {selectedInfection.risk_level.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#ADBBDA] space-y-1">
                  <div className="text-[11px] font-bold text-[#3D52A0] uppercase tracking-wider">
                    Transmission Vector:
                  </div>
                  <div className="text-xs text-[#3D52A0] font-medium">
                    {selectedInfection.transmission_vector}
                  </div>
                </div>

                {/* Primary Symptoms Watch */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#7091E6]" />
                    <span>Symptoms Watch:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedInfection.primary_symptoms.map((symp, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-white border border-[#ADBBDA] text-xs text-[#3D52A0] font-medium flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span className="truncate">{symp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Precaution Guidelines */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Precautionary Clinical Guidelines:</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedInfection.clinical_precaution_guidelines.map((guide, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-white border border-[#ADBBDA] text-xs text-[#3D52A0] leading-relaxed font-medium flex items-start gap-2"
                      >
                        <span className="text-[#7091E6] font-bold">•</span>
                        <span>{guide}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-[#8697C4] text-xs">
                Select an active infection on the left to inspect transmission vectors and clinical guidelines.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
