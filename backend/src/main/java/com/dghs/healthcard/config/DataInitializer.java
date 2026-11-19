package com.dghs.healthcard.config;

import com.dghs.healthcard.domain.*;
import com.dghs.healthcard.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final HealthIdentifierRepository healthIdentifierRepository;
    private final EncounterRepository encounterRepository;
    private final ConditionRepository conditionRepository;
    private final MedicationRepository medicationRepository;
    private final DiagnosticReportRepository diagnosticReportRepository;
    private final AccessLogRepository accessLogRepository;

    public DataInitializer(HospitalRepository hospitalRepository, DoctorRepository doctorRepository,
                           PatientRepository patientRepository, HealthIdentifierRepository healthIdentifierRepository,
                           EncounterRepository encounterRepository, ConditionRepository conditionRepository,
                           MedicationRepository medicationRepository, DiagnosticReportRepository diagnosticReportRepository,
                           AccessLogRepository accessLogRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.healthIdentifierRepository = healthIdentifierRepository;
        this.encounterRepository = encounterRepository;
        this.conditionRepository = conditionRepository;
        this.medicationRepository = medicationRepository;
        this.diagnosticReportRepository = diagnosticReportRepository;
        this.accessLogRepository = accessLogRepository;
    }

    @Override
    public void run(String... args) {
        if (hospitalRepository.count() > 0) {
            log.info("Database already seeded with demo data.");
            return;
        }

        log.info("Seeding National Digital Health Card demo data...");

        // 1. Seed Participating Hospitals
        Hospital dmch = hospitalRepository.save(Hospital.builder()
                .code("DMCH-01")
                .name("Dhaka Medical College Hospital (Hospital A)")
                .facilityType("Tertiary Government Hospital")
                .district("Dhaka")
                .build());

        Hospital cmch = hospitalRepository.save(Hospital.builder()
                .code("CMCH-02")
                .name("Chittagong Medical College Hospital (Hospital B)")
                .facilityType("Tertiary Government Hospital")
                .district("Chittagong")
                .build());

        hospitalRepository.save(Hospital.builder()
                .code("BSH-03")
                .name("Bangabandhu Sheikh Mujib Medical University (BSMMU)")
                .facilityType("Specialized University Hospital")
                .district("Dhaka")
                .build());

        // 2. Seed Doctors
        Doctor drAnisur = doctorRepository.save(Doctor.builder()
                .hospital(dmch)
                .bmdcRegNumber("A-54912")
                .fullName("Prof. Dr. Anisur Rahman")
                .specialty("Internal Medicine & Cardiology")
                .email("dr.anisur@dmch.gov.bd")
                .build());

        doctorRepository.save(Doctor.builder()
                .hospital(cmch)
                .bmdcRegNumber("A-68201")
                .fullName("Dr. Fahmida Sultana")
                .specialty("General Medicine & Diabetology")
                .email("dr.fahmida@cmch.gov.bd")
                .build());

        // 3. Seed Synthetic Patient (Rahim Uddin)
        Patient rahim = patientRepository.save(Patient.builder()
                .fullName("Rahim Uddin")
                .dateOfBirth(LocalDate.of(1985, 6, 15))
                .gender("Male")
                .phone("01711-234567")
                .nidMasked("***-***-5421")
                .bloodGroup("O+")
                .emergencyContact("01819-876543 (Wife: Salma Begum)")
                .address("Sector 4, Uttara, Dhaka")
                .createdAt(LocalDateTime.now().minusDays(10))
                .build());

        // 4. Seed Digital Health Card & Identifier
        String cardToken = "HC-DEMO-RAHIM-2026-X88";
        healthIdentifierRepository.save(HealthIdentifier.builder()
                .patient(rahim)
                .identifierValue("HID-2026-884219")
                .cardToken(cardToken)
                .status("ACTIVE")
                .issuedAt(LocalDateTime.now().minusDays(10))
                .build());

        // 5. Seed Historical Encounter at Hospital A (DMCH) - 5 days ago
        Encounter encDmch = encounterRepository.save(Encounter.builder()
                .patient(rahim)
                .hospital(dmch)
                .doctor(drAnisur)
                .encounterType("OPD")
                .visitDate(LocalDateTime.now().minusDays(5))
                .chiefComplaint("Polyuria, fatigue, and occasional chest discomfort on exertion")
                .clinicalNotes("Patient presented with 2-month history of uncontrolled blood glucose. Fasting blood sugar elevated. Recommended lifestyle modification and dual oral antidiabetic therapy.")
                .build());

        conditionRepository.save(ConditionRecord.builder()
                .encounter(encDmch)
                .clinicalStatus("active")
                .code("E11.9")
                .description("Type 2 Diabetes Mellitus without complications")
                .notes("Diagnosed during outpatient screening")
                .recordedAt(LocalDateTime.now().minusDays(5))
                .build());

        conditionRepository.save(ConditionRecord.builder()
                .encounter(encDmch)
                .clinicalStatus("active")
                .code("I10")
                .description("Essential (Primary) Hypertension")
                .notes("BP: 145/92 mmHg")
                .recordedAt(LocalDateTime.now().minusDays(5))
                .build());

        medicationRepository.save(MedicationRecord.builder()
                .encounter(encDmch)
                .medicationName("Tab. Metformin HCl")
                .dosage("500mg")
                .frequency("1+0+1")
                .duration("30 days")
                .instructions("Take with or after main meals")
                .prescribedAt(LocalDateTime.now().minusDays(5))
                .build());

        medicationRepository.save(MedicationRecord.builder()
                .encounter(encDmch)
                .medicationName("Tab. Amlodipine")
                .dosage("5mg")
                .frequency("0+0+1")
                .duration("30 days")
                .instructions("Take at bedtime daily")
                .prescribedAt(LocalDateTime.now().minusDays(5))
                .build());

        diagnosticReportRepository.save(DiagnosticReportRecord.builder()
                .encounter(encDmch)
                .testCode("HBA1C")
                .testName("HbA1c (Glycated Hemoglobin)")
                .status("FINAL")
                .issuedDate(LocalDateTime.now().minusDays(5))
                .resultSummary("7.4% (Standard Reference: < 6.5% Normal)")
                .clinicalNotes("Indicates moderately poor glycemic control over previous 3 months")
                .build());

        diagnosticReportRepository.save(DiagnosticReportRecord.builder()
                .encounter(encDmch)
                .testCode("SERUM_CREATININE")
                .testName("Serum Creatinine & eGFR")
                .status("FINAL")
                .issuedDate(LocalDateTime.now().minusDays(5))
                .resultSummary("Creatinine: 1.05 mg/dL, eGFR: 88 mL/min/1.73m² (Normal renal clearance)")
                .clinicalNotes("Renal parameters within acceptable baseline before metformin therapy")
                .build());

        diagnosticReportRepository.save(DiagnosticReportRecord.builder()
                .encounter(encDmch)
                .testCode("MRI_BRAIN")
                .testName("MRI of Brain & Cranium (1.5T with Contrast)")
                .status("FINAL")
                .issuedDate(LocalDateTime.now().minusDays(5))
                .resultSummary("Normal cerebral parenchyma. No acute intracranial hemorrhage, mass effect, or territorial infarction. Ventricular size normal for age. PACS Series #MR-2026-9041.")
                .fileUrl("https://pacs.dmch.gov.bd/studies/mri-brain-2026-9041")
                .clinicalNotes("Siemens Magnetom 1.5T; T1/T2 FLAIR, DWI and MRA sequences reviewed. Validated in National SHR under IOM Non-Redundant Result Management standards.")
                .build());

        // 6. Log Initial Audit Record
        accessLogRepository.save(AccessLog.builder()
                .patient(rahim)
                .actorType("DOCTOR")
                .actorName("Prof. Dr. Anisur Rahman")
                .hospital(dmch)
                .action("CREATE_ENCOUNTER")
                .justification("Initial registration and OPD diagnostic workup")
                .accessedAt(LocalDateTime.now().minusDays(5))
                .build());

        log.info("Demo data seeding completed! Rahim Uddin Health ID: HID-2026-884219, Token: {}", cardToken);
    }
}
