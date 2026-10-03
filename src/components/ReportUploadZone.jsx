import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function ReportUploadZone({
  activePatient,
  onReportProcessed,
  onOpenAddPatient
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportName, setReportName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1: Storage, 2: OCR, 3: Validation, 4: RAG
  const [errorNotice, setErrorNotice] = useState('');

  if (!activePatient) {
    return (
      <div className="med-card p-10 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EDE8F5] text-[#3D52A0] flex items-center justify-center">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#3D52A0]">No Active Patient Context</h3>
        <p className="text-xs text-[#8697C4] max-w-md mx-auto">
          Please select or register a family member profile before uploading laboratory reports.
        </p>
        <button
          onClick={onOpenAddPatient}
          className="px-5 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          Select or Add Patient Profile
        </button>
      </div>
    );
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    if (!reportName) {
      setReportName(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  const processReportUpload = async (presetType = null) => {
    setUploading(true);
    setErrorNotice('');
    setCurrentStep(1); // Storage

    try {
      // Advance step animation
      await new Promise(r => setTimeout(r, 400));
      setCurrentStep(2); // OCR

      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(3); // Range validation

      const rName = reportName || (presetType === 'lipid_metabolic' ? 'Comprehensive Metabolic & Lipid' : presetType === 'followup_improved' ? 'Follow-Up Progress Evaluation' : 'Laboratory Diagnostic Panel');
      
      const res = await apiClient.uploadReport(
        activePatient.id,
        selectedFile,
        rName,
        reportDate,
        presetType
      );

      setCurrentStep(4); // RAG Synthesis
      await new Promise(r => setTimeout(r, 500));

      onReportProcessed(res);
      setSelectedFile(null);
      setReportName('');
      setCurrentStep(0);
    } catch (err) {
      setErrorNotice(err.message || 'Report processing failed.');
      setCurrentStep(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="med-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE8F5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#3D52A0] tracking-tight">
              Clinical Report OCR & Ingestion Engine
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
              PyMuPDF • Tesseract • RAG
            </span>
          </div>
          <p className="text-xs text-[#8697C4] font-medium mt-0.5">
            Uploading report under clinical context of <strong className="text-[#3D52A0]">{activePatient.full_name}</strong> ({activePatient.relationship})
          </p>
        </div>
      </div>

      {errorNotice && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* ============================================================================ */}
      {/* 4-STAGE PROCESSING STEPPER                                                   */}
      {/* 1. Storage -> 2. PyMuPDF/Tesseract OCR -> 3. Range Validation -> 4. RAG      */}
      {/* ============================================================================ */}
      <div className="p-4 rounded-2xl bg-[#EDE8F5]/50 border border-[#ADBBDA]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8697C4] mb-3">
          Processing Pipeline Stepper:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {[
            { step: 1, title: '1. Secure Storage', sub: 'Encrypted Vault' },
            { step: 2, title: '2. PyMuPDF OCR', sub: 'Biomarker Extraction' },
            { step: 3, title: '3. Range Validation', sub: 'High / Low / Normal' },
            { step: 4, title: '4. RAG Synthesis', sub: 'Clinical Briefing' }
          ].map((s) => {
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div
                key={s.step}
                className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : isCurrent
                    ? 'bg-white border-[#7091E6] text-[#3D52A0] shadow-sm ring-2 ring-[#7091E6]/20'
                    : 'bg-white/70 border-[#ADBBDA] text-[#8697C4]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#7091E6] animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#ADBBDA] flex items-center justify-center text-[10px] font-bold">
                    {s.step}
                  </div>
                )}
                <div>
                  <div className="font-bold leading-tight">{s.title}</div>
                  <div className="text-[10px] opacity-80">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive
            ? 'border-[#7091E6] bg-[#EDE8F5]'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/30'
            : 'border-[#ADBBDA] hover:border-[#7091E6] bg-[#EDE8F5]/20 hover:bg-[#EDE8F5]/40'
        }`}
      >
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#3D52A0]">{selectedFile.name}</div>
              <div className="text-xs text-[#8697C4]">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for PyMuPDF OCR Ingestion
              </div>
            </div>
            <label
              htmlFor="file-upload"
              className="inline-block text-xs font-bold text-[#7091E6] hover:underline cursor-pointer"
            >
              Choose different file
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EDE8F5] text-[#7091E6] flex items-center justify-center shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <label
                htmlFor="file-upload"
                className="text-sm font-extrabold text-[#7091E6] hover:text-[#3D52A0] hover:underline cursor-pointer"
              >
                Click to browse laboratory file
              </label>
              <span className="text-sm text-[#8697C4]"> or drag & drop here</span>
              <p className="text-xs text-[#8697C4] mt-1">
                Accepts PDF, JPG, PNG medical lab reports (PyMuPDF vector and image OCR supported)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Inputs & Dispatch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
            Report Name / Diagnostic Panel
          </label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="e.g. Comprehensive Metabolic & Lipid Profile"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] text-xs text-[#3D52A0] font-medium outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
            Report Collection Date
          </label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] text-xs text-[#3D52A0] font-medium outline-hidden cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Instant Evaluation Quick Loaders */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#8697C4]">Instant Presets:</span>
          <button
            type="button"
            disabled={uploading}
            onClick={() => processReportUpload('lipid_metabolic')}
            className="px-3 py-1.5 rounded-lg bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 border border-[#ADBBDA] text-[11px] font-bold text-[#3D52A0] transition-colors cursor-pointer"
          >
            Load Initial High-Sugar Lab
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => processReportUpload('followup_improved')}
            className="px-3 py-1.5 rounded-lg bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 border border-[#ADBBDA] text-[11px] font-bold text-emerald-800 transition-colors cursor-pointer"
          >
            Load Follow-Up (Shows Delta Drop)
          </button>
        </div>

        <button
          type="button"
          disabled={uploading || !selectedFile}
          onClick={() => processReportUpload()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Execute OCR Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
