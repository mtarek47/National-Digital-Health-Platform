package com.dghs.healthcard.service;

import com.dghs.healthcard.domain.DiagnosticReportRecord;
import com.dghs.healthcard.dto.DuplicateCheckResponse;
import com.dghs.healthcard.repository.DiagnosticReportRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DecisionSupportService {
    private final DiagnosticReportRepository diagnosticReportRepository;

    @Value("${app.duplicate-test.window-days:30}")
    private int windowDays;

    public DecisionSupportService(DiagnosticReportRepository diagnosticReportRepository) {
        this.diagnosticReportRepository = diagnosticReportRepository;
    }

    public DuplicateCheckResponse checkDuplicateTest(UUID patientId, String testCode) {
        if (patientId == null || testCode == null || testCode.trim().isEmpty()) {
            return DuplicateCheckResponse.builder().duplicateDetected(false).build();
        }

        LocalDateTime cutoff = LocalDateTime.now().minusDays(windowDays);
        List<DiagnosticReportRecord> existingReports = diagnosticReportRepository
                .findByEncounterPatientIdAndTestCodeIgnoreCaseAndIssuedDateAfter(patientId, testCode.trim(), cutoff);

        if (existingReports.isEmpty()) {
            return DuplicateCheckResponse.builder()
                    .duplicateDetected(false)
                    .testCode(testCode)
                    .build();
        }

        DiagnosticReportRecord latest = existingReports.get(0);
        long daysAgo = Duration.between(latest.getIssuedDate(), LocalDateTime.now()).toDays();
        String hospName = latest.getEncounter() != null && latest.getEncounter().getHospital() != null
                ? latest.getEncounter().getHospital().getName() : "Another Hospital";
        String docName = latest.getEncounter() != null && latest.getEncounter().getDoctor() != null
                ? latest.getEncounter().getDoctor().getFullName() : "Attending Clinician";

        String warning = String.format(
                "Clinical Alert: A recent %s was already performed %d days ago at %s by %s. Results: [%s]. Re-ordering may be unnecessary.",
                latest.getTestName(),
                daysAgo,
                hospName,
                docName,
                latest.getResultSummary() != null ? latest.getResultSummary() : "Available in record"
        );

        return DuplicateCheckResponse.builder()
                .duplicateDetected(true)
                .testCode(latest.getTestCode())
                .testName(latest.getTestName())
                .warningMessage(warning)
                .previousTestDate(latest.getIssuedDate())
                .previousHospitalName(hospName)
                .previousDoctorName(docName)
                .previousResultSummary(latest.getResultSummary())
                .daysAgo(daysAgo)
                .build();
    }
}
