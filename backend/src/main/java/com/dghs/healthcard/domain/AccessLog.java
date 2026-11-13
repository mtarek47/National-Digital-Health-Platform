package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "access_logs")
public class AccessLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 50)
    private String actorType;

    @Column(length = 150)
    private String actorName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(nullable = false)
    private LocalDateTime accessedAt = LocalDateTime.now();

    public AccessLog() {}

    public AccessLog(UUID id, Patient patient, String actorType, String actorName, Hospital hospital,
                     String action, String justification, LocalDateTime accessedAt) {
        this.id = id;
        this.patient = patient;
        this.actorType = actorType;
        this.actorName = actorName;
        this.hospital = hospital;
        this.action = action;
        this.justification = justification;
        this.accessedAt = accessedAt != null ? accessedAt : LocalDateTime.now();
    }

    public static AccessLogBuilder builder() { return new AccessLogBuilder(); }

    public static class AccessLogBuilder {
        private UUID id;
        private Patient patient;
        private String actorType;
        private String actorName;
        private Hospital hospital;
        private String action;
        private String justification;
        private LocalDateTime accessedAt = LocalDateTime.now();

        public AccessLogBuilder id(UUID id) { this.id = id; return this; }
        public AccessLogBuilder patient(Patient patient) { this.patient = patient; return this; }
        public AccessLogBuilder actorType(String actorType) { this.actorType = actorType; return this; }
        public AccessLogBuilder actorName(String actorName) { this.actorName = actorName; return this; }
        public AccessLogBuilder hospital(Hospital hospital) { this.hospital = hospital; return this; }
        public AccessLogBuilder action(String action) { this.action = action; return this; }
        public AccessLogBuilder justification(String justification) { this.justification = justification; return this; }
        public AccessLogBuilder accessedAt(LocalDateTime accessedAt) { this.accessedAt = accessedAt; return this; }
        public AccessLog build() { return new AccessLog(id, patient, actorType, actorName, hospital, action, justification, accessedAt); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public String getActorType() { return actorType; }
    public void setActorType(String actorType) { this.actorType = actorType; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getJustification() { return justification; }
    public void setJustification(String justification) { this.justification = justification; }
    public LocalDateTime getAccessedAt() { return accessedAt; }
    public void setAccessedAt(LocalDateTime accessedAt) { this.accessedAt = accessedAt; }
}
