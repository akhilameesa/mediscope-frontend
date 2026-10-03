import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  HelpCircle,
  Printer,
  Sparkles,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ClipboardList,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function DoctorQuestionsCard({
  activePatient,
  onOpenPrintPreview
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    if (activePatient?.id) {
      loadQuestions();
    }
  }, [activePatient?.id]);

  const loadQuestions = async () => {
    if (!activePatient?.id) return;
    setLoading(true);
    try {
      const res = await apiClient.getDoctorQuestions(activePatient.id);
      setData(res);
    } catch (e) {
      console.error('Failed to load doctor questions', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!activePatient) {
    return (
      <div className="med-card p-10 text-center text-[#8697C4] text-xs font-semibold">
        Please select an active patient context to generate tailored doctor consultation questions.
      </div>
    );
  }

  const questions = data?.categorized_questions || [];
  const followup = data?.followup_questions || [];

  return (
    <div className="med-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8F5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#3D52A0] tracking-tight">
              AI Doctor Consultation Question Synthesis
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
              Appointment Preparation Briefing
            </span>
          </div>
          <p className="text-xs text-[#8697C4] font-medium mt-0.5">
            Subject: <strong className="text-[#3D52A0]">{activePatient.full_name}</strong> ({activePatient.relationship}) • {questions.length} Tailored Questions Synthesized
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadQuestions}
            className="p-2 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-[#3D52A0] border border-[#ADBBDA] transition-colors"
            title="Regenerate Questions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onOpenPrintPreview}
            className="px-4 py-2 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Appointment Briefing</span>
          </button>
        </div>
      </div>

      {/* Purpose Banner */}
      <div className="p-4 rounded-xl bg-[#EDE8F5]/60 border border-[#ADBBDA] text-xs text-[#3D52A0] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#7091E6] shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          Physician appointment windows are often compressed. These synthesized questions translate out-of-range clinical metrics directly into clear, high-yield inquiries so you and your doctor can focus on treatment pathways.
        </p>
      </div>

      {/* Categorized Tailored Questions */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8697C4]">
          Tailored Questions for Flagged Biomarkers ({questions.length})
        </div>

        {questions.length === 0 ? (
          <div className="p-8 text-center bg-[#EDE8F5]/20 rounded-2xl border border-[#ADBBDA] text-xs text-[#8697C4]">
            {data?.message || 'No out-of-range lab reports currently found. Standard baseline wellness questions provided below.'}
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ADBBDA] hover:border-[#7091E6] transition-all space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
                    {q.category}
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {q.finding}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(q.question, idx)}
                  className="p-1.5 rounded-lg text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors"
                  title="Copy question text"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-sm font-bold text-[#3D52A0] leading-snug">
                "{q.question}"
              </div>

              {q.context && (
                <div className="p-2.5 rounded-xl bg-[#EDE8F5]/40 text-[11px] text-[#8697C4] font-medium border border-[#ADBBDA]/30">
                  <strong className="text-[#3D52A0] mr-1">Clinical Context:</strong>
                  {q.context}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* General Followup Guidance Questions */}
      {followup.length > 0 && (
        <div className="med-glass rounded-2xl p-5 border border-[#ADBBDA] space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#3D52A0] flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-[#7091E6]" />
            <span>Essential Retesting & Follow-up Inquiries</span>
          </div>

          <div className="space-y-2">
            {followup.map((fq, i) => (
              <div
                key={i}
                className="p-3 bg-white rounded-xl border border-[#ADBBDA] text-xs font-semibold text-[#3D52A0] flex items-start gap-2.5"
              >
                <span className="text-[#7091E6] font-bold mt-0.5">•</span>
                <span>{fq}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
