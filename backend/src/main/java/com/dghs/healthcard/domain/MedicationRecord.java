package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "medications")
public class MedicationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(nullable = false, length = 150)
    private String medicationName;

    @Column(length = 50)
    private String dosage;

    @Column(length = 50)
    private String frequency;

    @Column(length = 50)
    private String duration;

    @Column(length = 255)
    private String instructions;

    @Column(nullable = false)
    private LocalDateTime prescribedAt = LocalDateTime.now();

    public MedicationRecord() {}

    public MedicationRecord(UUID id, Encounter encounter, String medicationName, String dosage, String frequency, String duration, String instructions, LocalDateTime prescribedAt) {
        this.id = id;
        this.encounter = encounter;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
        this.prescribedAt = prescribedAt != null ? prescribedAt : LocalDateTime.now();
    }

    public static MedicationRecordBuilder builder() { return new MedicationRecordBuilder(); }

    public static class MedicationRecordBuilder {
        private UUID id;
        private Encounter encounter;
        private String medicationName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
        private LocalDateTime prescribedAt = LocalDateTime.now();

        public MedicationRecordBuilder id(UUID id) { this.id = id; return this; }
        public MedicationRecordBuilder encounter(Encounter encounter) { this.encounter = encounter; return this; }
        public MedicationRecordBuilder medicationName(String medicationName) { this.medicationName = medicationName; return this; }
        public MedicationRecordBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public MedicationRecordBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public MedicationRecordBuilder duration(String duration) { this.duration = duration; return this; }
        public MedicationRecordBuilder instructions(String instructions) { this.instructions = instructions; return this; }
        public MedicationRecordBuilder prescribedAt(LocalDateTime prescribedAt) { this.prescribedAt = prescribedAt; return this; }
        public MedicationRecord build() { return new MedicationRecord(id, encounter, medicationName, dosage, frequency, duration, instructions, prescribedAt); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Encounter getEncounter() { return encounter; }
    public void setEncounter(Encounter encounter) { this.encounter = encounter; }
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
    public LocalDateTime getPrescribedAt() { return prescribedAt; }
    public void setPrescribedAt(LocalDateTime prescribedAt) { this.prescribedAt = prescribedAt; }
}
