package com.dghs.healthcard.service;

import com.dghs.healthcard.domain.*;
import com.dghs.healthcard.dto.EncounterCreateRequest;
import com.dghs.healthcard.dto.MedicalTimelineDto;
import com.dghs.healthcard.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClinicalService {
    private final EncounterRepository encounterRepository;
    private final ConditionRepository conditionRepository;
    private final MedicationRepository medicationRepository;
    private final DiagnosticReportRepository diagnosticReportRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final AuditService auditService;

    public ClinicalService(EncounterRepository encounterRepository, ConditionRepository conditionRepository,
                           MedicationRepository medicationRepository, DiagnosticReportRepository diagnosticReportRepository,
                           PatientRepository patientRepository, HospitalRepository hospitalRepository,
                           DoctorRepository doctorRepository, AuditService auditService) {
        this.encounterRepository = encounterRepository;
        this.conditionRepository = conditionRepository;
        this.medicationRepository = medicationRepository;
        this.diagnosticReportRepository = diagnosticReportRepository;
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.auditService = auditService;
    }

    @Transactional
    public MedicalTimelineDto createEncounter(EncounterCreateRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + request.getPatientId()));
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found: " + request.getHospitalId()));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + request.getDoctorId()));

        Encounter encounter = Encounter.builder()
                .patient(patient)
                .hospital(hospital)
                .doctor(doctor)
                .encounterType(request.getEncounterType() != null ? request.getEncounterType() : "OPD")
                .visitDate(LocalDateTime.now())
                .chiefComplaint(request.getChiefComplaint())
                .clinicalNotes(request.getClinicalNotes())
                .build();

        encounter = encounterRepository.save(encounter);

        List<MedicalTimelineDto.ConditionDto> conditionDtos = new ArrayList<>();
        if (request.getConditions() != null) {
            for (EncounterCreateRequest.ConditionInput c : request.getConditions()) {
                ConditionRecord cond = ConditionRecord.builder()
                        .encounter(encounter)
                        .clinicalStatus(c.getClinicalStatus() != null ? c.getClinicalStatus() : "active")
                        .code(c.getCode())
                        .description(c.getDescription())
                        .notes(c.getNotes())
                        .recordedAt(LocalDateTime.now())
                        .build();
                cond = conditionRepository.save(cond);
                conditionDtos.add(new MedicalTimelineDto.ConditionDto(
                        cond.getId(), cond.getCode(), cond.getDescription(), cond.getClinicalStatus(), cond.getNotes()));
            }
        }

        List<MedicalTimelineDto.MedicationDto> medDtos = new ArrayList<>();
        if (request.getMedications() != null) {
            for (EncounterCreateRequest.MedicationInput m : request.getMedications()) {
                MedicationRecord med = MedicationRecord.builder()
                        .encounter(encounter)
                        .medicationName(m.getMedicationName())
                        .dosage(m.getDosage())
                        .frequency(m.getFrequency())
                        .duration(m.getDuration())
                        .instructions(m.getInstructions())
                        .prescribedAt(LocalDateTime.now())
                        .build();
                med = medicationRepository.save(med);
                medDtos.add(new MedicalTimelineDto.MedicationDto(
                        med.getId(), med.getMedicationName(), med.getDosage(), med.getFrequency(), med.getDuration(), med.getInstructions()));
            }
        }

        List<MedicalTimelineDto.DiagnosticReportDto> reportDtos = new ArrayList<>();
        if (request.getDiagnosticReports() != null) {
            for (EncounterCreateRequest.DiagnosticReportInput r : request.getDiagnosticReports()) {
                DiagnosticReportRecord report = DiagnosticReportRecord.builder()
                        .encounter(encounter)
                        .testCode(r.getTestCode())
                        .testName(r.getTestName())
                        .status(r.getStatus() != null ? r.getStatus() : "FINAL")
                        .issuedDate(LocalDateTime.now())
                        .resultSummary(r.getResultSummary())
                        .clinicalNotes(r.getClinicalNotes())
                        .build();
                report = diagnosticReportRepository.save(report);
                reportDtos.add(new MedicalTimelineDto.DiagnosticReportDto(
                        report.getId(), report.getTestCode(), report.getTestName(), report.getStatus(),
                        report.getIssuedDate(), report.getResultSummary(), report.getFileUrl(), report.getClinicalNotes()));
            }
        }

        auditService.logAccess(
                patient.getId(),
                "DOCTOR",
                doctor.getFullName(),
                hospital.getId(),
                "CREATE_ENCOUNTER",
                "Created new clinical encounter at " + hospital.getName()
        );

        return MedicalTimelineDto.builder()
                .encounterId(encounter.getId())
                .visitDate(encounter.getVisitDate())
                .encounterType(encounter.getEncounterType())
                .hospitalCode(hospital.getCode())
                .hospitalName(hospital.getName())
                .hospitalDistrict(hospital.getDistrict())
                .doctorName(doctor.getFullName())
                .doctorSpecialty(doctor.getSpecialty())
                .chiefComplaint(encounter.getChiefComplaint())
                .clinicalNotes(encounter.getClinicalNotes())
                .conditions(conditionDtos)
                .medications(medDtos)
                .diagnosticReports(reportDtos)
                .build();
    }

    public List<MedicalTimelineDto> getPatientTimeline(UUID patientId) {
        List<Encounter> encounters = encounterRepository.findByPatientIdOrderByVisitDateDesc(patientId);
        List<MedicalTimelineDto> timeline = new ArrayList<>();

        for (Encounter encounter : encounters) {
            List<ConditionRecord> conditions = conditionRepository.findByEncounterId(encounter.getId());
            List<MedicationRecord> medications = medicationRepository.findByEncounterId(encounter.getId());
            List<DiagnosticReportRecord> reports = diagnosticReportRepository.findByEncounterId(encounter.getId());

            timeline.add(MedicalTimelineDto.builder()
                    .encounterId(encounter.getId())
                    .visitDate(encounter.getVisitDate())
                    .encounterType(encounter.getEncounterType())
                    .hospitalCode(encounter.getHospital().getCode())
                    .hospitalName(encounter.getHospital().getName())
                    .hospitalDistrict(encounter.getHospital().getDistrict())
                    .doctorName(encounter.getDoctor().getFullName())
                    .doctorSpecialty(encounter.getDoctor().getSpecialty())
                    .chiefComplaint(encounter.getChiefComplaint())
                    .clinicalNotes(encounter.getClinicalNotes())
                    .conditions(conditions.stream().map(c -> new MedicalTimelineDto.ConditionDto(
                            c.getId(), c.getCode(), c.getDescription(), c.getClinicalStatus(), c.getNotes())).collect(Collectors.toList()))
                    .medications(medications.stream().map(m -> new MedicalTimelineDto.MedicationDto(
                            m.getId(), m.getMedicationName(), m.getDosage(), m.getFrequency(), m.getDuration(), m.getInstructions())).collect(Collectors.toList()))
                    .diagnosticReports(reports.stream().map(r -> new MedicalTimelineDto.DiagnosticReportDto(
                            r.getId(), r.getTestCode(), r.getTestName(), r.getStatus(), r.getIssuedDate(), r.getResultSummary(), r.getFileUrl(), r.getClinicalNotes())).collect(Collectors.toList()))
                    .build());
        }

        return timeline;
    }
}
