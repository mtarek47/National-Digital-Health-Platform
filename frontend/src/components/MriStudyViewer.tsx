import React, { useState } from 'react';
import { 
  Scan, 
  X, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Sliders, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  CheckCircle2
} from 'lucide-react';
import type { MriStudy } from '../types';

interface MriStudyViewerProps {
  study?: MriStudy;
  onClose: () => void;
}

const defaultDemoMriStudy: MriStudy = {
  accessionNumber: 'ACC-2026-MR-9041',
  modality: 'MR',
  studyDescription: 'MRI of Brain & Cranium (1.5T with IV Contrast)',
  bodyPart: 'HEAD / BRAIN',
  fieldStrength: '1.5 Tesla (Superconducting)',
  contrastUsed: true,
  contrastAgent: 'Gadoterate Meglumine (Dotarem) 15ml IV',
  totalSlices: 16,
  sliceThickness: '3.0 mm (Axial FLAIR)',
  performingHospital: 'Dhaka Medical College Hospital (DMCH-01) - Radiology & Imaging Dept',
  radiologistName: 'Prof. Dr. Anisur Rahman (BMDC Reg: A-54912)',
  impression: 'Normal brain parenchyma for chronological age. No evidence of acute intracranial hemorrhage, territorial infarction, or mass lesion. Ventricular size within normal limits. Major cerebral vascular flow voids intact on 3D TOF MRA.',
  findings: [
    'Cerebral Hemispheres: Normal gray-white matter differentiation. No abnormal T2/FLAIR hyperintensity in cortical or subcortical white matter.',
    'Ventricular System: Symmetrical lateral ventricles, third and fourth ventricles normal in caliber and midline in position.',
    'Posterior Fossa: Brainstem, cerebellum, and cerebellopontine angles demonstrate unremarkable morphological appearance.',
    'Contrast Enhancement: No pathological meningeal or parenchymal enhancement observed post-contrast administration.',
    'Paranasal Sinuses: Clear aeration of bilateral maxillary and ethmoidal sinuses; mastoid air cells clear.'
  ],
  recommendation: 'Non-redundant baseline established. Valid for 180 days across all national health facilities under DGHS IOM Result Management protocol.',
  dicomUid: '1.2.840.113619.2.55.3.2831164.20261114.904101'
};

