import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';

export default function AddPatientModal({
  isOpen,
  onClose,
  onPatientSaved,
  patientToEdit = null
}) {
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Self');
  const [dob, setDob] = useState('1990-01-01');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [preExistingConditions, setPreExistingConditions] = useState('');
  const [primaryPhysician, setPrimaryPhysician] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    if (patientToEdit) {
      setFullName(patientToEdit.full_name || '');
      setRelationship(patientToEdit.relationship || 'Self');
      setDob(patientToEdit.date_of_birth || '1990-01-01');
      setGender(patientToEdit.gender || 'Female');
      setBloodGroup(patientToEdit.blood_group || 'O+');
      setEmergencyPhone(patientToEdit.emergency_contact || '');
      setPreExistingConditions(patientToEdit.pre_existing_conditions || '');
      setPrimaryPhysician(patientToEdit.primary_physician || '');
    } else {
      setFullName('');
      setRelationship('Self');
      setDob('1990-01-01');
      setGender('Female');
      setBloodGroup('O+');
      setEmergencyPhone('');
      setPreExistingConditions('');
      setPrimaryPhysician('');
    }
    setErrorNotice('');
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorNotice('Full name is required.');
      return;
    }

    setLoading(true);
    setErrorNotice('');
    try {
      const payload = {
        full_name: fullName.trim(),
        relationship,
        date_of_birth: dob,
        gender,
        blood_group: bloodGroup,
        emergency_contact: emergencyPhone.trim(),
        pre_existing_conditions: preExistingConditions.trim(),
        primary_physician: primaryPhysician.trim()
      };

      let result;
      if (patientToEdit) {
        result = await apiClient.updatePatient(patientToEdit.id, payload);
      } else {
        result = await apiClient.createPatient(payload);
      }

      onPatientSaved(result);
      onClose();
    } catch (err) {
      setErrorNotice(err.message || 'Failed to save patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D52A0]/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white border border-[#ADBBDA] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#EDE8F5] border-b border-[#ADBBDA] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#7091E6]" />
            <h3 className="font-extrabold text-lg text-[#3D52A0]">
              {patientToEdit ? 'Edit Family Member Profile' : 'Add New Family Member / Self'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8697C4] hover:text-[#3D52A0] hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorNotice && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alexander Meesa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden cursor-pointer"
              >
                <option value="Self">Self</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden cursor-pointer"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden cursor-pointer"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Emergency Phone Number
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden"
              />
            </div>

            {/* Primary Physician Name */}
            <div>
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Primary Physician Name
              </label>
              <input
                type="text"
                value={primaryPhysician}
                onChange={(e) => setPrimaryPhysician(e.target.value)}
                placeholder="e.g. Dr. Marcus Vance, MD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden"
              />
            </div>

            {/* Pre-existing Conditions */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1">
                Pre-existing Medical Conditions / Chronic Illnesses
              </label>
              <textarea
                rows={2}
                value={preExistingConditions}
                onChange={(e) => setPreExistingConditions(e.target.value)}
                placeholder="e.g. Type 2 Diabetes, Mild Hypertension, Seasonal Allergies"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EDE8F5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#EDE8F5] text-xs font-bold text-[#3D52A0] hover:bg-[#ADBBDA]/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : patientToEdit ? 'Save Changes' : 'Create Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
