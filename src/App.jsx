import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LandingHero from './components/LandingHero';
import AuthModal from './components/AuthModal';
import MainOverview from './components/MainOverview';
import PatientManagement from './components/PatientManagement';
import AddPatientModal from './components/AddPatientModal';
import ReportUploadZone from './components/ReportUploadZone';
import LabResultsDisplay from './components/LabResultsDisplay';
import ComparativeTrends from './components/ComparativeTrends';
import DoctorQuestionsCard from './components/DoctorQuestionsCard';
import SpecialistDirectory from './components/SpecialistDirectory';
import EmailRemindersModal from './components/EmailRemindersModal';
import ClinicalBriefingPDF from './components/ClinicalBriefingPDF';
import { apiClient } from './api/client';

export default function App() {
  const [user, setUser] = useState(apiClient.getUser());
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  
  // Navigation tabs: 'overview', 'patients', 'reports', 'questions', 'specialists', 'reminders'
  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [remindersModalOpen, setRemindersModalOpen] = useState(false);
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);

  // Active Report state
  const [activeReportData, setActiveReportData] = useState(null);

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  const loadPatients = async () => {
    try {
      const data = await apiClient.getPatients();
      setPatients(data);
      if (data.length > 0 && !activePatient) {
        setActivePatient(data[0]);
      } else if (data.length === 0) {
        setActivePatient(null);
      }
    } catch (e) {
      console.error('Failed to load patients', e);
    }
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setActiveTab('overview');
    loadPatients();
  };

  const handleLogout = () => {
    apiClient.logout();
    setUser(null);
    setPatients([]);
    setActivePatient(null);
    setActiveReportData(null);
    setActiveTab('overview');
  };

  const handleSelectPatient = (p) => {
    setActivePatient(p);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialTab(mode);
    setAuthModalOpen(true);
  };

  const handleOpenAddPatient = () => {
    setPatientToEdit(null);
    setAddPatientModalOpen(true);
  };

  const handleOpenEditPatient = (p) => {
    setPatientToEdit(p);
    setAddPatientModalOpen(true);
  };

  const handlePatientSaved = (savedPatient) => {
    loadPatients();
    setActivePatient(savedPatient);
  };

  const handleReportProcessed = (reportResult) => {
    setActiveReportData(reportResult);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE8F5] text-[#3D52A0]">
      {/* Persistent Global Header / Navbar */}
      <Navbar
        user={user}
        activePatient={activePatient}
        patients={patients}
        onSelectPatient={handleSelectPatient}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenReminders={() => setRemindersModalOpen(true)}
      />

      {/* Main Body Layout */}
      {!user ? (
        /* ============================================================================ */
        /* LANDING VIEW (Pre-Login)                                                     */
        /* Hero with Cumulative Sequential Text Animation + Feature Highlights & Footer */
        /* ============================================================================ */
        <main className="flex-1 flex flex-col">
          <LandingHero onOpenAuth={handleOpenAuth} />
        </main>
      ) : (
        /* ============================================================================ */
        /* AUTHENTICATED PORTAL (Portion 3, 4, 5, 6, 7, 8, 9, 10)                       */
        /* Fixed Left Navigation Sidebar + Tabbed Dashboard Content                     */
        /* ============================================================================ */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                if (tab === 'reminders') {
                  setRemindersModalOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              user={user}
              activePatient={activePatient}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content Workspace */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {/* Mobile Tab Nav Indicator */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'patients', label: 'Patients' },
                { id: 'reports', label: 'Reports & OCR' },
                { id: 'questions', label: 'Doctor Questions' },
                { id: 'specialists', label: 'Specialists' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === t.id ? 'bg-[#7091E6] text-white' : 'bg-white text-[#3D52A0] border border-[#ADBBDA]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: Home / Main Overview */}
            {activeTab === 'overview' && (
              <MainOverview
                user={user}
                patients={patients}
                activePatient={activePatient}
                onNavigateTab={(tab) => {
                  if (tab === 'reminders') setRemindersModalOpen(true);
                  else setActiveTab(tab);
                }}
                onOpenAddPatient={handleOpenAddPatient}
              />
            )}

            {/* TAB: Patient & Family Records */}
            {activeTab === 'patients' && (
              <PatientManagement
                patients={patients}
                activePatient={activePatient}
                onSelectPatient={handleSelectPatient}
                onOpenAddModal={handleOpenAddPatient}
                onEditPatient={handleOpenEditPatient}
                onRefreshPatients={loadPatients}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* TAB: Health Reports & Analytics */}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                <ReportUploadZone
                  activePatient={activePatient}
                  onReportProcessed={handleReportProcessed}
                  onOpenAddPatient={handleOpenAddPatient}
                />

                {activeReportData && (
                  <LabResultsDisplay
                    reportData={activeReportData}
                    activePatient={activePatient}
                    onNavigateTab={setActiveTab}
                  />
                )}

                <ComparativeTrends
                  activePatient={activePatient}
                  onNavigateTab={setActiveTab}
                />
              </div>
            )}

            {/* TAB: Doctor Consultation Questions */}
            {activeTab === 'questions' && (
              <DoctorQuestionsCard
                activePatient={activePatient}
                onOpenPrintPreview={() => setBriefingModalOpen(true)}
              />
            )}

            {/* TAB: Local Specialist Directory */}
            {activeTab === 'specialists' && (
              <SpecialistDirectory activePatient={activePatient} />
            )}
          </main>
        </div>
      )}

      {/* ============================================================================ */}
      {/* PERSISTENT GLOBAL FOOTER ACROSS ALL APPLICATION VIEWS                        */}
      {/* Explicit Copyright Statement & Safety Disclaimer                             */}
      {/* ============================================================================ */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Add / Edit Patient Modal */}
      <AddPatientModal
        isOpen={addPatientModalOpen}
        onClose={() => setAddPatientModalOpen(false)}
        onPatientSaved={handlePatientSaved}
        patientToEdit={patientToEdit}
      />

      {/* Health Reminders & Email Preferences Modal */}
      <EmailRemindersModal
        isOpen={remindersModalOpen}
        onClose={() => setRemindersModalOpen(false)}
        patients={patients}
        activePatient={activePatient}
        user={user}
      />

      {/* Printable Clinical Consultation Briefing Document */}
      <ClinicalBriefingPDF
        isOpen={briefingModalOpen}
        onClose={() => setBriefingModalOpen(false)}
        activePatient={activePatient}
        reportData={activeReportData}
        trendsData={null}
        questionsData={null}
      />
    </div>
  );
}
