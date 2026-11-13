import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Stethoscope, 
  QrCode, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FileCheck,
  Lock
} from 'lucide-react';
import type { 
  Hospital, 
  Doctor, 
  DigitalHealthCard, 
  DuplicateCheckResponse 
} from '../types';
import { api } from '../api';

interface DoctorWorkstationProps {
  hospitals: Hospital[];
  currentCard: DigitalHealthCard | null;
  onPatientLoaded: (card: DigitalHealthCard) => void;
  onRefreshTimeline: () => void;
}

export const DoctorWorkstation: React.FC<DoctorWorkstationProps> = ({
  hospitals,
  currentCard,
  onPatientLoaded,
  onRefreshTimeline,
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [searchHealthId, setSearchHealthId] = useState('HID-2026-884219');
  const [searchToken, setSearchToken] = useState('HC-DEMO-RAHIM-2026-X88');
  const [searchMode, setSearchMode] = useState<'id' | 'qr'>('qr');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Consent status
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [checkingConsent, setCheckingConsent] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState('');
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);

  // Encounter form
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [conditions] = useState<{ code: string; description: string }[]>([
    { code: 'E11.9', description: 'Type 2 Diabetes follow-up' }
  ]);
  const [medications, setMedications] = useState<{ medicationName: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([
    { medicationName: 'Tab. Empagliflozin', dosage: '10mg', frequency: '1+0+0', duration: '30 days', instructions: 'Take in morning' }
  ]);
  
  // Test ordering & duplicate test check
  const [selectedTestCode, setSelectedTestCode] = useState('HBA1C');
  const [duplicateAlert, setDuplicateAlert] = useState<DuplicateCheckResponse | null>(null);
  const [submittingEncounter, setSubmittingEncounter] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Pre-select Hospital B (CMCH) by default for cross-hospital demo
  useEffect(() => {
    if (hospitals.length > 0 && !selectedHospitalId) {
      const hospB = hospitals.find(h => h.code.includes('CMCH')) || hospitals[1] || hospitals[0];
      setSelectedHospitalId(hospB.id);
    }
  }, [hospitals]);

  // Load doctors for selected hospital
  useEffect(() => {
    if (selectedHospitalId) {
      api.getDoctorsByHospital(selectedHospitalId).then(docs => {
        setDoctors(docs);
        if (docs.length > 0) setSelectedDoctorId(docs[0].id);
      }).catch(console.error);
    }
  }, [selectedHospitalId]);

  // Check consent when patient or hospital changes
  useEffect(() => {
    if (currentCard && selectedHospitalId) {
      setCheckingConsent(true);
      api.checkConsent(currentCard.patientId, selectedHospitalId)
        .then(active => {
          setHasConsent(active);
          setCheckingConsent(false);
        })
        .catch(() => {
          setHasConsent(false);
          setCheckingConsent(false);
        });
    }
  }, [currentCard, selectedHospitalId]);

  // Check for duplicate test when testCode changes
  useEffect(() => {
    if (currentCard && selectedTestCode) {
      api.checkDuplicateTest(currentCard.patientId, selectedTestCode)
        .then(res => {
          if (res.duplicateDetected) {
            setDuplicateAlert(res);
          } else {
            setDuplicateAlert(null);
          }
        })
        .catch(console.error);
    }
  }, [currentCard, selectedTestCode]);

  const handleSearchPatient = async () => {
    setSearching(true);
    setSearchError(null);
    try {
      let card: DigitalHealthCard;
      if (searchMode === 'id') {
        card = await api.getCardByHealthId(searchHealthId.trim());
      } else {
        card = await api.getCardByToken(searchToken.trim());
      }
      onPatientLoaded(card);
    } catch (e: any) {
      setSearchError('Patient record or card token not found.');
    } finally {
      setSearching(false);
    }
  };

  const handleSimulateConsent = async () => {
    if (!currentCard || !selectedHospitalId) return;
    try {
      await api.grantConsent({
        patientId: currentCard.patientId,
        hospitalId: selectedHospitalId,
        durationHours: 4,
        purpose: 'Outpatient consultation'
      });
      setHasConsent(true);
      onRefreshTimeline();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBreakGlassSubmit = async () => {
    if (!currentCard || !selectedHospitalId || !selectedDoctorId || !breakGlassReason.trim()) return;
    try {
      await api.breakGlass({
        patientId: currentCard.patientId,
        hospitalId: selectedHospitalId,
        doctorId: selectedDoctorId,
        reason: breakGlassReason.trim()
      });
      setShowBreakGlassModal(false);
      setHasConsent(true);
      onRefreshTimeline();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddEncounter = async () => {
    if (!currentCard || !selectedHospitalId || !selectedDoctorId) return;
    setSubmittingEncounter(true);
    try {
      await api.createEncounter({
        patientId: currentCard.patientId,
        hospitalId: selectedHospitalId,
        doctorId: selectedDoctorId,
        encounterType: 'OPD',
        chiefComplaint,
        clinicalNotes,
        conditions: conditions.filter(c => c.description.trim().length > 0),
        medications: medications.filter(m => m.medicationName.trim().length > 0),
        diagnosticReports: selectedTestCode && !duplicateAlert ? [{
          testCode: selectedTestCode,
          testName: selectedTestCode === 'HBA1C' ? 'HbA1c (Glycated Hemoglobin)' : 'Serum Creatinine',
          status: 'ORDERED',
          resultSummary: 'Order sent to laboratory'
        }] : []
      });

      setSubmitSuccess(true);
      onRefreshTimeline();
      setTimeout(() => setSubmitSuccess(false), 3000);
      setChiefComplaint('');
      setClinicalNotes('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingEncounter(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Provider & Facility Selector Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" /> Current Hospital / Facility
          </label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.district})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-emerald-600" /> Attending Clinician
          </label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.fullName} — {d.specialty} (BMDC: {d.bmdcRegNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Lookup Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Patient QR Identification & Health ID Lookup</h3>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setSearchMode('qr')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                searchMode === 'qr' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600'
              }`}
            >
              Scan / Enter QR Token
            </button>
            <button
              onClick={() => setSearchMode('id')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                searchMode === 'id' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600'
              }`}
            >
              Health ID (HID)
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {searchMode === 'qr' ? (
            <input
              type="text"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              placeholder="e.g. HC-DEMO-RAHIM-2026-X88"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <input
              type="text"
              value={searchHealthId}
              onChange={(e) => setSearchHealthId(e.target.value)}
              placeholder="e.g. HID-2026-884219"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          )}
          <button
            onClick={handleSearchPatient}
            disabled={searching}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Search className="w-4 h-4" /> {searching ? 'Searching...' : 'Lookup Patient'}
          </button>
        </div>

        {searchError && (
          <p className="text-xs text-red-600 mt-2 font-medium">{searchError}</p>
        )}
      </div>

      {/* Patient Profile & Consent Banner */}
      {currentCard && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {currentCard.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{currentCard.fullName}</h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    {currentCard.healthId}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded">
                    {currentCard.bloodGroup}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  DOB: {currentCard.dateOfBirth} • Gender: {currentCard.gender} • NID: {currentCard.nidMasked} • Emergency: {currentCard.emergencyContact}
                </p>
              </div>
            </div>

            {/* Consent Status Pill */}
            <div className="flex items-center gap-2">
              {checkingConsent ? (
                <span className="text-xs text-slate-400">Verifying consent...</span>
              ) : hasConsent ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Consent Granted
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                  <Lock className="w-4 h-4 text-amber-600" /> Consent Required
                </div>
              )}
            </div>
          </div>

          {/* If Consent is NOT granted, show Consent Wall / Emergency Break-Glass */}
          {!hasConsent && (
            <div className="p-6 bg-amber-50/70 border-b border-amber-200 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="font-bold text-slate-900 text-base">Record Sharing Access Not Yet Authorized</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  This patient is registered at another hospital (e.g., Hospital A / DMCH). Under Bangladesh DGHS privacy standards, cross-hospital medical history requires either patient consent or clinical emergency break-glass.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleSimulateConsent}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simulate Patient Approving 4-Hour Access
                </button>
                <button
                  onClick={() => setShowBreakGlassModal(true)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" /> Emergency Break-Glass Override
                </button>
              </div>
            </div>
          )}

          {/* Clinical Workstation when consent is active */}
          {hasConsent && (
            <div className="p-6 space-y-6">
              {submitSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> New clinical encounter and prescription successfully recorded to central health platform!
                </div>
              )}

              {/* Consultation Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Chief Complaint
                  </label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="e.g. Follow-up for blood glucose control, slight dizziness"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Clinical Examination / Doctor Notes
                  </label>
                  <input
                    type="text"
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="e.g. BP 130/85 mmHg, Heart sounds normal, glycemic target not met"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Duplicate Test Warning Banner (Clinical Decision Support) */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" /> Order Diagnostic Lab Test
                  </label>
                  <span className="text-[11px] text-slate-500">Live Decision Support Activated</span>
                </div>

                <div className="flex gap-3">
                  <select
                    value={selectedTestCode}
                    onChange={(e) => setSelectedTestCode(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Select Lab Test to Order --</option>
                    <option value="HBA1C">HbA1c (Glycated Hemoglobin)</option>
                    <option value="SERUM_CREATININE">Serum Creatinine & eGFR</option>
                    <option value="CBC">Complete Blood Count (CBC)</option>
                    <option value="LIPID_PROFILE">Lipid Profile</option>
                    <option value="CHEST_XRAY">Chest X-Ray P/A View</option>
                  </select>
                </div>

                {/* The Clinical Decision Alert */}
                {duplicateAlert && duplicateAlert.duplicateDetected && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-start gap-3 animate-fade-in shadow-xs">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-2">
                        Potential Duplicate Test Detected!
                        <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold">
                          {duplicateAlert.daysAgo} Days Ago
                        </span>
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        {duplicateAlert.warningMessage}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-amber-900">
                        <button
                          onClick={() => setSelectedTestCode('')}
                          className="underline hover:text-amber-950"
                        >
                          Cancel Duplicate Order (Save Patient Cost)
                        </button>
                        <span>•</span>
                        <span className="text-slate-500">Or continue if clinically indicated</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prescriptions Section */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prescribed Medication (Rx)
                  </label>
                  <button
                    onClick={() => setMedications([...medications, { medicationName: '', dosage: '', frequency: '1+0+1', duration: '30 days', instructions: 'Take after meals' }])}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {medications.map((m, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 bg-white p-3 rounded-xl border border-slate-200 items-center">
                      <input
                        type="text"
                        placeholder="Drug name (e.g. Tab. Empagliflozin)"
                        value={m.medicationName}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[idx].medicationName = e.target.value;
                          setMedications(updated);
                        }}
                        className="col-span-4 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Dose (10mg)"
                        value={m.dosage}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[idx].dosage = e.target.value;
                          setMedications(updated);
                        }}
                        className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (1+0+1)"
                        value={m.frequency}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[idx].frequency = e.target.value;
                          setMedications(updated);
                        }}
                        className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration (30 days)"
                        value={m.duration}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[idx].duration = e.target.value;
                          setMedications(updated);
                        }}
                        className="col-span-3 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <button
                        onClick={() => setMedications(medications.filter((_, i) => i !== idx))}
                        className="col-span-1 text-slate-400 hover:text-red-600 flex justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Encounter */}
              <div className="flex justify-end">
                <button
                  onClick={handleAddEncounter}
                  disabled={submittingEncounter}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submittingEncounter ? 'Saving Record...' : 'Complete Consultation & Sync Record'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Break-Glass Emergency Access Modal */}
      {showBreakGlassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-base">Break-Glass Emergency Access Override</h3>
                <p className="text-xs text-red-700">Strictly regulated exception under National Digital Health Policy</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Break-Glass bypasses patient consent for critical, life-threatening medical emergencies. Every access is logged permanently with your BMDC registration number and is subject to clinical governance review.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mandatory Clinical Justification:
              </label>
              <textarea
                rows={3}
                value={breakGlassReason}
                onChange={(e) => setBreakGlassReason(e.target.value)}
                placeholder="e.g. Unconscious patient brought to Emergency with severe trauma, no attendant available. Immediate medical history required."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBreakGlassModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBreakGlassSubmit}
                disabled={!breakGlassReason.trim()}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                Authorize Emergency Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
