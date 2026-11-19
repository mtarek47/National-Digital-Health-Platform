import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  FileCode2, 
  History, 
  UserPlus, 
  Network,
  Scan,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  HeartPulse,
  ExternalLink,
  X,
  LayoutGrid,
  FlaskConical,
  BellRing,
  ClipboardList,
  Activity,
  Share2,
  HeartHandshake,
  CreditCard,
  LineChart
} from 'lucide-react';
import { api } from './api';
import type { DigitalHealthCard, MedicalTimelineItem, Hospital, ConsentRecord, AccessLog } from './types';
import { HealthCardView } from './components/HealthCardView';
import { DoctorWorkstation } from './components/DoctorWorkstation';
import { FhirViewer } from './components/FhirViewer';
import { RegisterPatientModal } from './components/RegisterPatientModal';
import { ComprehensiveEhrHub } from './components/ComprehensiveEhrHub';
import { MriStudyViewer } from './components/MriStudyViewer';

type PortalType = 'ehr-hub' | 'patient' | 'doctor' | 'fhir' | 'audit';

export const App: React.FC = () => {
  const [activePortal, setActivePortal] = useState<PortalType>('ehr-hub');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentCard, setCurrentCard] = useState<DigitalHealthCard | null>(null);
  const [timeline, setTimeline] = useState<MedicalTimelineItem[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [audits, setAudits] = useState<AccessLog[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMriModal, setShowMriModal] = useState(false);

  // Sidebar Drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Submenu state for Comprehensive EHR Hub
  const [isEhrSubmenuOpen, setIsEhrSubmenuOpen] = useState(true);
  const [selectedEhrPillarId, setSelectedEhrPillarId] = useState<number>(2); // Default to Pillar 2 (Result Management / MRI)
  const [ehrViewMode, setEhrViewMode] = useState<'cockpit' | 'diagram'>('cockpit');

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

  const copyHealthId = () => {
    if (currentCard?.healthId) {
      navigator.clipboard.writeText(currentCard.healthId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // 8 Core Pillars & Architecture Overview under Comprehensive EHR Hub
  const ehrSubmenuItems = [
    {
      id: 'ehr-overview',
      label: 'Architecture Blueprint',
      subLabel: 'Central IOM Hub & 8 Pillars',
      pillarId: 0,
      isOverview: true,
      icon: LayoutGrid,
      badge: 'IOM Map',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'pillar-2',
      label: 'Result Management',
      subLabel: '1.5T Brain MRI & Labs',
      pillarId: 2,
      isOverview: false,
      icon: FlaskConical,
      badge: '1.5T PACS',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'pillar-4',
      label: 'Decision Support',
      subLabel: 'CDSS Alerts & Safety',
      pillarId: 4,
      isOverview: false,
      icon: BellRing,
      badge: '3 Alerts',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'pillar-3',
      label: 'Order Management',
      subLabel: 'CPOE Physician Order Entry',
      pillarId: 3,
      isOverview: false,
      icon: ClipboardList,
      badge: 'Signed',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'pillar-1',
      label: 'Health Information & Data',
      subLabel: 'Computable Vitals & ICD-10',
      pillarId: 1,
      isOverview: false,
      icon: Activity,
      badge: 'Synced',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    },
    {
      id: 'pillar-5',
      label: 'Electronic Communication',
      subLabel: 'Inter-Hospital HIE & FHIR',
      pillarId: 5,
      isOverview: false,
      icon: Share2,
      badge: 'HIE Live',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'pillar-6',
      label: 'Patient Support',
      subLabel: 'Telemonitoring & Home Care',
      pillarId: 6,
      isOverview: false,
      icon: HeartHandshake,
      badge: 'Tracked',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'pillar-7',
      label: 'Administrative Processes',
      subLabel: 'Eligibility & Claims Savings',
      pillarId: 7,
      isOverview: false,
      icon: CreditCard,
      badge: 'Eligible',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'pillar-8',
      label: 'Population Health & Radar',
      subLabel: 'Biosurveillance & Quality KPIs',
      pillarId: 8,
      isOverview: false,
      icon: LineChart,
      badge: 'DGHS Radar',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  ];

  // Primary navigation items
  const primaryNavItems = [
    {
      id: 'doctor' as PortalType,
      label: 'Doctor CPOE & CDSS',
      shortLabel: 'CPOE / CDSS',
      group: 'Clinical Cockpit',
      desc: 'Orders, Decision Support, PACS',
      icon: Stethoscope,
      badge: '3 Alerts',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'patient' as PortalType,
      label: 'Patient Health Card',
      shortLabel: 'Health Card',
      group: 'Clinical Cockpit',
      desc: 'Longitudinal Record & QR Token',
      icon: ShieldCheck,
      badge: 'Smart Card',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'fhir' as PortalType,
      label: 'HL7 FHIR R4 Inspector',
      shortLabel: 'FHIR R4',
      group: 'Interoperability',
      desc: 'REST API & Resource Payloads',
      icon: FileCode2,
      badge: 'Interoperable',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'audit' as PortalType,
      label: 'Central Audit Ledger',
      shortLabel: 'Audit Logs',
      group: 'Interoperability',
      desc: 'Immutable Access & Consent Logs',
      icon: History,
      badge: `${audits.length || 10} Logs`,
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
    },
  ];

  const activePillarObj = ehrSubmenuItems.find(p => !p.isOverview && p.pillarId === selectedEhrPillarId);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex overflow-hidden font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ==================================================================== */}
      {/* ENTERPRISE SIDEBAR DRAWER WITH ACCORDION SUBMENUS                   */}
      {/* ==================================================================== */}
      <aside 
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          ${isSidebarOpen ? 'w-80' : 'w-20'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-slate-900 text-slate-200 border-r border-slate-800
          flex flex-col transition-all duration-300 ease-in-out shrink-0
          shadow-2xl lg:shadow-none select-none
        `}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-800/80 px-4 flex items-center justify-between gap-3 bg-slate-950/50">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* DGHS / BD Gov Emblem Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 p-0.5 shadow-md shrink-0 flex items-center justify-center border border-emerald-500/40">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center relative">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-900" />
              </div>
            </div>

            {isSidebarOpen && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs font-black tracking-wider text-white uppercase truncate">
                    DGHS PLATFORM
                  </h1>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                    EHR
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  National Health System • BD
                </p>
              </div>
            )}
          </div>

          {/* Toggle sidebar button (Desktop) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white items-center justify-center transition border border-slate-700/60"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Close drawer button (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section with Scrollable Tree */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* ================================================================= */}
          {/* GROUP 1: CLINICAL COCKPIT & EHR HUB ACCORDION                     */}
          {/* ================================================================= */}
          <div>
            {isSidebarOpen && (
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Clinical Cockpit</span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold">IOM 8-PILLARS</span>
              </div>
            )}
            
            <div className="space-y-1">
              {/* Comprehensive EHR Hub Parent Item */}
              <div>
                <button
                  onClick={() => {
                    setActivePortal('ehr-hub');
                    if (isSidebarOpen) {
                      setIsEhrSubmenuOpen(prev => activePortal === 'ehr-hub' ? !prev : true);
                    } else {
                      setIsSidebarOpen(true);
                      setIsEhrSubmenuOpen(true);
                    }
                  }}
                  title={!isSidebarOpen ? "Comprehensive EHR Hub (8 Pillars)" : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition group relative
                    ${activePortal === 'ehr-hub' 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}
                  `}
                >
                  <Network className={`w-4 h-4 shrink-0 transition ${activePortal === 'ehr-hub' ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                  
                  {isSidebarOpen && (
                    <div className="flex-1 text-left min-w-0 flex items-center justify-between gap-1.5">
                      <div className="truncate">
                        <div className="truncate font-bold">Comprehensive EHR Hub</div>
                        <div className={`text-[10px] truncate ${activePortal === 'ehr-hub' ? 'text-emerald-100' : 'text-slate-400'}`}>
                          Central IOM Architecture
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                          activePortal === 'ehr-hub'
                            ? 'bg-emerald-700/90 text-white border-emerald-500'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          8 Pillars
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isEhrSubmenuOpen ? 'rotate-180 text-emerald-200' : 'text-slate-400'
                        }`} />
                      </div>
                    </div>
                  )}

                  {!isSidebarOpen && activePortal === 'ehr-hub' && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-md" />
                  )}
                </button>

                {/* Nested Submenu: 8 Core Pillars + Architecture Overview */}
                {isSidebarOpen && isEhrSubmenuOpen && (
                  <div className="pl-3.5 ml-4 mt-1.5 mb-2 border-l-2 border-emerald-500/40 space-y-1 transition-all">
                    {ehrSubmenuItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = 
                        activePortal === 'ehr-hub' && 
                        (sub.isOverview ? ehrViewMode === 'diagram' : (ehrViewMode === 'cockpit' && selectedEhrPillarId === sub.pillarId));

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActivePortal('ehr-hub');
                            if (sub.isOverview) {
                              setEhrViewMode('diagram');
                            } else {
                              setEhrViewMode('cockpit');
                              setSelectedEhrPillarId(sub.pillarId);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left group
                            ${isSubActive 
                              ? 'bg-emerald-700/80 text-white font-bold shadow-xs border border-emerald-500/50' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'}
                          `}
                        >
                          <div className="flex items-center gap-2 min-w-0 truncate">
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                            <div className="truncate">
                              <span className="truncate block leading-tight">{sub.label}</span>
                              <span className={`text-[9px] truncate block ${isSubActive ? 'text-emerald-200' : 'text-slate-500'}`}>
                                {sub.subLabel}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${
                            isSubActive 
                              ? 'bg-emerald-900/90 text-emerald-200 border-emerald-400' 
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          }`}>
                            {sub.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Other Clinical Cockpit Items */}
              {primaryNavItems.slice(0, 2).map((item) => {
                const IconComponent = item.icon;
                const isActive = activePortal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePortal(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    title={!isSidebarOpen ? item.label : undefined}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition group relative
                      ${isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}
                    `}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                    
                    {isSidebarOpen && (
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ml-1.5 shrink-0 ${isActive ? 'bg-emerald-700/80 text-white border-emerald-500' : item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                          {item.desc}
                        </div>
                      </div>
                    )}

                    {!isSidebarOpen && isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROUP 2: INTEROPERABILITY & COMPLIANCE                            */}
          {/* ================================================================= */}
          <div>
            {isSidebarOpen && (
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Interoperability & Audits
              </div>
            )}
            <div className="space-y-1">
              {primaryNavItems.slice(2, 4).map((item) => {
                const IconComponent = item.icon;
                const isActive = activePortal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePortal(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    title={!isSidebarOpen ? item.label : undefined}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition group relative
                      ${isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}
                    `}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                    
                    {isSidebarOpen && (
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ml-1.5 shrink-0 ${isActive ? 'bg-emerald-700/80 text-white border-emerald-500' : item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                          {item.desc}
                        </div>
                      </div>
                    )}

                    {!isSidebarOpen && isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROUP 3: RAPID CLINICAL ACTIONS                                   */}
          {/* ================================================================= */}
          <div>
            {isSidebarOpen && (
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Clinical Diagnostics
              </div>
            )}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowMriModal(true);
                  setIsMobileMenuOpen(false);
                }}
                title={!isSidebarOpen ? "1.5T Brain MRI (PACS)" : undefined}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 transition shadow-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 border border-emerald-500/40">
                  <Scan className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-emerald-300 truncate">1.5T Brain MRI (PACS)</div>
                    <div className="text-[10px] text-slate-400 truncate">16-Slice DICOM Engine</div>
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setShowRegisterModal(true);
                  setIsMobileMenuOpen(false);
                }}
                title={!isSidebarOpen ? "Issue New Digital Health Card" : undefined}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-600 text-white transition shadow-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
                  <UserPlus className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold truncate">Issue New Card</div>
                    <div className="text-[10px] text-emerald-200 truncate">DGHS Biometric NID</div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Active Patient Snapshot & Server Status */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 space-y-3">
          {/* Active Patient Widget */}
          {isSidebarOpen ? (
            <div className="rounded-xl p-2.5 border border-slate-700/70 bg-slate-800/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Subject
                </span>
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {currentCard?.bloodGroup || 'O+'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {currentCard?.fullName || 'Rahim Uddin'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1">
                    <span>{currentCard?.healthId || 'HID-2026-884219'}</span>
                  </div>
                </div>
                <button
                  onClick={copyHealthId}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
                  title="Copy Health ID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`${currentCard?.fullName || 'Rahim Uddin'} (${currentCard?.healthId || 'HID-2026-884219'})`}>
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                RU
              </div>
            </div>
          )}

          {/* Backend Status Dot */}
          <div className="flex items-center justify-between text-[11px] px-1">
            {backendOnline ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isSidebarOpen && <span className="text-[10px] text-slate-300">Backend Live (Port 8081)</span>}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {isSidebarOpen && <span className="text-[10px] text-red-300">Backend Offline</span>}
              </div>
            )}
            {isSidebarOpen && (
              <span className="text-[10px] font-mono text-slate-500">v2.4</span>
            )}
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MAIN VIEW CANVAS                                                     */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Floating App Bar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
          {/* Left: Mobile hamburger & breadcrumb navigation */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Open sidebar drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle quick button if collapsed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-slate-200"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Dynamic Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs truncate">
              <span className="font-semibold text-slate-500 hidden sm:inline">DGHS Ecosystem</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-medium text-slate-600 hidden md:inline">Clinical Cockpit</span>
              <span className="text-slate-300 hidden md:inline">/</span>
              
              {activePortal === 'ehr-hub' ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                    <Network className="w-3.5 h-3.5 text-emerald-600" />
                    Comprehensive EHR Hub
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md truncate text-[11px]">
                    {ehrViewMode === 'diagram' ? 'Architecture Blueprint' : (activePillarObj?.label || 'Result Management')}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                  {primaryNavItems.find(p => p.id === activePortal)?.label}
                </span>
              )}
            </div>
          </div>

          {/* Right: Hospital HIE Status & Clinician Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* HIE Interconnect pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>HIE Interconnected: DMCH ⇄ CMCH</span>
            </div>

            {/* MRI Shortcut Button */}
            <button
              onClick={() => setShowMriModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs transition"
            >
              <Scan className="w-3.5 h-3.5" /> 1.5T Brain PACS
            </button>

            {/* CDSS Alert Bell */}
            <button 
              onClick={() => setActivePortal('doctor')}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Clinical Decision Support Alerts (3 active)"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {/* Clinician Profile Chip */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                AR
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-bold text-slate-800">Prof. Dr. Anisur Rahman</div>
                <div className="text-[10px] text-slate-500">Neurology & EHR Officer • DMCH</div>
              </div>
            </div>
          </div>
        </header>

        {/* Secondary Context Banner: Highlighting Real-Time Interoperability */}
        <div className="bg-slate-900 text-slate-300 py-2 px-4 sm:px-6 border-b border-slate-800 text-xs shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              <strong className="text-emerald-300 font-semibold">Centralized Health Backbone:</strong> HL7 FHIR R4 repository synced across <span className="text-white font-medium">Dhaka Medical College</span> & <span className="text-white font-medium">Chittagong Medical College</span>.
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0 text-[11px]">
            <span className="text-slate-400">Current Subject:</span>
            <span className="font-bold text-emerald-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
              {currentCard?.fullName || 'Rahim Uddin'} ({currentCard?.healthId || 'HID-2026-884219'})
            </span>
          </div>
        </div>

        {/* Scrollable Main Content Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
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
                selectedPillarId={selectedEhrPillarId}
                onSelectPillar={(id) => {
                  setSelectedEhrPillarId(id);
                  setEhrViewMode('cockpit');
                }}
                viewMode={ehrViewMode}
                onViewModeChange={(mode) => setEhrViewMode(mode)}
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
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">National Healthcare Tamper-Evident Audit Ledger</h3>
                    <p className="text-xs text-slate-500">Every cross-hospital query, clinical record entry, and break-glass exception recorded across the country.</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    {audits.length} Verified Entries
                  </span>
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
                        <tr key={a.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono text-slate-500">{new Date(a.accessedAt).toLocaleString()}</td>
                          <td className="p-3 font-semibold text-slate-800">{a.actorName} ({a.actorType})</td>
                          <td className="p-3 text-slate-700">{a.hospital ? a.hospital.name : 'DGHS Master Index'}</td>
                          <td className="p-3">
                            <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
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

            {/* Main Area Footer */}
            <footer className="pt-8 pb-4 text-xs text-slate-500 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <p>© 2026 Directorate General of Health Services (DGHS) — National Digital Health Card System.</p>
              <div className="flex items-center gap-4 text-[11px]">
                <a href="http://localhost:8081/swagger-ui.html" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline">
                  Swagger OpenAPI Docs <ExternalLink className="w-3 h-3" />
                </a>
                <span>•</span>
                <a href="http://localhost:8081/h2-console" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline">
                  H2 Database Console <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>

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
    </div>
  );
};

export default App;
