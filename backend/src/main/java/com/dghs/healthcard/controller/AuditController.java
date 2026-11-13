package com.dghs.healthcard.controller;

import com.dghs.healthcard.common.ApiResponse;
import com.dghs.healthcard.domain.AccessLog;
import com.dghs.healthcard.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audits")
@Tag(name = "Audit & Provenance API", description = "Tamper-evident access and change logs for clinical data governance")
public class AuditController {
    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/recent")
    @Operation(summary = "Get the latest 50 access audit logs across the platform")
    public ResponseEntity<ApiResponse<List<AccessLog>>> getRecentLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getRecentLogs(), "Audit logs retrieved"));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get access audit trail for a specific patient")
    public ResponseEntity<ApiResponse<List<AccessLog>>> getPatientLogs(@PathVariable UUID patientId) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getLogsForPatient(patientId), "Patient audit trail retrieved"));
    }
}
