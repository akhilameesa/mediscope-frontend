import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle,
  FileText,
  HeartPulse,
  Phone,
  UserCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function PatientManagement({
  patients = [],
  activePatient,
  onSelectPatient,
  onOpenAddModal,
  onEditPatient,
  onRefreshPatients,
  onNavigateTab
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (patientId) => {
    setDeleting(true);
    try {
      await apiClient.deletePatient(patientId);
      setDeleteConfirmId(null);
      await onRefreshPatients();
    } catch (err) {
      alert(err.message || 'Failed to delete patient profile.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#3D52A0] tracking-tight">
              Patient & Family Records Database
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
              {patients.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8697C4] font-medium mt-1">
            Manage your personal and family medical profiles. Selected patient context persists across all report analyses.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Patient / Family Member</span>
        </button>
      </div>

      {/* ============================================================================ */}
      {/* MANDATORY INITIAL EMPTY STATE                                                */}
      {/* Starts COMPLETELY EMPTY for newly registered users                           */}
      {/* Clean empty-state vector graphic: "No patients added yet..."                 */}
      {/* ============================================================================ */}
      {patients.length === 0 ? (
        <div className="med-card p-12 text-center max-w-2xl mx-auto space-y-6">
          {/* Clean Vector Graphic for Empty State */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#EDE8F5] border-2 border-dashed border-[#ADBBDA] flex items-center justify-center text-[#7091E6] shadow-inner">
            <Users className="w-12 h-12 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-[#3D52A0]">
              No patients added yet.
            </h3>
            <p className="text-sm text-[#8697C4] max-w-md mx-auto leading-relaxed">
              Add yourself or a family member to begin tracking reports, calculating biological deltas, and synthesizing doctor questions.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Yourself or Family Member</span>
          </button>
        </div>
      ) : (
        /* Patient Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p) => {
            const isActive = activePatient?.id === p.id;
            return (
              <div
                key={p.id}
                className={`med-card p-6 flex flex-col justify-between relative transition-all ${
                  isActive ? 'border-2 border-[#7091E6] bg-white ring-2 ring-[#7091E6]/20' : 'bg-white'
                }`}
              >
                {/* Active Selection Badge */}
                {isActive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-extrabold text-[#7091E6] bg-[#EDE8F5] px-2.5 py-0.5 rounded-full border border-[#ADBBDA]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Active Context</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D52A0] to-[#7091E6] text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {p.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#3D52A0] leading-snug">
                        {p.full_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#7091E6]">
                          {p.relationship}
                        </span>
                        <span className="text-[#ADBBDA]">•</span>
                        <span className="text-xs text-[#8697C4]">
                          {p.gender || 'Unspecified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Rows */}
                  <div className="p-3 bg-[#EDE8F5]/40 rounded-xl space-y-1.5 text-xs text-[#3D52A0] border border-[#ADBBDA]/40">
                    <div className="flex justify-between">
                      <span className="text-[#8697C4] font-medium">Date of Birth:</span>
                      <span className="font-bold">{p.date_of_birth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8697C4] font-medium">Blood Group:</span>
                      <span className="font-bold text-[#7091E6]">{p.blood_group || 'N/A'}</span>
                    </div>
                    {p.emergency_contact && (
                      <div className="flex justify-between">
                        <span className="text-[#8697C4] font-medium">Emergency:</span>
                        <span className="font-semibold truncate max-w-[140px]">{p.emergency_contact}</span>
                      </div>
                    )}
                    {p.primary_physician && (
                      <div className="flex justify-between">
                        <span className="text-[#8697C4] font-medium">Physician:</span>
                        <span className="font-semibold truncate max-w-[140px]">{p.primary_physician}</span>
                      </div>
                    )}
                  </div>

                  {/* Pre-existing Conditions */}
                  {p.pre_existing_conditions ? (
                    <div className="text-xs">
                      <span className="text-[#8697C4] font-bold block mb-1">Pre-existing Conditions:</span>
                      <p className="text-[#3D52A0] font-medium line-clamp-2 bg-[#EDE8F5]/20 p-2 rounded-lg border border-[#ADBBDA]/30">
                        {p.pre_existing_conditions}
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-[#8697C4] italic">
                      No chronic conditions recorded
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-4 mt-4 border-t border-[#EDE8F5] space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPatient(p)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]'
                          : 'bg-[#7091E6] hover:bg-[#3D52A0] text-white shadow-xs'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isActive ? 'Current Context' : 'Select Context'}</span>
                    </button>

                    <button
                      onClick={() => onEditPatient(p)}
                      className="p-2 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/40 text-[#3D52A0] transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isActive && (
                    <button
                      onClick={() => onNavigateTab('reports')}
                      className="w-full py-1.5 text-center text-xs font-extrabold text-[#7091E6] hover:underline flex items-center justify-center gap-1"
                    >
                      <span>Analyze Reports for {p.full_name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#ADBBDA] rounded-2xl shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#3D52A0]">
                Delete Patient Profile?
              </h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                This action is permanent and will cascade delete all associated lab reports, biomarker trends, and checkup reminders for this family member.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#EDE8F5] text-xs font-bold text-[#3D52A0] hover:bg-[#ADBBDA]/30"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
