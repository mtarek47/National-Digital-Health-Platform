package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "health_identifiers")
public class HealthIdentifier {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(nullable = false, unique = true, length = 50)
    private String identifierValue;

    @Column(nullable = false, unique = true, length = 120)
    private String cardToken;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(nullable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();

    public HealthIdentifier() {}

    public HealthIdentifier(UUID id, Patient patient, String identifierValue, String cardToken, String status, LocalDateTime issuedAt) {
        this.id = id;
        this.patient = patient;
        this.identifierValue = identifierValue;
        this.cardToken = cardToken;
        this.status = status != null ? status : "ACTIVE";
        this.issuedAt = issuedAt != null ? issuedAt : LocalDateTime.now();
    }

    public static HealthIdentifierBuilder builder() { return new HealthIdentifierBuilder(); }

    public static class HealthIdentifierBuilder {
        private UUID id;
        private Patient patient;
        private String identifierValue;
        private String cardToken;
        private String status = "ACTIVE";
        private LocalDateTime issuedAt = LocalDateTime.now();

        public HealthIdentifierBuilder id(UUID id) { this.id = id; return this; }
        public HealthIdentifierBuilder patient(Patient patient) { this.patient = patient; return this; }
        public HealthIdentifierBuilder identifierValue(String identifierValue) { this.identifierValue = identifierValue; return this; }
        public HealthIdentifierBuilder cardToken(String cardToken) { this.cardToken = cardToken; return this; }
        public HealthIdentifierBuilder status(String status) { this.status = status; return this; }
        public HealthIdentifierBuilder issuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; return this; }
        public HealthIdentifier build() { return new HealthIdentifier(id, patient, identifierValue, cardToken, status, issuedAt); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public String getIdentifierValue() { return identifierValue; }
    public void setIdentifierValue(String identifierValue) { this.identifierValue = identifierValue; }
    public String getCardToken() { return cardToken; }
    public void setCardToken(String cardToken) { this.cardToken = cardToken; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
}
