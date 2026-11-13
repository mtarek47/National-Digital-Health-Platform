package com.dghs.healthcard.dto;

import java.time.LocalDate;
import java.util.UUID;

public class DigitalHealthCardDto {
    private UUID patientId;
    private String healthId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String nidMasked;
    private String emergencyContact;
    private String cardToken;
    private String qrCodeContent;
    private String status;

    public DigitalHealthCardDto() {}

    public DigitalHealthCardDto(UUID patientId, String healthId, String fullName, LocalDate dateOfBirth,
                                String gender, String bloodGroup, String nidMasked, String emergencyContact,
                                String cardToken, String qrCodeContent, String status) {
        this.patientId = patientId;
        this.healthId = healthId;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.nidMasked = nidMasked;
        this.emergencyContact = emergencyContact;
        this.cardToken = cardToken;
        this.qrCodeContent = qrCodeContent;
        this.status = status;
    }

    public static DigitalHealthCardDtoBuilder builder() { return new DigitalHealthCardDtoBuilder(); }

    public static class DigitalHealthCardDtoBuilder {
        private UUID patientId;
        private String healthId;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String bloodGroup;
        private String nidMasked;
        private String emergencyContact;
        private String cardToken;
        private String qrCodeContent;
        private String status;

        public DigitalHealthCardDtoBuilder patientId(UUID patientId) { this.patientId = patientId; return this; }
        public DigitalHealthCardDtoBuilder healthId(String healthId) { this.healthId = healthId; return this; }
        public DigitalHealthCardDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public DigitalHealthCardDtoBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public DigitalHealthCardDtoBuilder gender(String gender) { this.gender = gender; return this; }
        public DigitalHealthCardDtoBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public DigitalHealthCardDtoBuilder nidMasked(String nidMasked) { this.nidMasked = nidMasked; return this; }
        public DigitalHealthCardDtoBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public DigitalHealthCardDtoBuilder cardToken(String cardToken) { this.cardToken = cardToken; return this; }
        public DigitalHealthCardDtoBuilder qrCodeContent(String qrCodeContent) { this.qrCodeContent = qrCodeContent; return this; }
        public DigitalHealthCardDtoBuilder status(String status) { this.status = status; return this; }
        public DigitalHealthCardDto build() {
            return new DigitalHealthCardDto(patientId, healthId, fullName, dateOfBirth, gender, bloodGroup, nidMasked, emergencyContact, cardToken, qrCodeContent, status);
        }
    }

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    public String getHealthId() { return healthId; }
    public void setHealthId(String healthId) { this.healthId = healthId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getNidMasked() { return nidMasked; }
    public void setNidMasked(String nidMasked) { this.nidMasked = nidMasked; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getCardToken() { return cardToken; }
    public void setCardToken(String cardToken) { this.cardToken = cardToken; }
    public String getQrCodeContent() { return qrCodeContent; }
    public void setQrCodeContent(String qrCodeContent) { this.qrCodeContent = qrCodeContent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
