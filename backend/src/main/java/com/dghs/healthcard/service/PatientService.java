package com.dghs.healthcard.service;

import com.dghs.healthcard.domain.HealthIdentifier;
import com.dghs.healthcard.domain.Patient;
import com.dghs.healthcard.dto.DigitalHealthCardDto;
import com.dghs.healthcard.dto.PatientRegistrationRequest;
import com.dghs.healthcard.repository.HealthIdentifierRepository;
import com.dghs.healthcard.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final HealthIdentifierRepository healthIdentifierRepository;

    public PatientService(PatientRepository patientRepository, HealthIdentifierRepository healthIdentifierRepository) {
        this.patientRepository = patientRepository;
        this.healthIdentifierRepository = healthIdentifierRepository;
    }

    @Transactional
    public DigitalHealthCardDto registerPatient(PatientRegistrationRequest request) {
        String maskedNid = maskNid(request.getNid());

        Patient patient = Patient.builder()
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phone(request.getPhone())
                .nidMasked(maskedNid)
                .bloodGroup(request.getBloodGroup())
                .emergencyContact(request.getEmergencyContact())
                .address(request.getAddress())
                .createdAt(LocalDateTime.now())
                .build();

        patient = patientRepository.save(patient);

        String healthId = generateUniqueHealthId();
        String cardToken = "HC-" + UUID.randomUUID().toString();

        HealthIdentifier identifier = HealthIdentifier.builder()
                .patient(patient)
                .identifierValue(healthId)
                .cardToken(cardToken)
                .status("ACTIVE")
                .issuedAt(LocalDateTime.now())
                .build();

        healthIdentifierRepository.save(identifier);

        return mapToCardDto(patient, identifier);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<DigitalHealthCardDto> getCardByPatientId(UUID patientId) {
        return healthIdentifierRepository.findByPatientId(patientId)
                .map(ident -> mapToCardDto(ident.getPatient(), ident));
    }

    public Optional<DigitalHealthCardDto> getCardByToken(String cardToken) {
        return healthIdentifierRepository.findByCardToken(cardToken)
                .map(ident -> mapToCardDto(ident.getPatient(), ident));
    }

    public Optional<DigitalHealthCardDto> getCardByHealthId(String healthId) {
        return healthIdentifierRepository.findByIdentifierValue(healthId)
                .map(ident -> mapToCardDto(ident.getPatient(), ident));
    }

    public DigitalHealthCardDto mapToCardDto(Patient patient, HealthIdentifier identifier) {
        return DigitalHealthCardDto.builder()
                .patientId(patient.getId())
                .healthId(identifier.getIdentifierValue())
                .fullName(patient.getFullName())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .nidMasked(patient.getNidMasked())
                .emergencyContact(patient.getEmergencyContact())
                .cardToken(identifier.getCardToken())
                .qrCodeContent("dghs-healthcard://verify?token=" + identifier.getCardToken())
                .status(identifier.getStatus())
                .build();
    }

    private String generateUniqueHealthId() {
        Random random = new Random();
        int num = 100000 + random.nextInt(900000);
        return "HID-2026-" + num;
    }

    private String maskNid(String nid) {
        if (nid == null || nid.trim().isEmpty()) {
            return "N/A";
        }
        String clean = nid.trim();
        if (clean.length() <= 4) {
            return "***-" + clean;
        }
        return "***-***-" + clean.substring(clean.length() - 4);
    }
}
