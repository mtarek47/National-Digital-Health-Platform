package com.dghs.healthcard.controller;

import com.dghs.healthcard.common.ApiResponse;
import com.dghs.healthcard.domain.Doctor;
import com.dghs.healthcard.domain.Hospital;
import com.dghs.healthcard.repository.DoctorRepository;
import com.dghs.healthcard.repository.HospitalRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/facilities")
@Tag(name = "Facilities & Providers API", description = "Hospitals and doctors registration and lookup")
public class FacilityController {
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    public FacilityController(HospitalRepository hospitalRepository, DoctorRepository doctorRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/hospitals")
    @Operation(summary = "List all participating hospitals")
    public ResponseEntity<ApiResponse<List<Hospital>>> getHospitals() {
        return ResponseEntity.ok(ApiResponse.ok(hospitalRepository.findAll(), "Participating hospitals retrieved"));
    }

    @GetMapping("/hospitals/{hospitalId}/doctors")
    @Operation(summary = "List doctors affiliated with a hospital")
    public ResponseEntity<ApiResponse<List<Doctor>>> getDoctorsByHospital(@PathVariable UUID hospitalId) {
        return ResponseEntity.ok(ApiResponse.ok(doctorRepository.findByHospitalId(hospitalId), "Doctors retrieved"));
    }

    @GetMapping("/doctors")
    @Operation(summary = "List all doctors")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.ok(doctorRepository.findAll(), "All doctors retrieved"));
    }
}
