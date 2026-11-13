package com.dghs.healthcard.service;

import com.dghs.healthcard.domain.ConsentRecord;
import com.dghs.healthcard.domain.Doctor;
import com.dghs.healthcard.domain.Hospital;
import com.dghs.healthcard.domain.Patient;
import com.dghs.healthcard.dto.BreakGlassRequest;
import com.dghs.healthcard.dto.ConsentGrantRequest;
import com.dghs.healthcard.repository.ConsentRepository;
import com.dghs.healthcard.repository.DoctorRepository;
import com.dghs.healthcard.repository.HospitalRepository;
import com.dghs.healthcard.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ConsentService {
    private final ConsentRepository consentRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final AuditService auditService;

    @Value("${app.consent.default-duration-hours:4}")
    private int defaultDurationHours;

    public ConsentService(ConsentRepository consentRepository, PatientRepository patientRepository,
                          HospitalRepository hospitalRepository, DoctorRepository doctorRepository,
                          AuditService auditService) {
        this.consentRepository = consentRepository;
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.auditService = auditService;
    }

    @Transactional
    public ConsentRecord grantConsent(ConsentGrantRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Hospital hospital = null;
        if (request.getHospitalId() != null) {
            hospital = hospitalRepository.findById(request.getHospitalId()).orElse(null);
        }

        Doctor doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
        }

        int duration = request.getDurationHours() != null && request.getDurationHours() > 0 
                ? request.getDurationHours() : defaultDurationHours;

        LocalDateTime now = LocalDateTime.now();
        ConsentRecord consent = ConsentRecord.builder()
                .patient(patient)
                .hospital(hospital)
                .doctor(doctor)
                .scope(request.getScope() != null ? request.getScope() : "ALL")
                .validFrom(now)
                .validUntil(now.plusHours(duration))
                .status("ACTIVE")
                .purpose(request.getPurpose() != null ? request.getPurpose() : "Medical consultation")
                .build();

        ConsentRecord saved = consentRepository.save(consent);

        auditService.logAccess(
                patient.getId(),
                "PATIENT",
                patient.getFullName(),
                hospital != null ? hospital.getId() : null,
                "GRANT_CONSENT",
                "Granted access for " + duration + " hours to " + (hospital != null ? hospital.getName() : "all providers")
        );

        return saved;
    }

    public boolean hasActiveConsent(UUID patientId, UUID hospitalId) {
        if (hospitalId == null) return true;
        List<ConsentRecord> activeConsents = consentRepository.findActiveConsentsForHospital(
                patientId, hospitalId, LocalDateTime.now());
        return !activeConsents.isEmpty();
    }

    @Transactional
    public ConsentRecord breakGlass(BreakGlassRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
        String doctorName = doctor != null ? doctor.getFullName() : "Emergency Clinician";

        LocalDateTime now = LocalDateTime.now();
        ConsentRecord emergencyConsent = ConsentRecord.builder()
                .patient(patient)
                .hospital(hospital)
                .doctor(doctor)
                .scope("EMERGENCY_OVERRIDE")
                .validFrom(now)
                .validUntil(now.plusHours(2))
                .status("ACTIVE")
                .purpose("BREAK-GLASS: " + request.getReason())
                .build();

        ConsentRecord saved = consentRepository.save(emergencyConsent);

        auditService.logAccess(
                patient.getId(),
                "EMERGENCY_BREAK_GLASS",
                doctorName,
                hospital.getId(),
                "BREAK_GLASS_EMERGENCY",
                "CRITICAL EMERGENCY OVERRIDE. Justification: " + request.getReason()
        );

        return saved;
    }

    public List<ConsentRecord> getConsentsForPatient(UUID patientId) {
        return consentRepository.findByPatientIdOrderByValidFromDesc(patientId);
    }
}
