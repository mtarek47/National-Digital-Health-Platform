export interface DigitalHealthCard {
  patientId: string;
  healthId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nidMasked: string;
  emergencyContact: string;
  cardToken: string;
  qrCodeContent: string;
  status: string;
}

export interface Condition {
  id?: string;
  code?: string;
  description: string;
  clinicalStatus?: string;
  notes?: string;
}

export interface Medication {
  id?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface DiagnosticReport {
  id?: string;
  testCode: string;
  testName: string;
  status?: string;
  issuedDate?: string;
  resultSummary: string;
  fileUrl?: string;
  clinicalNotes?: string;
}

export interface MedicalTimelineItem {
  encounterId: string;
  visitDate: string;
  encounterType: string;
  hospitalCode: string;
  hospitalName: string;
  hospitalDistrict: string;
  doctorName: string;
  doctorSpecialty: string;
  chiefComplaint: string;
  clinicalNotes: string;
  conditions: Condition[];
  medications: Medication[];
  diagnosticReports: DiagnosticReport[];
}

export interface Hospital {
  id: string;
  code: string;
  name: string;
  facilityType: string;
  district: string;
}

export interface Doctor {
  id: string;
  hospital?: Hospital;
  bmdcRegNumber: string;
  fullName: string;
  specialty: string;
  email: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  hospital?: Hospital;
  doctor?: Doctor;
  scope: string;
  validFrom: string;
  validUntil: string;
  status: string;
  purpose: string;
}

export interface DuplicateCheckResponse {
  duplicateDetected: boolean;
  testCode?: string;
  testName?: string;
  warningMessage?: string;
  previousTestDate?: string;
  previousHospitalName?: string;
  previousDoctorName?: string;
  previousResultSummary?: string;
  daysAgo?: number;
}

export interface AccessLog {
  id: string;
  actorType: string;
  actorName: string;
  hospital?: Hospital;
  action: string;
  justification: string;
  accessedAt: string;
}

export interface MriStudy {
  accessionNumber: string;
  modality: 'MR' | 'CT' | 'CR';
  studyDescription: string;
  bodyPart: string;
  fieldStrength: string;
  contrastUsed: boolean;
  contrastAgent?: string;
  totalSlices: number;
  sliceThickness: string;
  performingHospital: string;
  radiologistName: string;
  impression: string;
  findings: string[];
  recommendation: string;
  dicomUid: string;
}

export interface CdssAlert {
  id: string;
  type: 'DUPLICATE_ORDER' | 'DRUG_INTERACTION' | 'ALLERGY_ALERT' | 'CLINICAL_REMINDER';
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  message: string;
  recommendation: string;
  sourceGuideline?: string;
}

export interface CpoeOrder {
  id: string;
  category: 'MEDICATION' | 'LABORATORY' | 'IMAGING_MRI' | 'PROCEDURE';
  itemName: string;
  details: string;
  urgency: 'ROUTINE' | 'URGENT' | 'STAT';
  orderedBy: string;
  status: 'ORDERED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cdssChecked: boolean;
  orderedAt: string;
}
