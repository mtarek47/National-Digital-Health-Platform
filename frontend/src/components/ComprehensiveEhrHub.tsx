import React, { useState } from 'react';
import { 
  Network, 
  Activity, 
  FlaskConical, 
  ClipboardList, 
  BellRing, 
  Share2, 
  HeartHandshake, 
  CreditCard, 
  LineChart, 
  Scan, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  FileCode2,
  Building2,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  LayoutGrid
} from 'lucide-react';
import type { 
  DigitalHealthCard, 
  MedicalTimelineItem, 
  Hospital, 
  ConsentRecord, 
  AccessLog,
  CpoeOrder,
  CdssAlert
} from '../types';

interface ComprehensiveEhrHubProps {
  card: DigitalHealthCard | null;
  timeline: MedicalTimelineItem[];
  hospitals: Hospital[];
  consents: ConsentRecord[];
  audits: AccessLog[];
  onOpenMriViewer: () => void;
  onOpenDoctorPortal: () => void;
  onOpenFhirPortal: () => void;
}

export const ComprehensiveEhrHub: React.FC<ComprehensiveEhrHubProps> = ({
  card,
  timeline,
  hospitals,
  consents,
  audits,
  onOpenMriViewer,
  onOpenDoctorPortal,
  onOpenFhirPortal
}) => {
  // Default selected pillar is Result Management (Pillar 2) to showcase MRI & Labs immediately
  const [selectedPillarId, setSelectedPillarId] = useState<number>(2);
  const [viewMode, setViewMode] = useState<'cockpit' | 'diagram'>('cockpit');

  // Simulated CPOE Orders
  const [cpoeOrders] = useState<CpoeOrder[]>([
    {
      id: 'CPOE-801',
      category: 'IMAGING_MRI',
      itemName: 'MRI of Brain (1.5T with Contrast)',
      details: 'Evaluated at DMCH • PACS #MR-2026-9041',
      urgency: 'ROUTINE',
      orderedBy: 'Prof. Dr. Anisur Rahman',
      status: 'COMPLETED',
      cdssChecked: true,
      orderedAt: '5 days ago'
    },
    {
      id: 'CPOE-802',
      category: 'LABORATORY',
      itemName: 'HbA1c & Serum Creatinine',
      details: 'Dual glycemic & renal clearance screening',
      urgency: 'ROUTINE',
      orderedBy: 'Prof. Dr. Anisur Rahman',
      status: 'COMPLETED',
      cdssChecked: true,
      orderedAt: '5 days ago'
    },
    {
      id: 'CPOE-803',
      category: 'MEDICATION',
      itemName: 'Tab. Metformin HCl 500mg',
      details: '1+0+1 with meals for 30 days',
      urgency: 'ROUTINE',
      orderedBy: 'Prof. Dr. Anisur Rahman',
      status: 'IN_PROGRESS',
      cdssChecked: true,
      orderedAt: '5 days ago'
    }
  ]);

  // Active CDSS Alerts
  const cdssAlerts: CdssAlert[] = [
    {
      id: 'CDSS-01',
      type: 'DUPLICATE_ORDER',
      severity: 'HIGH',
      title: 'IOM Duplicate Test Prevention: Brain MRI & HbA1c',
      message: 'Brain MRI (1.5T with Contrast) and HbA1c were completed 5 days ago at DMCH. Repeating this scan at CMCH will be blocked as redundant under national HIE rules.',
      recommendation: 'Re-use existing high-resolution MRI PACS scan and HbA1c 7.4% from central EHR (Saves ৳8,500).',
      sourceGuideline: 'DGHS National Shared Health Record Diagnostic Redundancy Guideline v2.1'
    },
    {
      id: 'CDSS-02',
      type: 'DRUG_INTERACTION',
      severity: 'MEDIUM',
      title: 'CDSS Interaction Alert: Metformin + IV Contrast Precaution',
      message: 'Patient is on Metformin 500mg. Administration of iodinated/gadolinium IV contrast requires verification of renal eGFR (> 60 mL/min/1.73m²).',
      recommendation: 'Baseline eGFR is verified at 88 mL/min (Normal). Recheck renal panel if repeat contrast indicated.',
      sourceGuideline: 'ACR Manual on Contrast Media & ADA Standards of Care'
    },
    {
      id: 'CDSS-03',
      type: 'CLINICAL_REMINDER',
      severity: 'INFO',
      title: 'Preventative Health Reminder: Annual Diabetic Retinopathy Exam',
      message: 'Type 2 Diabetes Mellitus diagnosed without recorded fundoscopic examination in the last 12 months.',
      recommendation: 'Order referral to Ophthalmology for dilated eye screening.',
      sourceGuideline: 'National Non-Communicable Disease (NCD) Strategic Protocol'
    }
  ];

  // 8 Core Pillars according to IOM EHR Anatomy
  const pillars = [
    {
      id: 1,
      title: 'Health Information & Data',
      shortTitle: 'Health Data & Vitals',
      subtitle: 'Computable discrete records, problems, vitals & allergies',
      icon: Activity,
      tag: 'Discrete Data',
      accentColor: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      status: 'Synced'
    },
    {
      id: 2,
      title: 'Result Management',
      shortTitle: 'Results & 1.5T MRI',
      subtitle: 'Rapid, non-redundant access to laboratory and MRI PACS imaging',
      icon: FlaskConical,
      tag: 'MRI & Labs',
      accentColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      status: 'PACS Live'
    },
    {
      id: 3,
      title: 'Order Management',
      shortTitle: 'CPOE Order Entry',
      subtitle: 'Error reduction via Computerized Physician Order Entry',
      icon: ClipboardList,
      tag: 'CPOE Engine',
      accentColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      status: 'Signed'
    },
    {
      id: 4,
      title: 'Decision Support',
      shortTitle: 'CDSS Active Alerts',
      subtitle: 'Duplicate test prevention, interaction safety & clinical guidelines',
      icon: BellRing,
      tag: 'CDSS Alerts',
      accentColor: 'text-amber-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      status: '3 Alerts'
    },
    {
      id: 5,
      title: 'Electronic Communication',
      shortTitle: 'HIE & HL7 FHIR',
      subtitle: 'Inter-hospital data sharing between DMCH, CMCH & BSMMU',
      icon: Share2,
      tag: 'Interoperable',
      accentColor: 'text-purple-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      status: 'HIE Active'
    },
    {
      id: 6,
      title: 'Patient Support',
      shortTitle: 'Telemonitoring',
      subtitle: 'Home glucose/BP logging & bilingual education guidelines',
      icon: HeartHandshake,
      tag: 'Home Care',
      accentColor: 'text-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      status: 'Tracked'
    },
    {
      id: 7,
      title: 'Administrative Processes',
      shortTitle: 'Scheduling & Claims',
      subtitle: 'Eligibility checks, automated billing & out-of-pocket savings',
      icon: CreditCard,
      tag: 'Claims & Card',
      accentColor: 'text-teal-600',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      status: 'Eligible'
    },
    {
      id: 8,
      title: 'Reporting & Population Health',
      shortTitle: 'Biosurveillance',
      subtitle: 'National disease radar & automated SDG-3 quality indicators',
      icon: LineChart,
      tag: 'Public Health',
      accentColor: 'text-cyan-600',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      status: 'Reporting'
    }
  ];

  const selectedPillar = pillars.find(p => p.id === selectedPillarId) || pillars[0];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP NATIONAL EHR EXECUTIVE METRIC BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1: Facilities Connected */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Connected Facilities
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{hospitals.length || 3} Tertiary</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">HIE Synced</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">DMCH • CMCH • BSMMU</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* KPI 2: Cost Saved via Non-Redundant Tests */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              CDSS Redundancy Savings
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">৳8,500</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> Saved
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Prevented repeat MRI & HbA1c</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* KPI 3: Diagnostic Imaging (PACS) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              1.5T Brain MRI Study
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">16 Slices</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">PACS Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Conducted at DMCH-01</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Scan className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* KPI 4: Interoperability Standard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              FHIR R4 Bundle
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">9 Resources</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Standard R4</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Patient, Condition, DiagnosticReport</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <FileCode2 className="w-5 h-5 text-purple-600" />
          </div>
        </div>

      </div>

      {/* 2. MAIN COCKPIT WORKSPACE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Workspace Sub-header with Patient Context & View Mode Switcher */}
        <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {card?.fullName ? card.fullName.substring(0, 2).toUpperCase() : 'RU'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{card?.fullName || 'Rahim Uddin'}</h3>
                <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                  {card?.healthId || 'HID-2026-884219'}
                </span>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
                  Blood: {card?.bloodGroup || 'O+'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                National Longitudinal Electronic Health Record • Cross-Hospital HIE Interconnected
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'cockpit' ? 'diagram' : 'cockpit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                viewMode === 'diagram' 
                  ? 'bg-slate-900 text-white border-slate-800' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{viewMode === 'diagram' ? 'Back to Cockpit' : 'Architecture Blueprint'}</span>
            </button>

            <button
              onClick={onOpenMriViewer}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <Scan className="w-3.5 h-3.5" /> Launch 1.5T MRI PACS
            </button>
          </div>
        </div>

        {/* 3. COCKPIT MODE: LEFT 8-PILLAR NAV RAIL + RIGHT MAIN STAGE */}
        {viewMode === 'cockpit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* LEFT NAV RAIL: 8 IOM Core Pillars */}
            <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/40 p-3 sm:p-4 space-y-1.5">
              <div className="px-2 py-1 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  IOM Core EHR Pillars (8)
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-semibold">
                  100% Centralized
                </span>
              </div>

              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                const isSelected = selectedPillarId === pillar.id;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white text-slate-900 border-2 border-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{pillar.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {pillar.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 pl-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pillar.badgeColor}`}>
                        {pillar.status}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'translate-x-0.5 text-emerald-600' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT MAIN STAGE: Live Interactive Workspace for Selected Pillar */}
            <div className="lg:col-span-8 p-5 sm:p-7 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Pillar Header Badge & Title */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs">
                      {selectedPillar.id}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {selectedPillar.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedPillar.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${selectedPillar.badgeColor}`}>
                    {selectedPillar.tag}
                  </span>
                </div>

                {/* PILLAR CONTENT PANELS */}
                
                {/* Pillar 1: Health Information & Data */}
                {selectedPillarId === 1 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Discrete Problem List */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Computable Problem List (ICD-10)</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">Active</span>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                            <div>
                              <strong className="text-slate-900 block">Type 2 Diabetes Mellitus without complications</strong>
                              <span className="text-slate-400 text-[10px]">Diagnosed during OPD screening</span>
                            </div>
                            <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                              E11.9
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                            <div>
                              <strong className="text-slate-900 block">Essential (Primary) Hypertension</strong>
                              <span className="text-slate-400 text-[10px]">Baseline BP: 145/92 mmHg</span>
                            </div>
                            <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                              I10
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Discrete Vitals & Allergies */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">Discrete Clinical Metrics</span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-400 text-[10px] block">BLOOD PRESSURE</span>
                            <strong className="text-slate-900 text-sm">145/92 mmHg</strong>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-400 text-[10px] block">FASTING GLUCOSE</span>
                            <strong className="text-emerald-700 text-sm">8.9 mmol/L</strong>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-400 text-[10px] block">RESTING PULSE</span>
                            <strong className="text-slate-900 text-sm">78 bpm</strong>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-400 text-[10px] block">BODY MASS INDEX</span>
                            <strong className="text-slate-900 text-sm">25.4 (Normal)</strong>
                          </div>
                        </div>

                        <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span><strong>Known Drug Allergy:</strong> Penicillin / Beta-lactams (Urticaria)</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Pillar 2: Result Management (1.5T MRI PACS & Labs) */}
                {selectedPillarId === 2 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    
                    {/* Primary Highlight: 1.5T MRI Study Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-md">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                              PACS ACC-2026-MR-9041
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                              1.5 Tesla Superconducting
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            Brain MRI with Contrast (16 Axial FLAIR Slices)
                          </h4>
                          <p className="text-slate-300 text-[11px] leading-relaxed max-w-xl">
                            Evaluated at <strong>Dhaka Medical College Hospital (DMCH-01)</strong>. Normal parenchyma, no acute infarction. Certified in National SHR under IOM Non-Redundant Result Management.
                          </p>
                        </div>

                        <button
                          onClick={onOpenMriViewer}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-lg"
                        >
                          <Scan className="w-4 h-4" /> Open Interactive PACS Slices
                        </button>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Reporting Radiologist: <strong className="text-slate-200">Prof. Dr. Anisur Rahman</strong></span>
                        <span className="text-emerald-400 font-semibold">Non-Redundant Record (Saves ৳8,500)</span>
                      </div>
                    </div>

                    {/* Labs Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-900">HbA1c (Glycated Hemoglobin)</strong>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">7.4% High</span>
                        </div>
                        <p className="text-slate-600">Standard normal threshold is &lt; 6.5%. Conducted 5 days ago at DMCH-01.</p>
                        <div className="text-[10px] text-emerald-700 font-semibold">Protected from redundant repeat for 30 days.</div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-900">Serum Creatinine & eGFR</strong>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">88 mL/min (Normal)</span>
                        </div>
                        <p className="text-slate-600">Creatinine: 1.05 mg/dL. Renal clearance verified safe for oral antidiabetic therapy.</p>
                        <div className="text-[10px] text-emerald-700 font-semibold">Pre-requisite verified for contrast imaging.</div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Pillar 3: Order Management (CPOE) */}
                {selectedPillarId === 3 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Computerized Physician Order Entry (CPOE)</span>
                      <button
                        onClick={onOpenDoctorPortal}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        + Create New CPOE Order
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3 text-left">ORDER ID</th>
                            <th className="py-2.5 px-3 text-left">TYPE</th>
                            <th className="py-2.5 px-3 text-left">CLINICAL ITEM</th>
                            <th className="py-2.5 px-3 text-left">PRIORITY</th>
                            <th className="py-2.5 px-3 text-left">CDSS CHECK</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {cpoeOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50">
                              <td className="py-3 px-3 font-mono font-bold text-slate-900">{o.id}</td>
                              <td className="py-3 px-3">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                  {o.category}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-semibold text-slate-900 block">{o.itemName}</span>
                                <span className="text-[10px] text-slate-400">{o.details}</span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-blue-700">
                                  {o.urgency}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Pillar 4: Decision Support (CDSS) */}
                {selectedPillarId === 4 && (
                  <div className="space-y-3 text-xs animate-fadeIn">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                      Active Clinical Decision Support Alerts
                    </span>
                    {cdssAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border space-y-2 ${
                          alert.severity === 'HIGH'
                            ? 'bg-red-50/80 border-red-200 text-red-950'
                            : alert.severity === 'MEDIUM'
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : 'bg-blue-50/80 border-blue-200 text-blue-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${
                              alert.severity === 'HIGH' ? 'text-red-600' : alert.severity === 'MEDIUM' ? 'text-amber-600' : 'text-blue-600'
                            }`} />
                            <h5 className="font-bold text-slate-900 text-xs">{alert.title}</h5>
                          </div>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/80 border font-bold">
                            {alert.type}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px]">{alert.message}</p>
                        <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 text-[11px]">
                          <strong className="text-slate-900">CDSS Recommendation:</strong> {alert.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pillar 5: Electronic Communication & HIE */}
                {selectedPillarId === 5 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-900 text-xs">National Health Information Exchange (HIE) Topology</h4>
                      <p className="text-slate-600 text-[11px]">
                        Participating government hospitals communicate in real-time through the DGHS Shared Health Record (SHR) bus via HL7 FHIR R4 standard.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">ORIGIN FACILITY</span>
                          <strong className="text-slate-900 block text-xs">DMCH-01 (Dhaka)</strong>
                          <span className="text-emerald-700 text-[10px] font-semibold">1.5T MRI & Lab Origin</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border-2 border-emerald-500 text-center space-y-1 shadow-xs">
                          <span className="text-[10px] text-emerald-600 font-bold block">CENTRAL HIE ROUTER</span>
                          <strong className="text-slate-900 block text-xs">DGHS Central SHR</strong>
                          <span className="text-blue-700 text-[10px] font-semibold">Consent & Master Index</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">RECEIVING FACILITY</span>
                          <strong className="text-slate-900 block text-xs">CMCH-02 (Chittagong)</strong>
                          <span className="text-purple-700 text-[10px] font-semibold">Consultation Workstation</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={onOpenFhirPortal}
                          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg font-semibold transition"
                        >
                          <FileCode2 className="w-3.5 h-3.5" /> Inspect HL7 FHIR R4 Feed
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pillar 6: Patient Support */}
                {selectedPillarId === 6 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">Remote Telemonitoring Log</span>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                            <div>
                              <strong className="text-slate-900 block">Morning Fasting Glucose</strong>
                              <span className="text-slate-400 text-[10px]">Home Glucometer Sync • 2 hrs ago</span>
                            </div>
                            <span className="text-sm font-bold text-emerald-700">7.1 mmol/L</span>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                            <div>
                              <strong className="text-slate-900 block">Resting Blood Pressure</strong>
                              <span className="text-slate-400 text-[10px]">Connected Home Cuff • Yesterday</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">138/88 mmHg</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">Bilingual Patient Education</span>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block">ডায়াবেটিস রোগীদের খাদ্যাভ্যাস ও ব্যায়াম</strong>
                          <p className="text-slate-500 text-[11px]">দৈনিক অন্তত ৩০ মিনিট হাঁটা এবং মিষ্টি ও অতিরিক্ত শর্করা জাতীয় খাবার পরিহারের নির্দেশিকা।</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block">রক্তচাপ নিয়ন্ত্রণ ও লবণের ব্যবহার</strong>
                          <p className="text-slate-500 text-[11px]">খাবারের পাতে বাড়তি কাঁচা লবণ বর্জন এবং নিয়মিত প্রেসারের ওষুধ সেবনের পরামর্শ।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pillar 7: Administrative Processes */}
                {selectedPillarId === 7 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">Eligibility & Scheduling</span>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-900">National Health Card Status</strong>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVE</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">Verified through NID backend. Entitled to subsidized healthcare at public medical centers.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">Automated Claims Breakdown</span>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex justify-between text-slate-600">
                            <span>Standard Diagnostic Charges:</span>
                            <span>৳12,000</span>
                          </div>
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Non-Redundant Scan Savings (MRI + Lab):</span>
                            <span>- ৳8,500</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Government DGHS Subsidy:</span>
                            <span>- ৳2,500</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                            <span>Patient Out-of-Pocket Expense:</span>
                            <span>৳1,000 only</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pillar 8: Reporting & Population Health */}
                {selectedPillarId === 8 && (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold block">EPIDEMIC RADAR</span>
                        <strong className="text-lg font-extrabold text-slate-900 block">Dengue & NCD</strong>
                        <span className="text-emerald-700 font-semibold text-[11px]">Dhaka Cluster Active</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold block">DIABETES INCIDENCE</span>
                        <strong className="text-lg font-extrabold text-slate-900 block">10.8%</strong>
                        <span className="text-amber-700 font-semibold text-[11px]">Age 40+ Cohort</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold block">SDG-3 AUDIT SCORE</span>
                        <strong className="text-lg font-extrabold text-slate-900 block">94.2%</strong>
                        <span className="text-emerald-700 font-semibold text-[11px]">Compliance Certified</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Quick Context */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>DGHS Longitudinal Records: {timeline.length} Encounters • {consents.length} Consents • {audits.length} Audits</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={onOpenDoctorPortal}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    Switch to Doctor Workstation <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* 4. ARCHITECTURE BLUEPRINT DIAGRAM VIEW (When user clicks 'Architecture Blueprint') */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">IOM Blueprint Map</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">The Core Anatomy of a Comprehensive EHR</h3>
              <p className="text-xs text-slate-500 mt-1">
                Visual relationship mapping all 8 peripheral functional pillars to the central longitudinal health record repository.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
              {/* Left 4 Pillars */}
              <div className="lg:col-span-5 space-y-3">
                {[pillars[0], pillars[7], pillars[6], pillars[5]].map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => { setSelectedPillarId(p.id); setViewMode('cockpit'); }}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-500 cursor-pointer transition shadow-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">{p.title}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${p.badgeColor}`}>{p.tag}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.subtitle}</p>
                  </div>
                ))}
              </div>

              {/* Center Node */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center my-4 lg:my-0">
                <div className="w-36 h-36 rounded-full bg-slate-900 border-4 border-cyan-500 shadow-xl flex flex-col items-center justify-center text-center p-3">
                  <Network className="w-6 h-6 text-cyan-400 mb-1" />
                  <h4 className="text-xs font-extrabold text-white tracking-wider uppercase leading-tight">
                    Comprehensive<br/>EHR
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-cyan-300 mt-1 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700">
                    Central Hub
                  </span>
                </div>
              </div>

              {/* Right 4 Pillars */}
              <div className="lg:col-span-5 space-y-3">
                {[pillars[1], pillars[2], pillars[3], pillars[4]].map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => { setSelectedPillarId(p.id); setViewMode('cockpit'); }}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-500 cursor-pointer transition shadow-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">{p.title}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${p.badgeColor}`}>{p.tag}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
