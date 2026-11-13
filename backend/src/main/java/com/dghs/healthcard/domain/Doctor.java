package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(nullable = false, unique = true, length = 50)
    private String bmdcRegNumber;

    @Column(nullable = false, length = 150)
    private String fullName;

    @Column(length = 100)
    private String specialty;

    @Column(length = 100)
    private String email;

    public Doctor() {}

    public Doctor(UUID id, Hospital hospital, String bmdcRegNumber, String fullName, String specialty, String email) {
        this.id = id;
        this.hospital = hospital;
        this.bmdcRegNumber = bmdcRegNumber;
        this.fullName = fullName;
        this.specialty = specialty;
        this.email = email;
    }

    public static DoctorBuilder builder() { return new DoctorBuilder(); }

    public static class DoctorBuilder {
        private UUID id;
        private Hospital hospital;
        private String bmdcRegNumber;
        private String fullName;
        private String specialty;
        private String email;

        public DoctorBuilder id(UUID id) { this.id = id; return this; }
        public DoctorBuilder hospital(Hospital hospital) { this.hospital = hospital; return this; }
        public DoctorBuilder bmdcRegNumber(String bmdcRegNumber) { this.bmdcRegNumber = bmdcRegNumber; return this; }
        public DoctorBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public DoctorBuilder specialty(String specialty) { this.specialty = specialty; return this; }
        public DoctorBuilder email(String email) { this.email = email; return this; }
        public Doctor build() { return new Doctor(id, hospital, bmdcRegNumber, fullName, specialty, email); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public String getBmdcRegNumber() { return bmdcRegNumber; }
    public void setBmdcRegNumber(String bmdcRegNumber) { this.bmdcRegNumber = bmdcRegNumber; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
