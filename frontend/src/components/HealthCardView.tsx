import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Calendar, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle,
  Activity,
  Lock,
  Plus
} from 'lucide-react';
import type { DigitalHealthCard, MedicalTimelineItem, ConsentRecord, AccessLog } from '../types';

interface HealthCardViewProps {
  card: DigitalHealthCard | null;
  timeline: MedicalTimelineItem[];
  consents: ConsentRecord[];
  audits: AccessLog[];
  onOpenRegisterModal: () => void;
  onGrantConsent: (durationHours: number) => void;
}

export const HealthCardView: React.FC<HealthCardViewProps> = ({
  card,
  timeline,
  consents,
  audits,
  onOpenRegisterModal,
  onGrantConsent,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'timeline' | 'consents' | 'audits'>('card');
  const [consentDuration, setConsentDuration] = useState(4);

  const handleCopyHealthId = () => {
    if (card) {
      navigator.clipboard.writeText(card.healthId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!card) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">No Patient Selected</h3>
        <p className="text-slate-500 mt-1 mb-6 text-sm">Please register a new patient or load the demo patient record.</p>
        <button
          onClick={onOpenRegisterModal}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Register New Patient
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-nav tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('card')}
          className={`py-3.5 px-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'card'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Digital Health Card
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3.5 px-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" /> Medical History & Records ({timeline.length})
        </button>
        <button
          onClick={() => setActiveTab('consents')}
          className={`py-3.5 px-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'consents'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" /> Consent Grants ({consents.length})
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`py-3.5 px-4 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'audits'
              ? 'border-emerald-600 text-emerald-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> Access Audit Trail ({audits.length})
        </button>
      </div>

      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Physical / Digital Smart Card UI */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-md bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-600/30 relative overflow-hidden">
              {/* Background watermark badge */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute right-4 top-4 text-emerald-400/20 font-bold text-6xl select-none pointer-events-none">
                BD
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shadow-md text-xs border border-red-400">
                    BD
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Government of the People's Republic of Bangladesh</h4>
                    <p className="text-sm font-bold text-white tracking-wide">National Digital Health Card</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {card.status}
                </div>
              </div>

              {/* Card Body */}
              <div className="mt-5 grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 space-y-3">
                  <div>
                    <p className="text-[10px] text-emerald-300 uppercase font-semibold">Patient Name</p>
                    <h3 className="text-lg font-bold text-white tracking-wide">{card.fullName}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">National Health ID</p>
                      <p className="font-mono font-bold text-emerald-100 text-sm tracking-wider">{card.healthId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">Blood Group</p>
                      <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md bg-red-600/80 text-white font-bold text-xs">
                        {card.bloodGroup || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-emerald-100">
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">DOB</p>
                      <p className="font-medium">{card.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 uppercase">NID Masked</p>
                      <p className="font-mono">{card.nidMasked || '***-***-5421'}</p>
                    </div>
                  </div>
                </div>

                {/* Scannable High-Contrast QR Code */}
                <div className="flex flex-col items-center justify-center bg-white p-2.5 rounded-2xl shadow-lg border border-emerald-400/40">
                  <QRCodeSVG 
                    value={card.cardToken} 
                    size={110} 
                    level="H" 
                    includeMargin={false}
                  />
                  <p className="text-[9px] text-slate-500 font-mono mt-1 font-semibold text-center">Secure Token</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-[11px] text-emerald-200/80">
                <span>Emergency: {card.emergencyContact || '16263 (DGHS Helpline)'}</span>
                <span className="font-mono text-emerald-300/80">DGHS SHR Protocol R4</span>
              </div>
            </div>

            {/* Quick Actions Under Card */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleCopyHealthId}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Health ID' : 'Copy Health ID'}
              </button>
              <button
                onClick={onOpenRegisterModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" /> Register Another Patient
              </button>
            </div>
          </div>

          {/* Patient Consent & Authorization Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Patient Consent Management</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              As per national privacy guidelines, doctors and hospitals cannot view your longitudinal EHR without your active, time-limited permission.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                <span>Select Access Duration:</span>
                <span className="font-bold text-emerald-700">{consentDuration} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={consentDuration}
                onChange={(e) => setConsentDuration(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 hr (Emergency OPD)</span>
                <span>4 hrs (Default Consultation)</span>
                <span>24 hrs (Inpatient)</span>
              </div>
            </div>

            <button
              onClick={() => onGrantConsent(consentDuration)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Grant Temporary Record Access
            </button>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p>• Scanned QR tokens expire automatically after consultation.</p>
              <p>• Access is logged to the national tamper-evident audit ledger.</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Longitudinal Medical History</h3>
              <p className="text-xs text-slate-500">Chronological clinical encounters, diagnoses, medications, and lab reports across all participating hospitals.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              {timeline.length} Encounters Recorded
            </span>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
            {timeline.map((enc, idx) => (
              <div key={enc.encounterId || idx} className="relative pl-12">
                <div className="absolute left-3 -translate-x-1/2 top-1.5 w-5 h-5 rounded-full bg-emerald-600 border-4 border-white shadow-xs" />
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                  {/* Encounter Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                          {enc.encounterType}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">{enc.hospitalName}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Attending Clinician: {enc.doctorName} ({enc.doctorSpecialty})</p>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(enc.visitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Chief Complaint & Notes */}
                  {enc.chiefComplaint && (
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700">Chief Complaint: </span>
                      <span className="text-slate-600">{enc.chiefComplaint}</span>
                    </div>
                  )}

                  {/* Conditions / Diagnoses */}
                  {enc.conditions && enc.conditions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1.5">Diagnoses:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {enc.conditions.map((c, cIdx) => (
                          <span key={c.id || cIdx} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 font-medium">
                            {c.code ? `[${c.code}] ` : ''}{c.description}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prescribed Medications */}
                  {enc.medications && enc.medications.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1.5">Prescribed Medications:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {enc.medications.map((m, mIdx) => (
                          <div key={m.id || mIdx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                            <p className="font-bold text-slate-800">{m.medicationName} {m.dosage}</p>
                            <p className="text-slate-500 mt-0.5">Dosage: {m.frequency} • Duration: {m.duration}</p>
                            {m.instructions && <p className="text-[11px] text-emerald-700 mt-0.5">{m.instructions}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diagnostic Reports */}
                  {enc.diagnosticReports && enc.diagnosticReports.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1.5">Laboratory & Diagnostic Reports:</p>
                      <div className="space-y-2">
                        {enc.diagnosticReports.map((r, rIdx) => (
                          <div key={r.id || rIdx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{r.testName}</span>
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                                  {r.testCode}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1 font-medium">{r.resultSummary}</p>
                              {r.clinicalNotes && <p className="text-slate-400 text-[11px] mt-0.5">{r.clinicalNotes}</p>}
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                              {r.status || 'FINAL'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consents Tab */}
      {activeTab === 'consents' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active & Historical Consent Grants</h3>
          <p className="text-xs text-slate-500">Every authorization granted by you to healthcare providers is tracked and enforceable.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Hospital / Provider</th>
                  <th className="p-3">Scope</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Valid Until</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consents.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-semibold text-slate-800">{c.hospital ? c.hospital.name : 'All Participating Facilities'}</td>
                    <td className="p-3 font-mono">{c.scope}</td>
                    <td className="p-3 text-slate-600">{c.purpose}</td>
                    <td className="p-3 text-slate-500">{new Date(c.validUntil).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Patient Access Audit Trail</h3>
          <p className="text-xs text-slate-500">Tamper-evident logs of who accessed or updated your medical records.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Facility</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {audits.map((a) => (
                  <tr key={a.id}>
                    <td className="p-3 font-mono text-slate-500">{new Date(a.accessedAt).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-slate-800">{a.actorName} ({a.actorType})</td>
                    <td className="p-3 text-slate-700">{a.hospital ? a.hospital.name : 'Central Platform'}</td>
                    <td className="p-3">
                      <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px]">
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
    </div>
  );
};