export const MriStudyViewer: React.FC<MriStudyViewerProps> = ({
  study = defaultDemoMriStudy,
  onClose
}) => {
  const [currentSlice, setCurrentSlice] = useState(8);
  const [windowPreset, setWindowPreset] = useState<'brain' | 'subdural' | 'invert'>('brain');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(110);
  const [activeTab, setActiveTab] = useState<'pacs' | 'report' | 'dicom'>('pacs');

  // Simulated slice visual variation based on current slice (1 to 16)
  const ventricleScale = Math.sin((currentSlice / 16) * Math.PI) * 1.2 + 0.3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 font-sans">
        
        {/* Top PACS Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-wide">
                  CENTRAL PACS / DICOM VIEWER
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
                  IOM Result Management Standard
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-700">
                  1.5T MRI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-lg">
                {study.studyDescription} • {study.performingHospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Non-Redundant Record Verified (Saves ৳8,500)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-2 flex items-center justify-between shrink-0 text-xs">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('pacs')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeTab === 'pacs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scan className="w-3.5 h-3.5" /> Interactive PACS Slices
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeTab === 'report' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Radiologist Report & Findings
            </button>
            <button
              onClick={() => setActiveTab('dicom')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeTab === 'dicom' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> DICOM Metadata Header
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden md:block font-mono">
            Accession: {study.accessionNumber}
          </div>
        </div>

        {/* Main Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {activeTab === 'pacs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* MRI Viewport Screen */}
              <div className="lg:col-span-8 bg-black border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[420px] shadow-inner select-none">
                
                {/* On-screen HUD info */}
                <div className="absolute top-3 left-3 text-[11px] font-mono text-emerald-400/90 pointer-events-none space-y-0.5">
                  <div>STUDY: BRAIN 1.5T AXIAL</div>
                  <div>TE: 94ms | TR: 8500ms</div>
                  <div>THK: {study.sliceThickness}</div>
                  <div>CONTRAST: +GADOLINIUM</div>
                </div>

                <div className="absolute top-3 right-3 text-[11px] font-mono text-slate-400 pointer-events-none text-right space-y-0.5">
                  <div className="text-emerald-400 font-bold">SLICE {currentSlice} / {study.totalSlices}</div>
                  <div>ZOOM: {zoomLevel}%</div>
                  <div>W: {windowPreset.toUpperCase()}</div>
                </div>

                <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500 pointer-events-none">
                  PATIENT: Rahim Uddin (HID-2026-884219)
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-500 pointer-events-none">
                  DGHS HIE VERIFIED
                </div>

                {/* Simulated High-Res Axial Brain MRI Canvas / SVG Graphic */}
                <div 
                  className="w-72 h-72 sm:w-80 sm:h-80 transition-all duration-150 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    filter: windowPreset === 'invert' 
                      ? `invert(1) brightness(${brightness * 0.9}%) contrast(${contrast}%)` 
                      : `brightness(${brightness}%) contrast(${contrast}%)`
                  }}
                >
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md">
                    <defs>
                      <radialGradient id="skullBone" cx="50%" cy="50%" r="50%">
                        <stop offset="70%" stopColor="#222" />
                        <stop offset="92%" stopColor="#eee" />
                        <stop offset="100%" stopColor="#333" />
                      </radialGradient>
                      <radialGradient id="brainTissue" cx="50%" cy="45%" r="48%">
                        <stop offset="0%" stopColor="#444" />
                        <stop offset="50%" stopColor="#2a2a2a" />
                        <stop offset="85%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#080808" />
                      </radialGradient>
                    </defs>

                    {/* Outer Skull Contour */}
                    <ellipse cx="150" cy="148" rx="122" ry="136" fill="url(#skullBone)" stroke="#555" strokeWidth="2" />
                    
                    {/* Brain Parenchyma Outline */}
                    <ellipse cx="150" cy="148" rx="114" ry="128" fill="url(#brainTissue)" />

                    {/* Interhemispheric Fissure (Falx Cerebri) */}
                    <line x1="150" y1="28" x2="150" y2="268" stroke="#111" strokeWidth="2.5" />

                    {/* Cortical Sulci & Gyri patterns */}
                    <path d="M 60,110 Q 90,120 70,160 Q 95,190 75,220" fill="none" stroke="#161616" strokeWidth="3" />
                    <path d="M 240,110 Q 210,120 230,160 Q 205,190 225,220" fill="none" stroke="#161616" strokeWidth="3" />
                    <path d="M 80,80 Q 120,95 100,130" fill="none" stroke="#1c1c1c" strokeWidth="2.5" />
                    <path d="M 220,80 Q 180,95 200,130" fill="none" stroke="#1c1c1c" strokeWidth="2.5" />

                    {/* Lateral Ventricles (Dynamic with slice) */}
                    {currentSlice >= 4 && currentSlice <= 14 && (
                      <g fill="#050505" stroke="#10b981" strokeWidth="0.8" opacity="0.85">
                        {/* Anterior horn left */}
                        <path d={`M 144,115 C 130,${120 - ventricleScale * 5} 128,${145 + ventricleScale * 10} 144,155 Z`} />
                        {/* Anterior horn right */}
                        <path d={`M 156,115 C 170,${120 - ventricleScale * 5} 172,${145 + ventricleScale * 10} 156,155 Z`} />
                        {/* Posterior horn left */}
                        <path d={`M 144,165 C 132,175 130,${195 + ventricleScale * 6} 144,205 Z`} />
                        {/* Posterior horn right */}
                        <path d={`M 156,165 C 168,175 170,${195 + ventricleScale * 6} 156,205 Z`} />
                      </g>
                    )}

                    {/* Third ventricle midline slit */}
                    {currentSlice >= 6 && currentSlice <= 11 && (
                      <rect x="148.5" y="152" width="3" height="22" rx="1.5" fill="#000" stroke="#10b981" strokeWidth="0.5" />
                    )}

                    {/* Choroid Plexus calcification / contrast point */}
                    {currentSlice >= 7 && currentSlice <= 10 && (
                      <g fill="#e0f2fe" opacity="0.9">
                        <circle cx="138" cy="180" r="2.5" />
                        <circle cx="162" cy="180" r="2.5" />
                      </g>
                    )}

                    {/* Orientation Markers */}
                    <text x="150" y="20" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">A (Anterior)</text>
                    <text x="150" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">P (Posterior)</text>
                    <text x="15" y="152" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">R</text>
                    <text x="285" y="152" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">L</text>
                  </svg>
                </div>

                {/* Slice Navigation Slider Bar */}
                <div className="w-full mt-4 pt-3 border-t border-slate-900 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">Slice {currentSlice}</span>
                  <input
                    type="range"
                    min="1"
                    max={study.totalSlices}
                    value={currentSlice}
                    onChange={(e) => setCurrentSlice(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{study.totalSlices}</span>
                </div>
              </div>

              {/* PACS Control Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Image Presets & Windows */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Windowing & Presets
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setWindowPreset('brain'); setBrightness(100); setContrast(110); }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                        windowPreset === 'brain' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Brain
                    </button>
                    <button
                      onClick={() => { setWindowPreset('subdural'); setBrightness(120); setContrast(150); }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                        windowPreset === 'subdural' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Subdural
                    </button>
                    <button
                      onClick={() => setWindowPreset(windowPreset === 'invert' ? 'brain' : 'invert')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                        windowPreset === 'invert' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Invert
                    </button>
                  </div>

                  {/* Brightness / Contrast */}
                  <div className="space-y-2 pt-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Brightness: {brightness}%</span>
                      <span>Contrast: {contrast}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setZoomLevel(Math.min(zoomLevel + 15, 160))}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-medium flex items-center justify-center gap-1"
                      >
                        <ZoomIn className="w-3 h-3" /> Zoom +
                      </button>
                      <button 
                        onClick={() => setZoomLevel(Math.max(zoomLevel - 15, 80))}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-medium flex items-center justify-center gap-1"
                      >
                        <ZoomOut className="w-3 h-3" /> Zoom -
                      </button>
                      <button 
                        onClick={() => { setZoomLevel(100); setBrightness(100); setContrast(110); setWindowPreset('brain'); }}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-medium text-slate-400"
                        title="Reset"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Study Key Findings Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Radiologist Impression</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      NORMAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    "{study.impression}"
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Reported by: {study.radiologistName}</span>
                  </div>
                </div>

                {/* Non-redundant Sharing Card */}
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>IOM Result Management Benefit</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-normal">
                    This MRI scan performed at <strong>Hospital A (DMCH)</strong> is immediately accessible at <strong>Hospital B (CMCH)</strong> via the centralized HIE. The patient avoids repeat radiation exposure, contrast injection risk, and saves approximately <strong>৳8,500</strong>.
                  </p>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'report' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{study.studyDescription}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{study.performingHospital}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  FINAL REPORT
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">PATIENT NAME</span>
                  <span className="font-semibold text-white">Rahim Uddin</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">HEALTH ID</span>
                  <span className="font-mono text-emerald-400">HID-2026-884219</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">STUDY DATE</span>
                  <span className="font-semibold text-white">5 Days Ago</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MAGNET</span>
                  <span className="font-semibold text-white">{study.fieldStrength}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Detailed Sectional Findings</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {study.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Impression</h4>
                <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-xl text-emerald-200 text-xs leading-relaxed font-medium">
                  {study.impression}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div>
                  <span>Consultant Radiologist: </span>
                  <strong className="text-slate-200">{study.radiologistName}</strong>
                </div>
                <div className="font-mono text-[11px]">
                  DICOM UID: {study.dicomUid}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dicom' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 max-w-3xl mx-auto">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> DICOM Tag Header (ISO 12052 Standard)
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300 overflow-x-auto">
                <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-500">
                  <span>TAG (HEX)</span>
                  <span>DESCRIPTION</span>
                  <span>VALUE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0008, 0016)</span>
                  <span className="text-slate-400">SOP Class UID</span>
                  <span>1.2.840.10008.5.1.4.1.1.4 (MR Image Storage)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0008, 0050)</span>
                  <span className="text-slate-400">Accession Number</span>
                  <span>{study.accessionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0008, 0060)</span>
                  <span className="text-slate-400">Modality</span>
                  <span className="font-bold text-white">MR (Magnetic Resonance)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0008, 0070)</span>
                  <span className="text-slate-400">Manufacturer</span>
                  <span>SIEMENS Magnetom Avanto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0018, 0087)</span>
                  <span className="text-slate-400">Magnetic Field Strength</span>
                  <span>1.5 Tesla</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0018, 0010)</span>
                  <span className="text-slate-400">Contrast/Bolus Agent</span>
                  <span>{study.contrastAgent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0018, 0050)</span>
                  <span className="text-slate-400">Slice Thickness</span>
                  <span>{study.sliceThickness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0010, 0020)</span>
                  <span className="text-slate-400">Patient ID (Health ID)</span>
                  <span className="text-emerald-300">HID-2026-884219</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">(0020, 000D)</span>
                  <span className="text-slate-400">Study Instance UID</span>
                  <span className="truncate max-w-xs">{study.dicomUid}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to DGHS National Health Data Exchange (HIE)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pacs')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Back to Slices
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
            >
              Done Viewing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
