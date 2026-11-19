package com.dghs.healthcard.service;

import com.dghs.healthcard.domain.AccessLog;
import com.dghs.healthcard.domain.Hospital;
import com.dghs.healthcard.domain.Patient;
import com.dghs.healthcard.repository.AccessLogRepository;
import com.dghs.healthcard.repository.HospitalRepository;
import com.dghs.healthcard.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuditService {
    private final AccessLogRepository accessLogRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;

    public AuditService(AccessLogRepository accessLogRepository, PatientRepository patientRepository, HospitalRepository hospitalRepository) {
        this.accessLogRepository = accessLogRepository;
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Transactional
    public void logAccess(UUID patientId, String actorType, String actorName, UUID hospitalId, String action, String justification) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        if (patient == null) return;

        Hospital hospital = null;
        if (hospitalId != null) {
            hospital = hospitalRepository.findById(hospitalId).orElse(null);
        }

        AccessLog log = AccessLog.builder()
                .patient(patient)
                .actorType(actorType != null ? actorType : "SYSTEM")
                .actorName(actorName != null ? actorName : "Authorized User")
                .hospital(hospital)
                .action(action)
                .justification(justification)
                .accessedAt(LocalDateTime.now())
                .build();

        accessLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AccessLog> getLogsForPatient(UUID patientId) {
        return accessLogRepository.findByPatientIdOrderByAccessedAtDesc(patientId);
    }

    @Transactional(readOnly = true)
    public List<AccessLog> getRecentLogs() {
        return accessLogRepository.findTop50ByOrderByAccessedAtDesc();
    }
}
