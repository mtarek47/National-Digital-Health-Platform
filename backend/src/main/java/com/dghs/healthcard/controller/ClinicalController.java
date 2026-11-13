package com.dghs.healthcard.controller;

import com.dghs.healthcard.common.ApiResponse;
import com.dghs.healthcard.dto.EncounterCreateRequest;
import com.dghs.healthcard.dto.MedicalTimelineDto;
import com.dghs.healthcard.service.AuditService;
import com.dghs.healthcard.service.ClinicalService;
import com.dghs.healthcard.service.ConsentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clinical")
@Tag(name = "Clinical Records API", description = "Encounters, diagnoses, prescriptions, lab results, and patient timeline")
public class ClinicalController {
    private final ClinicalService clinicalService;
    private final ConsentService consentService;
    private final AuditService auditService;

    public ClinicalController(ClinicalService clinicalService, ConsentService consentService, AuditService auditService) {
        this.clinicalService = clinicalService;
        this.consentService = consentService;
        this.auditService = auditService;
    }

    @PostMapping("/encounters")
    @Operation(summary = "Record new clinical encounter with diagnoses, medications, and lab reports")
    public ResponseEntity<ApiResponse<MedicalTimelineDto>> createEncounter(@Valid @RequestBody EncounterCreateRequest request) {
        MedicalTimelineDto timeline = clinicalService.createEncounter(request);
        return ResponseEntity.ok(ApiResponse.ok(timeline, "Clinical encounter recorded successfully"));
    }

    @GetMapping("/timeline/{patientId}")
    @Operation(summary = "Get full medical timeline across all hospitals")
    public ResponseEntity<ApiResponse<List<MedicalTimelineDto>>> getTimeline(
            @PathVariable UUID patientId,
            @RequestParam(required = false) UUID requestingHospitalId,
            @RequestParam(required = false) String actorName) {

        if (requestingHospitalId != null) {
            boolean hasConsent = consentService.hasActiveConsent(patientId, requestingHospitalId);
            if (!hasConsent) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Patient consent required to access medical timeline for this facility"));
            }
        }

        List<MedicalTimelineDto> timeline = clinicalService.getPatientTimeline(patientId);

        auditService.logAccess(
                patientId,
                "PROVIDER",
                actorName != null ? actorName : "Attending Doctor",
                requestingHospitalId,
                "VIEW_TIMELINE",
                "Accessed longitudinal medical history"
        );

        return ResponseEntity.ok(ApiResponse.ok(timeline, "Medical history retrieved"));
    }
}
