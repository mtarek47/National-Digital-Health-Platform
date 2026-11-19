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
  Sparkles, 
  CheckCircle2, 
  FileCode2,
  Stethoscope
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
  const [activePillar, setActivePillar] = useState<number | null>(null);

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
      subtitle: 'Computable, discrete data for evidence-based decisions.',
      icon: Activity,
      tag: 'Discrete Data',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500',
      badgeBg: 'bg-blue-950 text-blue-300 border-blue-700',
      metrics: 'ICD-10 E11.9, I10 • O+ Blood'
    },
    {
      id: 2,
      title: 'Result Management',
      subtitle: 'Rapid, non-redundant access to labs and imaging (MRI/CT).',
      icon: FlaskConical,
      tag: 'Labs & MRI Scan',
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-500',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      metrics: '1.5T Brain MRI • HbA1c 7.4%'
    },
    {
      id: 3,
      title: 'Order Management',
      subtitle: 'Error reduction via Computerized Physician Order Entry (CPOE).',
      icon: ClipboardList,
      tag: 'CPOE Engine',
      color: 'from-indigo-600 to-violet-600',
      borderColor: 'border-indigo-500',
      badgeBg: 'bg-indigo-950 text-indigo-300 border-indigo-700',
      metrics: '3 CPOE Orders • E-Signature'
    },
    {
      id: 4,
      title: 'Decision Support',
      subtitle: 'Active alerts, duplicate protection, and clinical reminders.',
      icon: BellRing,
      tag: 'CDSS Alerts',
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-500',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-700',
      metrics: '3 Active Alerts • Zero Redundancy'
    },
    {
      id: 5,
      title: 'Electronic Communication',
      subtitle: 'Secure messaging, portals, and health information exchange (HIE).',
      icon: Share2,
      tag: 'HIE & HL7 FHIR',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-700',
      metrics: 'DMCH ⇄ CMCH ⇄ BSMMU'
    },
    {
      id: 6,
      title: 'Patient Support',
      subtitle: 'Telemonitoring and integrated bilingual patient education.',
      icon: HeartHandshake,
      tag: 'Telemonitoring',
      color: 'from-rose-600 to-red-600',
      borderColor: 'border-rose-500',
      badgeBg: 'bg-rose-950 text-rose-300 border-rose-700',
      metrics: 'BP 145/92 • Diabetes Guide'
    },
    {
      id: 7,
      title: 'Administrative Processes',
      subtitle: 'Scheduling, eligibility, and automated claims.',
      icon: CreditCard,
      tag: 'Claims & Eligibility',
      color: 'from-emerald-700 to-teal-800',
      borderColor: 'border-emerald-600',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      metrics: 'Health Card Active • Auto-Claim'
    },
    {
      id: 8,
      title: 'Reporting & Population Health',
      subtitle: 'Biosurveillance and automated national quality reporting.',
      icon: LineChart,
      tag: 'Biosurveillance',
      color: 'from-cyan-700 to-blue-800',
      borderColor: 'border-cyan-600',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-700',
      metrics: 'DGHS Radar • Dengue/NCD'
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Hero Central Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" /> Institute of Medicine (IOM) Standard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              The Core Anatomy of a Comprehensive EHR
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              All 8 core functional components are <strong>fully centralized</strong> in this platform: from discrete computable health data and interactive <strong>1.5T MRI PACS</strong> imaging to <strong>CPOE</strong> order entry, <strong>CDSS</strong> clinical safety alerts, <strong>HIE</strong> cross-hospital sharing, and <strong>HL7 FHIR R4</strong> interoperability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenMriViewer}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950 text-xs sm:text-sm"
            >
              <Scan className="w-4 h-4" /> Open 1.5T Brain MRI Viewer
            </button>
            <button
              onClick={onOpenDoctorPortal}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition text-xs sm:text-sm"
            >
              <Stethoscope className="w-4 h-4" /> Doctor CPOE & CDSS
            </button>
          </div>
        </div>

        {/* Live Patient Context strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Central Longitudinal Record:</span>
            <strong className="text-white font-mono bg-white/10 px-2.5 py-1 rounded">
              {card?.fullName || 'Rahim Uddin'} ({card?.healthId || 'HID-2026-884219'})
            </strong>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Blood: <strong className="text-white">{card?.bloodGroup || 'O+'}</strong></span>
            <span>Encounters: <strong className="text-white">{timeline.length}</strong></span>
            <span>Consents: <strong className="text-white">{consents.length}</strong></span>
            <span>Audits: <strong className="text-white">{audits.length}</strong></span>
            <span>Hospitals: <strong className="text-white">{hospitals.length || 3}</strong></span>
            <span>HIE Status: <strong className="text-emerald-400">Interconnected</strong></span>
          </div>
        </div>
      </div>

      {/* CENTRAL VISUAL DIAGRAM - The Core Anatomy of an EHR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Centralized System Architecture</span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">Interactive 8-Pillar EHR Architecture Map</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click on any pillar below to inspect its live data, clinical decision support rules, CPOE orders, and diagnostic imaging.
          </p>
        </div>

        {/* Central Core & Radiating Cards (Exact layout from IOM Anatomy Diagram) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: 4 Pillars */}
          <div className="lg:col-span-5 space-y-4">
            {[
              pillars.find(p => p.id === 1)!,
              pillars.find(p => p.id === 8)!,
              pillars.find(p => p.id === 7)!,
              pillars.find(p => p.id === 6)!
            ].map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activePillar === pillar.id;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
                  className={`bg-slate-50 hover:bg-white rounded-xl p-4 border transition-all cursor-pointer relative group ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillar.badgeBg}`}>
                      {pillar.tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2.5 group-hover:text-emerald-700 transition">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {pillar.subtitle}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-600 font-medium truncate max-w-[200px]">
                      {pillar.metrics}
                    </span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                      {isSelected ? 'Viewing' : 'Details'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Column: Central Comprehensive EHR Node (Static, Clean, No overlap, No loading animation) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="relative flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 border-4 border-cyan-500 shadow-2xl flex flex-col items-center justify-center text-center p-3 z-10 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-1.5 border border-cyan-400/40">
                  <Network className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-extrabold text-white tracking-wider uppercase leading-tight">
                  Comprehensive<br/>EHR
                </h4>
                <span className="text-[9px] font-mono font-bold text-cyan-300 mt-1.5 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700">
                  Central Hub
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-3 text-center hidden lg:block">
                Connecting 8 IOM Pillars
              </span>
            </div>
          </div>

          {/* Right Column: 4 Pillars */}
          <div className="lg:col-span-5 space-y-4">
            {[
              pillars.find(p => p.id === 2)!,
              pillars.find(p => p.id === 3)!,
              pillars.find(p => p.id === 4)!,
              pillars.find(p => p.id === 5)!
            ].map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activePillar === pillar.id;

              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
                  className={`bg-slate-50 hover:bg-white rounded-xl p-4 border transition-all cursor-pointer relative group ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillar.badgeBg}`}>
                      {pillar.tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2.5 group-hover:text-emerald-700 transition">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {pillar.subtitle}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-600 font-medium truncate max-w-[200px]">
                      {pillar.metrics}
                    </span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                      {isSelected ? 'Viewing' : 'Details'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* SELECTED PILLAR DEEP-DIVE MODAL / DRAWER */}
      {activePillar !== null && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                {activePillar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {pillars.find(p => p.id === activePillar)?.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {pillars.find(p => p.id === activePillar)?.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePillar(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Close Detail
            </button>
          </div>

          {/* Pillar 1: Health Information & Data */}
          {activePillar === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block">Computable Problem List</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Type 2 Diabetes Mellitus</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">ICD-10 E11.9</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Essential Hypertension</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">ICD-10 I10</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block">Discrete Vitals Baseline</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">BLOOD PRESSURE</span>
                      <strong className="text-slate-800 text-sm">145/92 mmHg</strong>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">PULSE</span>
                      <strong className="text-slate-800 text-sm">78 bpm</strong>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">FASTING GLUCOSE</span>
                      <strong className="text-emerald-700 text-sm">8.9 mmol/L</strong>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">BMI</span>
                      <strong className="text-slate-800 text-sm">25.4 (Normal)</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block">Allergies & Demographics</span>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
                      <span className="font-semibold block">⚠️ Known Drug Allergy:</span>
                      <span>Penicillin / Beta-lactams (Urticaria/Rash)</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-600">
                      <span>Blood Group: <strong className="text-slate-900">O+ (Rh Positive)</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pillar 2: Result Management (MRI & Labs) */}
          {activePillar === 2 && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Scan className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">Non-Redundant Diagnostic Imaging: 1.5T Brain MRI</h4>
                    <p className="text-xs text-emerald-800">
                      Conducted at Dhaka Medical College Hospital (DMCH) 5 days ago. Full DICOM dataset available immediately for doctors at Chittagong Medical College Hospital (CMCH).
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenMriViewer}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shrink-0 transition shadow-sm"
                >
                  Launch PACS Viewer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Laboratory: HbA1c Glycated Hemoglobin</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Moderately Elevated</span>
                  </div>
                  <p className="text-slate-600">Result: <strong>7.4%</strong> (Ref: &lt; 6.5% normal). Evaluated by DMCH Pathology.</p>
                  <p className="text-slate-500 text-[11px]">Protected under 30-day CDSS duplicate prevention window.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Laboratory: Serum Creatinine & eGFR</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Normal Baseline</span>
                  </div>
                  <p className="text-slate-600">Result: <strong>1.05 mg/dL</strong> (eGFR: 88 mL/min/1.73m²). Evaluated by DMCH Pathology.</p>
                  <p className="text-slate-500 text-[11px]">Renal clearance safe for oral antidiabetic therapy.</p>
                </div>
              </div>
            </div>
          )}

          {/* Pillar 3: Order Management (CPOE) */}
          {activePillar === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Computerized Physician Order Entry (CPOE) Audit Log</h4>
                <button
                  onClick={onOpenDoctorPortal}
                  className="text-xs bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-500 transition"
                >
                  + Create New CPOE Order
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 text-left">ORDER ID</th>
                      <th className="py-2.5 px-4 text-left">CATEGORY</th>
                      <th className="py-2.5 px-4 text-left">ITEM & DOSAGE</th>
                      <th className="py-2.5 px-4 text-left">URGENCY</th>
                      <th className="py-2.5 px-4 text-left">ORDERED BY</th>
                      <th className="py-2.5 px-4 text-left">CDSS CHECK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {cpoeOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {order.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{order.itemName}</span>
                          <span className="text-[11px] text-slate-500">{order.details}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {order.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{order.orderedBy}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
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
          {activePillar === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Clinical Alerts & Reminders</span>
                <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                  {cdssAlerts.length} Active System Alerts
                </span>
              </div>

              <div className="space-y-3">
                {cdssAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      alert.severity === 'HIGH' 
                        ? 'bg-red-50/70 border-red-200 text-red-950' 
                        : alert.severity === 'MEDIUM'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-blue-50/70 border-blue-200 text-blue-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          alert.severity === 'HIGH' ? 'text-red-600' : alert.severity === 'MEDIUM' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                        <h5 className="font-bold text-slate-900">{alert.title}</h5>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/80 border border-slate-200 font-bold">
                        {alert.type}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{alert.message}</p>
                    
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900">Recommended Action:</strong> {alert.recommendation}
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      Guideline Ref: {alert.sourceGuideline}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pillar 5: Electronic Communication & HIE */}
          {activePillar === 5 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800">Health Information Exchange (HIE) Topology</h4>
                <p className="text-slate-600">
                  National interoperability connects participating facilities through HL7 FHIR R4 standard endpoints. When Rahim Uddin presents at Chittagong Medical College Hospital, records from Dhaka Medical College Hospital are retrieved in real-time.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">NODE A</span>
                    <strong className="text-slate-900 block text-xs">DMCH (Hospital A)</strong>
                    <span className="text-emerald-600 text-[10px] font-semibold">Origin of MRI & Encounter</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">CENTRAL HIE</span>
                    <strong className="text-slate-900 block text-xs">DGHS Central SHR</strong>
                    <span className="text-blue-600 text-[10px] font-semibold">Master Patient Index & Consent</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">NODE B</span>
                    <strong className="text-slate-900 block text-xs">CMCH (Hospital B)</strong>
                    <span className="text-purple-600 text-[10px] font-semibold">Receiving OPD Workstation</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onOpenFhirPortal}
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-1.5 rounded-lg font-semibold hover:bg-blue-500 transition shadow-xs"
                  >
                    <FileCode2 className="w-3.5 h-3.5" /> Inspect HL7 FHIR R4 Bundle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pillar 6: Patient Support */}
          {activePillar === 6 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block">Telemonitoring & Remote Vitals Log</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-800 block">Morning Fasting Blood Glucose</span>
                        <span className="text-slate-400 text-[10px]">Connected Glucometer • 2 hrs ago</span>
                      </div>
                      <span className="font-bold text-emerald-700 text-sm">7.1 mmol/L</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2.5 rounded border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-800 block">Resting Blood Pressure</span>
                        <span className="text-slate-400 text-[10px]">Home BP Cuff • Yesterday</span>
                      </div>
                      <span className="font-bold text-slate-800 text-sm">138/88 mmHg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block">Integrated Bilingual Patient Education</span>
                  <div className="space-y-2">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="font-semibold text-slate-900 block">ডায়াবেটিস রোগীদের খাদ্যাভ্যাস ও ব্যায়াম</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">দৈনিক অন্তত ৩০ মিনিট হাঁটা এবং মিষ্টি ও পরিশোধিত কার্বোহাইড্রেট পরিহারের নির্দেশিকা।</p>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="font-semibold text-slate-900 block">উচ্চ রক্তচাপ ও লবণের ব্যবহার নিয়ন্ত্রণ</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">পাতে বাড়তি লবণ বর্জন এবং নিয়মিত প্রেসারের ওষুধ সেবনের গুরুত্ব।</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pillar 7: Administrative Processes */}
          {activePillar === 7 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block">Centralized Scheduling & Eligibility</span>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900">National Health Card Status</strong>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">ELIGIBLE</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">Valid for OPD consultation across all government medical colleges and upazila health complexes.</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                        <strong className="text-slate-900 block">Next Follow-up Appointment</strong>
                        <span className="text-slate-500 text-[11px]">CMCH OPD Room 204 • In 25 days</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-bold text-[11px]">CONFIRMED</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block">Automated Health Claim Simulation</span>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Standard Diagnostic Cost:</span>
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
          {activePillar === 8 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Biosurveillance Radar</span>
                  <strong className="text-xl font-extrabold text-slate-900 block">Dengue & NCD</strong>
                  <span className="text-emerald-700 font-semibold text-[11px]">Dhaka & Chittagong Cluster</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">Diabetes Mellitus Prevalence</span>
                  <strong className="text-xl font-extrabold text-slate-900 block">10.8%</strong>
                  <span className="text-amber-700 font-semibold text-[11px]">National Age 40+ Cohort</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase block">SDG-3 Quality Reporting</span>
                  <strong className="text-xl font-extrabold text-slate-900 block">94.2%</strong>
                  <span className="text-emerald-700 font-semibold text-[11px]">Audit Compliance Score</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Quick Summary Grid of All 8 Core Pillars */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              Centralized Healthcare Ecosystem (IOM Alignment)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Standard Institute of Medicine 8-pillar checklist implemented across Bangladesh DGHS National Platform.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              8 of 8 Pillars Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.id}
                onClick={() => setActivePillar(p.id)}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Pillar 0{p.id}</span>
                </div>
                <h5 className="font-bold text-white group-hover:text-emerald-400 transition">{p.title}</h5>
                <p className="text-slate-400 text-[11px] leading-snug line-clamp-2">{p.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
