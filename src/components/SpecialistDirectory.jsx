import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Star,
  CalendarCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Building,
  UserCheck,
  Search,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function SpecialistDirectory({ activePatient }) {
  const [specialists, setSpecialists] = useState([]);
  const [matchedMarkers, setMatchedMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSpecialists();
  }, [activePatient?.id]);

  const loadSpecialists = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSpecialists(activePatient?.id);
      setSpecialists(res.specialists || []);
      setMatchedMarkers(res.matched_markers || []);
    } catch (e) {
      console.error('Failed to load specialists', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = specialists.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.specialty.toLowerCase().includes(q) ||
      s.hospital_clinic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="med-card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8F5] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#3D52A0] tracking-tight">
              Local Area Clinical Specialist Directory
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
              Algorithmic Biomarker Matching
            </span>
          </div>
          <p className="text-xs text-[#8697C4] font-medium mt-0.5">
            Recommended physicians prioritized based on out-of-range clinical categories
            {activePatient && <span> for <strong>{activePatient.full_name}</strong></span>}
          </p>
        </div>

        <button
          onClick={loadSpecialists}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 text-xs font-bold text-[#3D52A0] border border-[#ADBBDA] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Specialists</span>
        </button>
      </div>

      {/* Matched Biomarkers Alert */}
      {matchedMarkers.length > 0 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#EDE8F5] to-white border border-[#ADBBDA] text-xs text-[#3D52A0] flex flex-wrap items-center gap-2">
          <span className="font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#7091E6]" />
            Matched Out-of-Range Metrics:
          </span>
          {matchedMarkers.map((m, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold"
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8697C4]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by physician name, clinical specialty, or medical center..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] text-xs text-[#3D52A0] font-medium outline-hidden"
        />
      </div>

      {/* Specialist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="med-card p-6 flex flex-col justify-between border border-[#ADBBDA] hover:border-[#7091E6] bg-white transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-extrabold text-[#3D52A0]">
                    {doc.name}
                  </h4>
                  <div className="text-xs font-bold text-[#7091E6] mt-0.5">
                    {doc.specialty}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{doc.rating}</span>
                  <span className="text-[10px] text-amber-600 font-normal">({doc.review_count})</span>
                </div>
              </div>

              {/* Location & Contact Info */}
              <div className="p-3 bg-[#EDE8F5]/30 rounded-xl space-y-1.5 text-xs text-[#3D52A0] border border-[#ADBBDA]/30">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-[#8697C4] shrink-0" />
                  <span className="font-semibold truncate">{doc.hospital_clinic}</span>
                </div>
                <div className="flex items-center gap-2 text-[#8697C4]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{doc.address}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-[#3D52A0]">
                  <Phone className="w-3.5 h-3.5 text-[#7091E6] shrink-0" />
                  <span>{doc.phone}</span>
                </div>
              </div>

              {/* Appointment Prep Tips */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8697C4]">
                  Appointment Preparation Tips:
                </div>
                <div className="space-y-1 text-xs">
                  {doc.appointment_prep_tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[#3D52A0] font-medium leading-relaxed">
                      <span className="text-[#7091E6] font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#EDE8F5] flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Accepting New Patients</span>
              </span>

              <a
                href={`tel:${doc.phone.replace(/[^0-9]/g, '')}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#EDE8F5] hover:bg-[#7091E6] hover:text-white text-[#3D52A0] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>Call Clinic</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
