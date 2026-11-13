import React, { useState, useEffect } from 'react';
import { FileCode2, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { api } from '../api';
import type { DigitalHealthCard } from '../types';

interface FhirViewerProps {
  currentCard: DigitalHealthCard | null;
}

export const FhirViewer: React.FC<FhirViewerProps> = ({ currentCard }) => {
  const [fhirData, setFhirData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadFhirBundle = async () => {
    if (!currentCard) return;
    setLoading(true);
    try {
      const data = await api.getFhirBundle(currentCard.patientId);
      setFhirData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFhirBundle();
  }, [currentCard]);

  const handleCopy = () => {
    if (fhirData) {
      navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentCard) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
        Select a patient first to inspect their HL7 FHIR R4 Bundle.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">HL7 FHIR R4 Interoperability Feed</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              Standard R4 Document Bundle
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized healthcare resource representation complying with Bangladesh DGHS Shared Health Record (SHR) & Master Client Index (MCI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadFhirBundle}
            disabled={loading}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            title="Refresh FHIR Resource"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied JSON' : 'Copy FHIR JSON'}
          </button>
          <a
            href={`/fhir/r4/Patient/${currentCard.patientId}/$everything`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition border border-emerald-200"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Direct Endpoint
          </a>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Generating FHIR R4 Bundle from clinical repository...</div>
      ) : fhirData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bundle Type</span>
              <span className="font-mono font-bold text-slate-800">{fhirData.type || 'document'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Resources</span>
              <span className="font-mono font-bold text-emerald-700">{fhirData.total || (fhirData.entry ? fhirData.entry.length : 0)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Schema Version</span>
              <span className="font-mono font-bold text-slate-800">HL7 FHIR R4</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Health ID Target</span>
              <span className="font-mono font-bold text-slate-800">{currentCard.healthId}</span>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-slate-900 text-emerald-300 font-mono text-xs p-5 rounded-2xl overflow-x-auto max-h-[500px] leading-relaxed shadow-inner">
              {JSON.stringify(fhirData, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-sm">No FHIR resources available.</div>
      )}
    </div>
  );
};
