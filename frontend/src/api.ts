import axios from 'axios';
import type {
  DigitalHealthCard,
  MedicalTimelineItem,
  Hospital,
  Doctor,
  ConsentRecord,
  DuplicateCheckResponse,
  AccessLog
} from './types';

const API_BASE = '/api';

export const api = {
  // Facilities
  getHospitals: async (): Promise<Hospital[]> => {
    const res = await axios.get(`${API_BASE}/facilities/hospitals`);
    return res.data.data;
  },
  getDoctorsByHospital: async (hospitalId: string): Promise<Doctor[]> => {
    const res = await axios.get(`${API_BASE}/facilities/hospitals/${hospitalId}/doctors`);
    return res.data.data;
  },
  getAllDoctors: async (): Promise<Doctor[]> => {
    const res = await axios.get(`${API_BASE}/facilities/doctors`);
    return res.data.data;
  },

  // Patients & Health Cards
  getCardByHealthId: async (healthId: string): Promise<DigitalHealthCard> => {
    const res = await axios.get(`${API_BASE}/patients/card/by-health-id/${encodeURIComponent(healthId)}`);
    return res.data.data;
  },
  getCardByToken: async (token: string): Promise<DigitalHealthCard> => {
    const res = await axios.get(`${API_BASE}/patients/card/by-token/${encodeURIComponent(token)}`);
    return res.data.data;
  },
  registerPatient: async (data: any): Promise<DigitalHealthCard> => {
    const res = await axios.post(`${API_BASE}/patients/register`, data);
    return res.data.data;
  },

  // Clinical Records & Timeline
  getTimeline: async (patientId: string, hospitalId?: string, actorName?: string): Promise<MedicalTimelineItem[]> => {
    const params = new URLSearchParams();
    if (hospitalId) params.append('requestingHospitalId', hospitalId);
    if (actorName) params.append('actorName', actorName);
    const res = await axios.get(`${API_BASE}/clinical/timeline/${patientId}?${params.toString()}`);
    return res.data.data;
  },
  createEncounter: async (data: any): Promise<MedicalTimelineItem> => {
    const res = await axios.post(`${API_BASE}/clinical/encounters`, data);
    return res.data.data;
  },

  // Decision Support: Duplicate Test Check
  checkDuplicateTest: async (patientId: string, testCode: string): Promise<DuplicateCheckResponse> => {
    const res = await axios.get(`${API_BASE}/decision-support/check-duplicate-test?patientId=${patientId}&testCode=${testCode}`);
    return res.data.data;
  },

  // Consent & Access Control
  checkConsent: async (patientId: string, hospitalId: string): Promise<boolean> => {
    const res = await axios.get(`${API_BASE}/consents/check?patientId=${patientId}&hospitalId=${hospitalId}`);
    return res.data.data.hasConsent;
  },
  grantConsent: async (data: { patientId: string; hospitalId?: string; durationHours?: number; purpose?: string }): Promise<ConsentRecord> => {
    const res = await axios.post(`${API_BASE}/consents/grant`, data);
    return res.data.data;
  },
  breakGlass: async (data: { patientId: string; hospitalId: string; doctorId: string; reason: string }): Promise<ConsentRecord> => {
    const res = await axios.post(`${API_BASE}/consents/break-glass`, data);
    return res.data.data;
  },
  getPatientConsents: async (patientId: string): Promise<ConsentRecord[]> => {
    const res = await axios.get(`${API_BASE}/consents/patient/${patientId}`);
    return res.data.data;
  },

  // Audit Logs
  getRecentAudits: async (): Promise<AccessLog[]> => {
    const res = await axios.get(`${API_BASE}/audits/recent`);
    return res.data.data;
  },
  getPatientAudits: async (patientId: string): Promise<AccessLog[]> => {
    const res = await axios.get(`${API_BASE}/audits/patient/${patientId}`);
    return res.data.data;
  },

  // FHIR R4 Interoperability
  getFhirBundle: async (patientId: string): Promise<any> => {
    const res = await axios.get(`/fhir/r4/Patient/${patientId}/$everything`);
    return res.data;
  }
};
