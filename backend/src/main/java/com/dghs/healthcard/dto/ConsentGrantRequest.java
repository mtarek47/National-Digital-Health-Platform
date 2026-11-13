package com.dghs.healthcard.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ConsentGrantRequest {
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    private UUID hospitalId;
    private UUID doctorId;
    private Integer durationHours;
    private String scope;
    private String purpose;

    public ConsentGrantRequest() {}

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    public UUID getHospitalId() { return hospitalId; }
    public void setHospitalId(UUID hospitalId) { this.hospitalId = hospitalId; }
    public UUID getDoctorId() { return doctorId; }
    public void setDoctorId(UUID doctorId) { this.doctorId = doctorId; }
    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }
    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
