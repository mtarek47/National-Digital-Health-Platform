package com.dghs.healthcard.controller;

import com.dghs.healthcard.common.ApiResponse;
import com.dghs.healthcard.domain.ConsentRecord;
import com.dghs.healthcard.dto.BreakGlassRequest;
import com.dghs.healthcard.dto.ConsentGrantRequest;
import com.dghs.healthcard.service.ConsentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/consents")
@Tag(name = "Consent & Access Control API", description = "Time-limited patient consent management and emergency break-glass override")
public class ConsentController {
    private final ConsentService consentService;

    public ConsentController(ConsentService consentService) {
        this.consentService = consentService;
    }

    @PostMapping("/grant")
    @Operation(summary = "Patient grants temporary access permission to a hospital or doctor")
    public ResponseEntity<ApiResponse<ConsentRecord>> grantConsent(@Valid @RequestBody ConsentGrantRequest request) {
        ConsentRecord record = consentService.grantConsent(request);
        return ResponseEntity.ok(ApiResponse.ok(record, "Consent granted successfully"));
    }

    @PostMapping("/break-glass")
    @Operation(summary = "Emergency override: Doctor accesses patient records during clinical emergency with mandatory justification")
    public ResponseEntity<ApiResponse<ConsentRecord>> breakGlass(@Valid @RequestBody BreakGlassRequest request) {
        ConsentRecord record = consentService.breakGlass(request);
        return ResponseEntity.ok(ApiResponse.ok(record, "Emergency access granted and recorded in audit log"));
    }

    @GetMapping("/check")
    @Operation(summary = "Check whether hospital has active consent for a patient")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkConsent(
            @RequestParam UUID patientId,
            @RequestParam UUID hospitalId) {
        boolean active = consentService.hasActiveConsent(patientId, hospitalId);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("hasConsent", active), "Consent status evaluated"));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get list of active and historical consents for a patient")
    public ResponseEntity<ApiResponse<List<ConsentRecord>>> getPatientConsents(@PathVariable UUID patientId) {
        return ResponseEntity.ok(ApiResponse.ok(consentService.getConsentsForPatient(patientId), "Consents retrieved"));
    }
}
