package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "consents")
public class ConsentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(nullable = false, length = 50)
    private String scope = "ALL";

    @Column(nullable = false)
    private LocalDateTime validFrom = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime validUntil;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(length = 255)
    private String purpose;

    public ConsentRecord() {}

    public ConsentRecord(UUID id, Patient patient, Hospital hospital, Doctor doctor, String scope,
                         LocalDateTime validFrom, LocalDateTime validUntil, String status, String purpose) {
        this.id = id;
        this.patient = patient;
        this.hospital = hospital;
        this.doctor = doctor;
        this.scope = scope != null ? scope : "ALL";
        this.validFrom = validFrom != null ? validFrom : LocalDateTime.now();
        this.validUntil = validUntil;
        this.status = status != null ? status : "ACTIVE";
        this.purpose = purpose;
    }

    public static ConsentRecordBuilder builder() { return new ConsentRecordBuilder(); }

    public static class ConsentRecordBuilder {
        private UUID id;
        private Patient patient;
        private Hospital hospital;
        private Doctor doctor;
        private String scope = "ALL";
        private LocalDateTime validFrom = LocalDateTime.now();
        private LocalDateTime validUntil;
        private String status = "ACTIVE";
        private String purpose;

        public ConsentRecordBuilder id(UUID id) { this.id = id; return this; }
        public ConsentRecordBuilder patient(Patient patient) { this.patient = patient; return this; }
        public ConsentRecordBuilder hospital(Hospital hospital) { this.hospital = hospital; return this; }
        public ConsentRecordBuilder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public ConsentRecordBuilder scope(String scope) { this.scope = scope; return this; }
        public ConsentRecordBuilder validFrom(LocalDateTime validFrom) { this.validFrom = validFrom; return this; }
        public ConsentRecordBuilder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
        public ConsentRecordBuilder status(String status) { this.status = status; return this; }
        public ConsentRecordBuilder purpose(String purpose) { this.purpose = purpose; return this; }
        public ConsentRecord build() { return new ConsentRecord(id, patient, hospital, doctor, scope, validFrom, validUntil, status, purpose); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
