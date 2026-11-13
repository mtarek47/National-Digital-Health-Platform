package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "conditions")
public class ConditionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", nullable = false)
    private Encounter encounter;

    @Column(nullable = false, length = 50)
    private String clinicalStatus = "active";

    @Column(length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    public ConditionRecord() {}

    public ConditionRecord(UUID id, Encounter encounter, String clinicalStatus, String code, String description, String notes, LocalDateTime recordedAt) {
        this.id = id;
        this.encounter = encounter;
        this.clinicalStatus = clinicalStatus != null ? clinicalStatus : "active";
        this.code = code;
        this.description = description;
        this.notes = notes;
        this.recordedAt = recordedAt != null ? recordedAt : LocalDateTime.now();
    }

    public static ConditionRecordBuilder builder() { return new ConditionRecordBuilder(); }

    public static class ConditionRecordBuilder {
        private UUID id;
        private Encounter encounter;
        private String clinicalStatus = "active";
        private String code;
        private String description;
        private String notes;
        private LocalDateTime recordedAt = LocalDateTime.now();

        public ConditionRecordBuilder id(UUID id) { this.id = id; return this; }
        public ConditionRecordBuilder encounter(Encounter encounter) { this.encounter = encounter; return this; }
        public ConditionRecordBuilder clinicalStatus(String clinicalStatus) { this.clinicalStatus = clinicalStatus; return this; }
        public ConditionRecordBuilder code(String code) { this.code = code; return this; }
        public ConditionRecordBuilder description(String description) { this.description = description; return this; }
        public ConditionRecordBuilder notes(String notes) { this.notes = notes; return this; }
        public ConditionRecordBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }
        public ConditionRecord build() { return new ConditionRecord(id, encounter, clinicalStatus, code, description, notes, recordedAt); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Encounter getEncounter() { return encounter; }
    public void setEncounter(Encounter encounter) { this.encounter = encounter; }
    public String getClinicalStatus() { return clinicalStatus; }
    public void setClinicalStatus(String clinicalStatus) { this.clinicalStatus = clinicalStatus; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
