package com.dghs.healthcard.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class MedicalTimelineDto {
    private UUID encounterId;
    private LocalDateTime visitDate;
    private String encounterType;
    private String hospitalCode;
    private String hospitalName;
    private String hospitalDistrict;
    private String doctorName;
    private String doctorSpecialty;
    private String chiefComplaint;
    private String clinicalNotes;
    private List<ConditionDto> conditions;
    private List<MedicationDto> medications;
    private List<DiagnosticReportDto> diagnosticReports;

    public MedicalTimelineDto() {}

    public MedicalTimelineDto(UUID encounterId, LocalDateTime visitDate, String encounterType, String hospitalCode,
                              String hospitalName, String hospitalDistrict, String doctorName, String doctorSpecialty,
                              String chiefComplaint, String clinicalNotes, List<ConditionDto> conditions,
                              List<MedicationDto> medications, List<DiagnosticReportDto> diagnosticReports) {
        this.encounterId = encounterId;
        this.visitDate = visitDate;
        this.encounterType = encounterType;
        this.hospitalCode = hospitalCode;
        this.hospitalName = hospitalName;
        this.hospitalDistrict = hospitalDistrict;
        this.doctorName = doctorName;
        this.doctorSpecialty = doctorSpecialty;
        this.chiefComplaint = chiefComplaint;
        this.clinicalNotes = clinicalNotes;
        this.conditions = conditions;
        this.medications = medications;
        this.diagnosticReports = diagnosticReports;
    }

    public static MedicalTimelineDtoBuilder builder() { return new MedicalTimelineDtoBuilder(); }

    public static class MedicalTimelineDtoBuilder {
        private UUID encounterId;
        private LocalDateTime visitDate;
        private String encounterType;
        private String hospitalCode;
        private String hospitalName;
        private String hospitalDistrict;
        private String doctorName;
        private String doctorSpecialty;
        private String chiefComplaint;
        private String clinicalNotes;
        private List<ConditionDto> conditions;
        private List<MedicationDto> medications;
        private List<DiagnosticReportDto> diagnosticReports;

        public MedicalTimelineDtoBuilder encounterId(UUID encounterId) { this.encounterId = encounterId; return this; }
        public MedicalTimelineDtoBuilder visitDate(LocalDateTime visitDate) { this.visitDate = visitDate; return this; }
        public MedicalTimelineDtoBuilder encounterType(String encounterType) { this.encounterType = encounterType; return this; }
        public MedicalTimelineDtoBuilder hospitalCode(String hospitalCode) { this.hospitalCode = hospitalCode; return this; }
        public MedicalTimelineDtoBuilder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public MedicalTimelineDtoBuilder hospitalDistrict(String hospitalDistrict) { this.hospitalDistrict = hospitalDistrict; return this; }
        public MedicalTimelineDtoBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public MedicalTimelineDtoBuilder doctorSpecialty(String doctorSpecialty) { this.doctorSpecialty = doctorSpecialty; return this; }
        public MedicalTimelineDtoBuilder chiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; return this; }
        public MedicalTimelineDtoBuilder clinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; return this; }
        public MedicalTimelineDtoBuilder conditions(List<ConditionDto> conditions) { this.conditions = conditions; return this; }
        public MedicalTimelineDtoBuilder medications(List<MedicationDto> medications) { this.medications = medications; return this; }
        public MedicalTimelineDtoBuilder diagnosticReports(List<DiagnosticReportDto> diagnosticReports) { this.diagnosticReports = diagnosticReports; return this; }
        public MedicalTimelineDto build() {
            return new MedicalTimelineDto(encounterId, visitDate, encounterType, hospitalCode, hospitalName, hospitalDistrict, doctorName, doctorSpecialty, chiefComplaint, clinicalNotes, conditions, medications, diagnosticReports);
        }
    }

    public static class ConditionDto {
        private UUID id;
        private String code;
        private String description;
        private String clinicalStatus;
        private String notes;

        public ConditionDto() {}
        public ConditionDto(UUID id, String code, String description, String clinicalStatus, String notes) {
            this.id = id;
            this.code = code;
            this.description = description;
            this.clinicalStatus = clinicalStatus;
            this.notes = notes;
        }
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getClinicalStatus() { return clinicalStatus; }
        public void setClinicalStatus(String clinicalStatus) { this.clinicalStatus = clinicalStatus; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class MedicationDto {
        private UUID id;
        private String medicationName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;

        public MedicationDto() {}
        public MedicationDto(UUID id, String medicationName, String dosage, String frequency, String duration, String instructions) {
            this.id = id;
            this.medicationName = medicationName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.duration = duration;
            this.instructions = instructions;
        }
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getMedicationName() { return medicationName; }
        public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }
        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
    }

    public static class DiagnosticReportDto {
        private UUID id;
        private String testCode;
        private String testName;
        private String status;
        private LocalDateTime issuedDate;
        private String resultSummary;
        private String fileUrl;
        private String clinicalNotes;

        public DiagnosticReportDto() {}
        public DiagnosticReportDto(UUID id, String testCode, String testName, String status, LocalDateTime issuedDate, String resultSummary, String fileUrl, String clinicalNotes) {
            this.id = id;
            this.testCode = testCode;
            this.testName = testName;
            this.status = status;
            this.issuedDate = issuedDate;
            this.resultSummary = resultSummary;
            this.fileUrl = fileUrl;
            this.clinicalNotes = clinicalNotes;
        }
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getTestCode() { return testCode; }
        public void setTestCode(String testCode) { this.testCode = testCode; }
        public String getTestName() { return testName; }
        public void setTestName(String testName) { this.testName = testName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getIssuedDate() { return issuedDate; }
        public void setIssuedDate(LocalDateTime issuedDate) { this.issuedDate = issuedDate; }
        public String getResultSummary() { return resultSummary; }
        public void setResultSummary(String resultSummary) { this.resultSummary = resultSummary; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
    }

    public UUID getEncounterId() { return encounterId; }
    public void setEncounterId(UUID encounterId) { this.encounterId = encounterId; }
    public LocalDateTime getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDateTime visitDate) { this.visitDate = visitDate; }
    public String getEncounterType() { return encounterType; }
    public void setEncounterType(String encounterType) { this.encounterType = encounterType; }
    public String getHospitalCode() { return hospitalCode; }
    public void setHospitalCode(String hospitalCode) { this.hospitalCode = hospitalCode; }
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public String getHospitalDistrict() { return hospitalDistrict; }
    public void setHospitalDistrict(String hospitalDistrict) { this.hospitalDistrict = hospitalDistrict; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getDoctorSpecialty() { return doctorSpecialty; }
    public void setDoctorSpecialty(String doctorSpecialty) { this.doctorSpecialty = doctorSpecialty; }
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
    public List<ConditionDto> getConditions() { return conditions; }
    public void setConditions(List<ConditionDto> conditions) { this.conditions = conditions; }
    public List<MedicationDto> getMedications() { return medications; }
    public void setMedications(List<MedicationDto> medications) { this.medications = medications; }
    public List<DiagnosticReportDto> getDiagnosticReports() { return diagnosticReports; }
    public void setDiagnosticReports(List<DiagnosticReportDto> diagnosticReports) { this.diagnosticReports = diagnosticReports; }
}
