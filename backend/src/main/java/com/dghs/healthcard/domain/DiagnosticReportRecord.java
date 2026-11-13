package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "diagnostic_reports")
public class DiagnosticReportRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(nullable = false, length = 50)
    private String testCode;

    @Column(nullable = false, length = 150)
    private String testName;

    @Column(nullable = false, length = 50)
    private String status = "FINAL";

    @Column(nullable = false)
    private LocalDateTime issuedDate = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String resultSummary;

    @Column(length = 255)
    private String fileUrl;

    @Column(columnDefinition = "TEXT")
    private String clinicalNotes;

    public DiagnosticReportRecord() {}

    public DiagnosticReportRecord(UUID id, Encounter encounter, String testCode, String testName, String status,
                                  LocalDateTime issuedDate, String resultSummary, String fileUrl, String clinicalNotes) {
        this.id = id;
        this.encounter = encounter;
        this.testCode = testCode;
        this.testName = testName;
        this.status = status != null ? status : "FINAL";
        this.issuedDate = issuedDate != null ? issuedDate : LocalDateTime.now();
        this.resultSummary = resultSummary;
        this.fileUrl = fileUrl;
        this.clinicalNotes = clinicalNotes;
    }

    public static DiagnosticReportRecordBuilder builder() { return new DiagnosticReportRecordBuilder(); }

    public static class DiagnosticReportRecordBuilder {
        private UUID id;
        private Encounter encounter;
        private String testCode;
        private String testName;
        private String status = "FINAL";
        private LocalDateTime issuedDate = LocalDateTime.now();
        private String resultSummary;
        private String fileUrl;
        private String clinicalNotes;

        public DiagnosticReportRecordBuilder id(UUID id) { this.id = id; return this; }
        public DiagnosticReportRecordBuilder encounter(Encounter encounter) { this.encounter = encounter; return this; }
        public DiagnosticReportRecordBuilder testCode(String testCode) { this.testCode = testCode; return this; }
        public DiagnosticReportRecordBuilder testName(String testName) { this.testName = testName; return this; }
        public DiagnosticReportRecordBuilder status(String status) { this.status = status; return this; }
        public DiagnosticReportRecordBuilder issuedDate(LocalDateTime issuedDate) { this.issuedDate = issuedDate; return this; }
        public DiagnosticReportRecordBuilder resultSummary(String resultSummary) { this.resultSummary = resultSummary; return this; }
        public DiagnosticReportRecordBuilder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public DiagnosticReportRecordBuilder clinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; return this; }
        public DiagnosticReportRecord build() { return new DiagnosticReportRecord(id, encounter, testCode, testName, status, issuedDate, resultSummary, fileUrl, clinicalNotes); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Encounter getEncounter() { return encounter; }
    public void setEncounter(Encounter encounter) { this.encounter = encounter; }
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
