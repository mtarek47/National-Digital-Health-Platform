package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "encounters")
public class Encounter {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false, length = 50)
    private String encounterType = "OPD";

    @Column(nullable = false)
    private LocalDateTime visitDate = LocalDateTime.now();

    @Column(length = 255)
    private String chiefComplaint;

    @Column(columnDefinition = "TEXT")
    private String clinicalNotes;

    public Encounter() {}

    public Encounter(UUID id, Patient patient, Hospital hospital, Doctor doctor, String encounterType,
                     LocalDateTime visitDate, String chiefComplaint, String clinicalNotes) {
        this.id = id;
        this.patient = patient;
        this.hospital = hospital;
        this.doctor = doctor;
        this.encounterType = encounterType != null ? encounterType : "OPD";
        this.visitDate = visitDate != null ? visitDate : LocalDateTime.now();
        this.chiefComplaint = chiefComplaint;
        this.clinicalNotes = clinicalNotes;
    }

    public static EncounterBuilder builder() { return new EncounterBuilder(); }

    public static class EncounterBuilder {
        private UUID id;
        private Patient patient;
        private Hospital hospital;
        private Doctor doctor;
        private String encounterType = "OPD";
        private LocalDateTime visitDate = LocalDateTime.now();
        private String chiefComplaint;
        private String clinicalNotes;

        public EncounterBuilder id(UUID id) { this.id = id; return this; }
        public EncounterBuilder patient(Patient patient) { this.patient = patient; return this; }
        public EncounterBuilder hospital(Hospital hospital) { this.hospital = hospital; return this; }
        public EncounterBuilder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public EncounterBuilder encounterType(String encounterType) { this.encounterType = encounterType; return this; }
        public EncounterBuilder visitDate(LocalDateTime visitDate) { this.visitDate = visitDate; return this; }
        public EncounterBuilder chiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; return this; }
        public EncounterBuilder clinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; return this; }
        public Encounter build() { return new Encounter(id, patient, hospital, doctor, encounterType, visitDate, chiefComplaint, clinicalNotes); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public String getEncounterType() { return encounterType; }
    public void setEncounterType(String encounterType) { this.encounterType = encounterType; }
    public LocalDateTime getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDateTime visitDate) { this.visitDate = visitDate; }
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }
}
