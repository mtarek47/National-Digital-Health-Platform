package com.dghs.healthcard.controller;

import com.dghs.healthcard.service.FhirService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/fhir/r4")
@Tag(name = "HL7 FHIR R4 Interoperability API", description = "FHIR compliant resources for Bangladesh DGHS Shared Health Record (SHR)")
public class FhirController {
    private final FhirService fhirService;

    public FhirController(FhirService fhirService) {
        this.fhirService = fhirService;
    }

    @GetMapping(value = "/Patient/{id}", produces = "application/fhir+json;charset=UTF-8")
    @Operation(summary = "Get standard FHIR R4 Patient Resource")
    public ResponseEntity<String> getPatientFhir(@PathVariable UUID id) {
        String json = fhirService.getPatientAsFhirJson(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/fhir+json"))
                .body(json);
    }

    @GetMapping(value = "/Patient/{id}/$everything", produces = "application/fhir+json;charset=UTF-8")
    @Operation(summary = "Get complete patient medical record as standard FHIR R4 Document Bundle")
    public ResponseEntity<String> getPatientBundleFhir(@PathVariable UUID id) {
        String json = fhirService.getPatientBundleAsFhirJson(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/fhir+json"))
                .body(json);
    }
}
