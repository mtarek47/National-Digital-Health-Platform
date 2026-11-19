package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, UUID> {
    @Query("SELECT a FROM AccessLog a WHERE a.patient.id = :patientId ORDER BY a.accessedAt DESC")
    List<AccessLog> findByPatientIdOrderByAccessedAtDesc(@Param("patientId") UUID patientId);

    List<AccessLog> findTop50ByOrderByAccessedAtDesc();
}
