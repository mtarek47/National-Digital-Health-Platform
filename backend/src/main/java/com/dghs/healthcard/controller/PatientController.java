package com.dghs.healthcard.controller;

import com.dghs.healthcard.common.ApiResponse;
import com.dghs.healthcard.domain.Patient;
import com.dghs.healthcard.dto.DigitalHealthCardDto;
import com.dghs.healthcard.dto.PatientRegistrationRequest;
import com.dghs.healthcard.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patient & Health Card API", description = "Patient registration, identity management, and QR card lookup")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register new patient and issue National Digital Health Card")
    public ResponseEntity<ApiResponse<DigitalHealthCardDto>> register(@Valid @RequestBody PatientRegistrationRequest request) {
        DigitalHealthCardDto card = patientService.registerPatient(request);
        return ResponseEntity.ok(ApiResponse.ok(card, "Patient registered and Health Card issued successfully"));
    }

    @GetMapping
    @Operation(summary = "List all patients")
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.ok(patientService.getAllPatients(), "Fetched patients"));
    }

    @GetMapping("/{patientId}/card")
    @Operation(summary = "Get Digital Health Card by Patient ID")
    public ResponseEntity<ApiResponse<DigitalHealthCardDto>> getCardByPatientId(@PathVariable UUID patientId) {
        return patientService.getCardByPatientId(patientId)
                .map(card -> ResponseEntity.ok(ApiResponse.ok(card, "Health card found")))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/card/by-token/{token}")
    @Operation(summary = "Resolve Health Card by scanned QR token")
    public ResponseEntity<ApiResponse<DigitalHealthCardDto>> getCardByToken(@PathVariable String token) {
        return patientService.getCardByToken(token)
                .map(card -> ResponseEntity.ok(ApiResponse.ok(card, "Health card verified from QR token")))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/card/by-health-id/{healthId}")
    @Operation(summary = "Resolve Health Card by Health ID (e.g. HID-2026-884219)")
    public ResponseEntity<ApiResponse<DigitalHealthCardDto>> getCardByHealthId(@PathVariable String healthId) {
        return patientService.getCardByHealthId(healthId)
                .map(card -> ResponseEntity.ok(ApiResponse.ok(card, "Health card found")))
                .orElse(ResponseEntity.notFound().build());
    }
}
