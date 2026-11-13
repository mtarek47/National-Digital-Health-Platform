package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.ConditionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ConditionRepository extends JpaRepository<ConditionRecord, UUID> {
    List<ConditionRecord> findByEncounterId(UUID encounterId);
    List<ConditionRecord> findByEncounterPatientIdOrderByRecordedAtDesc(UUID patientId);
}
