package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 50)
    private String nidMasked;

    @Column(length = 10)
    private String bloodGroup;

    @Column(length = 150)
    private String emergencyContact;

    @Column(length = 255)
    private String address;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Patient() {}

    public Patient(UUID id, String fullName, LocalDate dateOfBirth, String gender, String phone,
                   String nidMasked, String bloodGroup, String emergencyContact, String address, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phone = phone;
        this.nidMasked = nidMasked;
        this.bloodGroup = bloodGroup;
        this.emergencyContact = emergencyContact;
        this.address = address;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static PatientBuilder builder() { return new PatientBuilder(); }

    public static class PatientBuilder {
        private UUID id;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String phone;
        private String nidMasked;
        private String bloodGroup;
        private String emergencyContact;
        private String address;
        private LocalDateTime createdAt = LocalDateTime.now();

        public PatientBuilder id(UUID id) { this.id = id; return this; }
        public PatientBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public PatientBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientBuilder nidMasked(String nidMasked) { this.nidMasked = nidMasked; return this; }
        public PatientBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public PatientBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public PatientBuilder address(String address) { this.address = address; return this; }
        public PatientBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Patient build() {
            return new Patient(id, fullName, dateOfBirth, gender, phone, nidMasked, bloodGroup, emergencyContact, address, createdAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getNidMasked() { return nidMasked; }
    public void setNidMasked(String nidMasked) { this.nidMasked = nidMasked; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
