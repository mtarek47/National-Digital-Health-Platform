package com.dghs.healthcard.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class EncounterCreateRequest {
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @NotNull(message = "Hospital ID is required")
    private UUID hospitalId;

    @NotNull(message = "Doctor ID is required")
    private UUID doctorId;

    private String encounterType;
    private String chiefComplaint;
    private String clinicalNotes;

    private List<ConditionInput> conditions;
    private List<MedicationInput> medications;
    private List<DiagnosticReportInput> diagnosticReports;

    public EncounterCreateRequest() {}

    public static class ConditionInput {
        private String code;
        private String description;
        private String clinicalStatus;
        private String notes;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getClinicalStatus() { return clinicalStatus; }
        public void setClinicalStatus(String clinicalStatus) { this.clinicalStatus = clinicalStatus; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class MedicationInput {
        private String medicationName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;

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

    public static class DiagnosticReportInput {
        private String testCode;
        private String testName;
        private String status;
        private String resultSummary;
        private String clinicalNotes;

        public String getTestCode() { return testCode; }
        public void setTestCode(String testCode) { this.testCode = testCode; }
        public String getTestName() { return testName; }
        public void setTestName(String testName) { this.testName = testName; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getResultSummary() { return resultSummary; }
        public void setResultSummary(String resultSummary) { this.resultSummary = resultSummary; }
        public String getClinicalNotes() { return clinicalNotes; }
        public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
    }

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    public UUID getHospitalId() { return hospitalId; }
    public void setHospitalId(UUID hospitalId) { this.hospitalId = hospitalId; }
    public UUID getDoctorId() { return doctorId; }
    public void setDoctorId(UUID doctorId) { this.doctorId = doctorId; }
    public String getEncounterType() { return encounterType; }
    public void setEncounterType(String encounterType) { this.encounterType = encounterType; }
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
    public List<ConditionInput> getConditions() { return conditions; }
    public void setConditions(List<ConditionInput> conditions) { this.conditions = conditions; }
    public List<MedicationInput> getMedications() { return medications; }
    public void setMedications(List<MedicationInput> medications) { this.medications = medications; }
    public List<DiagnosticReportInput> getDiagnosticReports() { return diagnosticReports; }
    public void setDiagnosticReports(List<DiagnosticReportInput> diagnosticReports) { this.diagnosticReports = diagnosticReports; }
}
