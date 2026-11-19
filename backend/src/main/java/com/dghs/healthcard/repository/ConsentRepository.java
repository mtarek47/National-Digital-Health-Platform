package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.ConsentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConsentRepository extends JpaRepository<ConsentRecord, UUID> {
    @Query("SELECT c FROM ConsentRecord c WHERE c.patient.id = :patientId ORDER BY c.validFrom DESC")
    List<ConsentRecord> findByPatientIdOrderByValidFromDesc(@Param("patientId") UUID patientId);

    @Query("SELECT c FROM ConsentRecord c WHERE c.patient.id = :patientId " +
           "AND c.status = 'ACTIVE' AND c.validUntil > :now " +
           "AND (c.hospital.id = :hospitalId OR c.hospital IS NULL)")
    List<ConsentRecord> findActiveConsentsForHospital(
            @Param("patientId") UUID patientId,
            @Param("hospitalId") UUID hospitalId,
            @Param("now") LocalDateTime now);
}
