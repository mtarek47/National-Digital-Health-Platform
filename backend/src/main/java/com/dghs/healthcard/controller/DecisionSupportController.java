package com.dghs.healthcard.controller;

import com.dghs.healthcard.common.ApiResponse;
import com.dghs.healthcard.dto.DuplicateCheckResponse;
import com.dghs.healthcard.service.DecisionSupportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/decision-support")
@Tag(name = "Clinical Decision Support API", description = "Duplicate test detection alerts and recommendations")
public class DecisionSupportController {
    private final DecisionSupportService decisionSupportService;

    public DecisionSupportController(DecisionSupportService decisionSupportService) {
        this.decisionSupportService = decisionSupportService;
    }

    @GetMapping("/check-duplicate-test")
    @Operation(summary = "Check whether a diagnostic test was already performed recently to prevent duplicates")
    public ResponseEntity<ApiResponse<DuplicateCheckResponse>> checkDuplicate(
            @RequestParam UUID patientId,
            @RequestParam String testCode) {
        DuplicateCheckResponse response = decisionSupportService.checkDuplicateTest(patientId, testCode);
        return ResponseEntity.ok(ApiResponse.ok(response, "Duplicate test verification completed"));
    }
}
