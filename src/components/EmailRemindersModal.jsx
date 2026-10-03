import React, { useState, useEffect } from 'react';
import {
  Clock,
  Send,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  Mail,
  Loader2,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';
import { apiClient } from '../api/client';

export default function EmailRemindersModal({
  isOpen,
  onClose,
  patients = [],
  activePatient,
  user
}) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(activePatient?.id || (patients[0]?.id || ''));
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [frequency, setFrequency] = useState('ANNUAL');
  const [reminderType, setReminderType] = useState('ANNUAL_CHECKUP');

  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReminders();
      if (activePatient?.id) setSelectedPatientId(activePatient.id);
    }
  }, [isOpen, activePatient?.id]);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getReminders();
      setReminders(data);
    } catch (e) {
      console.error('Failed to load reminders', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setLoading(true);
    try {
      await apiClient.scheduleReminder(selectedPatientId, scheduledDate, reminderType, frequency);
      await loadReminders();
      alert('Checkup reminder successfully scheduled!');
    } catch (err) {
      alert(err.message || 'Failed to schedule reminder.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setDispatching(true);
    setDispatchResult(null);
    try {
      const res = await apiClient.sendTestEmail(selectedPatientId || null, reminderType);
      setDispatchResult(res);
      await loadReminders();
    } catch (err) {
      alert(err.message || 'Failed to dispatch email.');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D52A0]/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-[#ADBBDA] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#EDE8F5] border-b border-[#ADBBDA] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#7091E6]" />
            <h3 className="font-extrabold text-lg text-[#3D52A0]">
              Automated Email Health Checkup Reminders
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8697C4] hover:text-[#3D52A0] hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Dispatch to registered address info */}
          <div className="p-4 rounded-xl bg-[#EDE8F5]/60 border border-[#ADBBDA] flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#7091E6] shrink-0 mt-0.5" />
            <div className="text-xs text-[#3D52A0] space-y-1">
              <div className="font-bold">Registered Recipient Email:</div>
              <div className="font-medium text-[#7091E6] font-mono">{user?.email}</div>
              <p className="text-[#8697C4] leading-relaxed">
                Health checkup reminders are formatted in responsive HTML with personalized patient context, upcoming test dates, and direct links back to Mediscope.
              </p>
            </div>
          </div>

          {/* Test Dispatch Button & Feedback */}
          <div className="p-4 rounded-xl bg-white border border-[#ADBBDA] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#3D52A0]">
                  Immediate Test Email Dispatch Engine
                </h4>
                <p className="text-xs text-[#8697C4]">
                  Trigger an instantaneous formatted checkup notification to verify email delivery.
                </p>
              </div>

              <button
                type="button"
                disabled={dispatching}
                onClick={handleSendTestEmail}
                className="px-4 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {dispatching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test Email Now</span>
                  </>
                )}
              </button>
            </div>

            {dispatchResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dispatched Successfully ({dispatchResult.status})</span>
                  </span>
                  <button
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="text-xs font-extrabold text-[#7091E6] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showEmailPreview ? 'Hide HTML Preview' : 'View Formatted Email'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  {dispatchResult.delivery_note}
                </div>

                {showEmailPreview && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-[#ADBBDA] max-h-60 overflow-y-auto">
                    <iframe
                      srcDoc={dispatchResult.html_preview}
                      title="Email Preview"
                      className="w-full h-56 border-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule Form */}
          <form onSubmit={handleSchedule} className="p-4 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] space-y-4">
            <h4 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider">
              Schedule Periodic Health Reminder
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3D52A0] mb-1">
                  Target Family Member *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ADBBDA] text-xs text-[#3D52A0] font-medium outline-hidden"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] mb-1">
                  Scheduled Checkup Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ADBBDA] text-xs text-[#3D52A0] font-medium outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] mb-1">
                  Notification Cadence / Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ADBBDA] text-xs text-[#3D52A0] font-medium outline-hidden"
                >
                  <option value="ANNUAL">Annual Checkup</option>
                  <option value="SEMI_ANNUAL">Semi-Annual (Every 6 Months)</option>
                  <option value="QUARTERLY">Quarterly (Every 3 Months)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] mb-1">
                  Reminder Category
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#ADBBDA] text-xs text-[#3D52A0] font-medium outline-hidden"
                >
                  <option value="ANNUAL_CHECKUP">Annual Physical & Wellness Exam</option>
                  <option value="LAB_FOLLOWUP">Diagnostic Lab Panel Follow-up</option>
                  <option value="GLUCOSE_MONITORING">Glycemic / HbA1c Retesting</option>
                  <option value="LIPID_RETEST">Cardiovascular Lipid Panel Retest</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || patients.length === 0}
              className="w-full py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving Schedule...' : 'Save Scheduled Reminder'}
            </button>
          </form>

          {/* Existing Scheduled Reminders List */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8697C4]">
              Active Scheduled Notifications ({reminders.length})
            </div>

            {reminders.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#8697C4] italic">
                No reminders scheduled yet. Add an upcoming health checkup above.
              </div>
            ) : (
              reminders.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-white rounded-xl border border-[#ADBBDA] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#3D52A0] mr-2">
                      {r.patient_name}
                    </span>
                    <span className="text-[11px] text-[#8697C4]">
                      {r.reminder_type.replace(/_/g, ' ')} • {r.frequency}
                    </span>
                    <div className="text-[10px] text-[#7091E6] font-semibold mt-0.5">
                      Target Date: {r.scheduled_date}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      r.status === 'SENT'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
