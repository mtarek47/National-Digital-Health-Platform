package com.dghs.healthcard.service;

import com.dghs.healthcard.domain.*;
import com.dghs.healthcard.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FhirService {
    private final PatientRepository patientRepository;
    private final HealthIdentifierRepository healthIdentifierRepository;
    private final EncounterRepository encounterRepository;
    private final ConditionRepository conditionRepository;
    private final MedicationRepository medicationRepository;
    private final DiagnosticReportRepository diagnosticReportRepository;

    private final ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);

    public FhirService(PatientRepository patientRepository, HealthIdentifierRepository healthIdentifierRepository,
                       EncounterRepository encounterRepository, ConditionRepository conditionRepository,
                       MedicationRepository medicationRepository, DiagnosticReportRepository diagnosticReportRepository) {
        this.patientRepository = patientRepository;
        this.healthIdentifierRepository = healthIdentifierRepository;
        this.encounterRepository = encounterRepository;
        this.conditionRepository = conditionRepository;
        this.medicationRepository = medicationRepository;
        this.diagnosticReportRepository = diagnosticReportRepository;
    }

    public String getPatientAsFhirJson(UUID patientId) {
        try {
            Patient p = patientRepository.findById(patientId)
                    .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
            HealthIdentifier hid = healthIdentifierRepository.findByPatientId(patientId).orElse(null);

            Map<String, Object> fhirPatient = buildPatientResource(p, hid);
            return objectMapper.writeValueAsString(fhirPatient);
        } catch (Exception e) {
            throw new RuntimeException("Error serializing FHIR Patient", e);
        }
    }

    public String getPatientBundleAsFhirJson(UUID patientId) {
        try {
            Patient p = patientRepository.findById(patientId)
                    .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
            HealthIdentifier hid = healthIdentifierRepository.findByPatientId(patientId).orElse(null);

            Map<String, Object> bundle = new LinkedHashMap<>();
            bundle.put("resourceType", "Bundle");
            bundle.put("id", UUID.randomUUID().toString());
            bundle.put("meta", Map.of("lastUpdated", java.time.Instant.now().toString()));
            bundle.put("type", "document");

            List<Map<String, Object>> entries = new ArrayList<>();

            entries.add(wrapEntry(buildPatientResource(p, hid)));

            List<Encounter> encounters = encounterRepository.findByPatientIdOrderByVisitDateDesc(patientId);
            for (Encounter enc : encounters) {
                entries.add(wrapEntry(buildEncounterResource(enc, p)));

                List<ConditionRecord> conditions = conditionRepository.findByEncounterId(enc.getId());
                for (ConditionRecord cond : conditions) {
                    entries.add(wrapEntry(buildConditionResource(cond, p)));
                }

                List<MedicationRecord> medications = medicationRepository.findByEncounterId(enc.getId());
                for (MedicationRecord med : medications) {
                    entries.add(wrapEntry(buildMedicationResource(med, p)));
                }

                List<DiagnosticReportRecord> reports = diagnosticReportRepository.findByEncounterId(enc.getId());
                for (DiagnosticReportRecord rep : reports) {
                    entries.add(wrapEntry(buildDiagnosticReportResource(rep, p)));
                }
            }

            bundle.put("total", entries.size());
            bundle.put("entry", entries);

            return objectMapper.writeValueAsString(bundle);
        } catch (Exception e) {
            throw new RuntimeException("Error generating FHIR Bundle", e);
        }
    }

    private Map<String, Object> wrapEntry(Map<String, Object> resource) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("fullUrl", "urn:uuid:" + resource.get("id"));
        entry.put("resource", resource);
        return entry;
    }

    private Map<String, Object> buildPatientResource(Patient p, HealthIdentifier hid) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("resourceType", "Patient");
        map.put("id", p.getId().toString());

        List<Map<String, String>> identifiers = new ArrayList<>();
        if (hid != null) {
            identifiers.add(Map.of(
                    "system", "https://dghs.gov.bd/fhir/identifier/health-id",
                    "value", hid.getIdentifierValue(),
                    "use", "official"
            ));
        }
        if (p.getNidMasked() != null) {
            identifiers.add(Map.of(
                    "system", "https://nidw.gov.bd/fhir/identifier/nid-masked",
                    "value", p.getNidMasked()
            ));
        }
        map.put("identifier", identifiers);

        map.put("name", List.of(Map.of(
                "use", "official",
                "text", p.getFullName()
        )));

        if (p.getGender() != null) {
            map.put("gender", p.getGender().toLowerCase());
        }
        if (p.getDateOfBirth() != null) {
            map.put("birthDate", p.getDateOfBirth().toString());
        }
        if (p.getPhone() != null) {
            map.put("telecom", List.of(Map.of("system", "phone", "value", p.getPhone())));
        }
        if (p.getAddress() != null) {
            map.put("address", List.of(Map.of("text", p.getAddress())));
        }

        return map;
    }

    private Map<String, Object> buildEncounterResource(Encounter enc, Patient p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("resourceType", "Encounter");
        map.put("id", enc.getId().toString());
        map.put("status", "finished");
        map.put("class", Map.of(
                "system", "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code", "AMB",
                "display", "Ambulatory Outpatient"
        ));
        map.put("subject", Map.of("reference", "Patient/" + p.getId(), "display", p.getFullName()));
        map.put("serviceProvider", Map.of("display", enc.getHospital().getName()));
        map.put("participant", List.of(Map.of(
                "individual", Map.of("display", enc.getDoctor().getFullName() + " (" + enc.getDoctor().getSpecialty() + ")")
        )));
        map.put("period", Map.of("start", enc.getVisitDate().toString()));
        return map;
    }

    private Map<String, Object> buildConditionResource(ConditionRecord cond, Patient p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("resourceType", "Condition");
        map.put("id", cond.getId().toString());
        map.put("clinicalStatus", Map.of(
                "coding", List.of(Map.of(
                        "system", "http://terminology.hl7.org/CodeSystem/condition-clinical",
                        "code", cond.getClinicalStatus() != null ? cond.getClinicalStatus() : "active"
                ))
        ));
        map.put("code", Map.of(
                "coding", List.of(Map.of(
                        "system", "http://hl7.org/fhir/sid/icd-10",
                        "code", cond.getCode() != null ? cond.getCode() : "R69"
                )),
                "text", cond.getDescription()
        ));
        map.put("subject", Map.of("reference", "Patient/" + p.getId()));
        return map;
    }

    private Map<String, Object> buildMedicationResource(MedicationRecord med, Patient p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("resourceType", "MedicationRequest");
        map.put("id", med.getId().toString());
        map.put("status", "active");
        map.put("intent", "order");
        map.put("subject", Map.of("reference", "Patient/" + p.getId()));
        map.put("medicationCodeableConcept", Map.of(
                "text", med.getMedicationName() + " " + (med.getDosage() != null ? med.getDosage() : "")
        ));
        map.put("dosageInstruction", List.of(Map.of(
                "text", String.format("%s for %s (%s)", 
                        med.getFrequency() != null ? med.getFrequency() : "As directed",
                        med.getDuration() != null ? med.getDuration() : "Ongoing",
                        med.getInstructions() != null ? med.getInstructions() : "Take with water")
        )));
        return map;
    }

    private Map<String, Object> buildDiagnosticReportResource(DiagnosticReportRecord rep, Patient p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("resourceType", "DiagnosticReport");
        map.put("id", rep.getId().toString());
        map.put("status", rep.getStatus() != null ? rep.getStatus().toLowerCase() : "final");
        map.put("code", Map.of(
                "coding", List.of(Map.of("system", "https://dghs.gov.bd/fhir/codes/tests", "code", rep.getTestCode())),
                "text", rep.getTestName()
        ));
        map.put("subject", Map.of("reference", "Patient/" + p.getId()));
        map.put("effectiveDateTime", rep.getIssuedDate().toString());
        map.put("conclusion", rep.getResultSummary());
        return map;
    }
}
