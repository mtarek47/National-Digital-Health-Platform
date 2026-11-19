import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  FileCode2, 
  History, 
  UserPlus, 
  Sparkles,
  Network,
  Scan 
} from 'lucide-react';
import { api } from './api';
import type { DigitalHealthCard, MedicalTimelineItem, Hospital, ConsentRecord, AccessLog } from './types';
import { HealthCardView } from './components/HealthCardView';
import { DoctorWorkstation } from './components/DoctorWorkstation';
import { FhirViewer } from './components/FhirViewer';
import { RegisterPatientModal } from './components/RegisterPatientModal';
import { ComprehensiveEhrHub } from './components/ComprehensiveEhrHub';
import { MriStudyViewer } from './components/MriStudyViewer';

export const App: React.FC = () => {
  const [activePortal, setActivePortal] = useState<'ehr-hub' | 'patient' | 'doctor' | 'fhir' | 'audit'>('ehr-hub');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentCard, setCurrentCard] = useState<DigitalHealthCard | null>(null);
  const [timeline, setTimeline] = useState<MedicalTimelineItem[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [audits, setAudits] = useState<AccessLog[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMriModal, setShowMriModal] = useState(false);

  // Initial load
  const loadInitialData = async () => {
    try {
      const hosps = await api.getHospitals();
      setHospitals(hosps);
      setBackendOnline(true);

      // Load synthetic demo patient (Rahim Uddin)
      const demoCard = await api.getCardByHealthId('HID-2026-884219');
      setCurrentCard(demoCard);

      if (demoCard) {
        refreshPatientData(demoCard.patientId);
      }
    } catch (e) {
      console.error('Backend connection check failed:', e);
      setBackendOnline(false);
    }
  };

  const refreshPatientData = async (patientId: string) => {
    try {
      const tl = await api.getTimeline(patientId).catch(err => {
        console.error('Failed to load timeline:', err);
        return [];
      });
      setTimeline(tl);

      const cs = await api.getPatientConsents(patientId).catch(err => {
        console.error('Failed to load consents:', err);
        return [];
      });
      setConsents(cs);

      const au = await api.getPatientAudits(patientId).catch(err => {
        console.error('Failed to load audits:', err);
        return [];
      });
      setAudits(au);
    } catch (e) {
      console.error('Unexpected error in refreshPatientData:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleGrantConsent = async (durationHours: number) => {
    if (!currentCard) return;
    try {
      await api.grantConsent({
        patientId: currentCard.patientId,
        durationHours,
        purpose: 'Outpatient consultation and emergency care'
      });
      refreshPatientData(currentCard.patientId);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePatientLoaded = (card: DigitalHealthCard) => {
    setCurrentCard(card);
    refreshPatientData(card.patientId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top National Header */}
      <header className="bg-slate-900 text-white border-b border-emerald-500/30 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shadow-sm border border-red-400 text-xs">
              BD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-wide text-white">NATIONAL DIGITAL HEALTH PLATFORM</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  FHIR R4 PROTOTYPE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Directorate General of Health Services (DGHS) • Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {backendOnline ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Spring Boot 3 Live (Port 8081)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-400 border border-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Connecting to Backend...
              </span>
            )}

            <button
              onClick={() => setShowMriModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-xs"
            >
              <Scan className="w-3.5 h-3.5" /> 1.5T Brain MRI (PACS)
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" /> Issue New Card
            </button>
          </div>
        </div>
      </header>

      {/* Sleek Context Sub-bar */}
      <section className="bg-slate-900/90 text-slate-300 py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              <strong className="text-emerald-300 font-semibold">National EHR Network:</strong> Longitudinal records synced across <span className="text-white font-medium">DMCH (Hospital A)</span> and <span className="text-white font-medium">CMCH (Hospital B)</span> via HL7 FHIR R4 & IOM Core Architecture.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Current Patient:</span>
            <span className="font-bold text-white bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
              {currentCard?.fullName || 'Rahim Uddin'} ({currentCard?.healthId || 'HID-2026-884219'})
            </span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Modern Pill Style */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
          <button
            onClick={() => setActivePortal('ehr-hub')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'ehr-hub'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Comprehensive EHR Cockpit
          </button>
          <button
            onClick={() => setActivePortal('patient')}
            className={`py-2 px-3.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'patient'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Patient Health Card
          </button>
          <button
            onClick={() => setActivePortal('doctor')}
            className={`py-2 px-3.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'doctor'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Doctor CPOE & CDSS
          </button>
          <button
            onClick={() => setActivePortal('fhir')}
            className={`py-2 px-3.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'fhir'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> HL7 FHIR R4 Inspector
          </button>
          <button
            onClick={() => setActivePortal('audit')}
            className={`py-2 px-3.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 whitespace-nowrap ${
              activePortal === 'audit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Central Audit Ledger
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activePortal === 'ehr-hub' && (
          <ComprehensiveEhrHub
            card={currentCard}
            timeline={timeline}
            hospitals={hospitals}
            consents={consents}
            audits={audits}
            onOpenMriViewer={() => setShowMriModal(true)}
            onOpenDoctorPortal={() => setActivePortal('doctor')}
            onOpenFhirPortal={() => setActivePortal('fhir')}
          />
        )}

        {activePortal === 'patient' && (
          <HealthCardView
            card={currentCard}
            timeline={timeline}
            consents={consents}
            audits={audits}
            onOpenRegisterModal={() => setShowRegisterModal(true)}
            onGrantConsent={handleGrantConsent}
            onOpenMriViewer={() => setShowMriModal(true)}
          />
        )}

        {activePortal === 'doctor' && (
          <DoctorWorkstation
            hospitals={hospitals}
            currentCard={currentCard}
            onPatientLoaded={handlePatientLoaded}
            onRefreshTimeline={() => {
              if (currentCard) refreshPatientData(currentCard.patientId);
            }}
            onOpenMriViewer={() => setShowMriModal(true)}
          />
        )}

        {activePortal === 'fhir' && (
          <FhirViewer currentCard={currentCard} />
        )}

        {activePortal === 'audit' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">National Healthcare Tamper-Evident Audit Ledger</h3>
              <p className="text-xs text-slate-500">Every cross-hospital query, clinical record entry, and break-glass exception recorded across the country.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor / Role</th>
                    <th className="p-3">Healthcare Facility</th>
                    <th className="p-3">Action Type</th>
                    <th className="p-3">Clinical Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {audits.map((a) => (
                    <tr key={a.id}>
                      <td className="p-3 font-mono text-slate-500">{new Date(a.accessedAt).toLocaleString()}</td>
                      <td className="p-3 font-semibold text-slate-800">{a.actorName} ({a.actorType})</td>
                      <td className="p-3 text-slate-700">{a.hospital ? a.hospital.name : 'DGHS Master Index'}</td>
                      <td className="p-3">
                        <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {a.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{a.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal for Registering a Patient */}
      <RegisterPatientModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegistered={(newCard) => {
          handlePatientLoaded(newCard);
          setActivePortal('patient');
        }}
      />

      {/* 1.5T MRI PACS Modal */}
      {showMriModal && (
        <MriStudyViewer onClose={() => setShowMriModal(false)} />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 Directorate General of Health Services (DGHS) — National Digital Health Card System.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
              Swagger OpenAPI Documentation
            </a>
            <span>•</span>
            <a href="/h2-console" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
              H2 Database Console
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
