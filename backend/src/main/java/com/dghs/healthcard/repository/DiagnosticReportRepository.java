package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.DiagnosticReportRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DiagnosticReportRepository extends JpaRepository<DiagnosticReportRecord, UUID> {
    List<DiagnosticReportRecord> findByEncounterId(UUID encounterId);
    List<DiagnosticReportRecord> findByEncounterPatientIdOrderByIssuedDateDesc(UUID patientId);
    
    // For duplicate test detection
    List<DiagnosticReportRecord> findByEncounterPatientIdAndTestCodeIgnoreCaseAndIssuedDateAfter(
            UUID patientId, String testCode, LocalDateTime afterDate);
}
