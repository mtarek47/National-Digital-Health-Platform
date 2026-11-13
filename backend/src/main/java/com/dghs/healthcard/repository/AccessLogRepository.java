package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, UUID> {
    List<AccessLog> findByPatientIdOrderByAccessedAtDesc(UUID patientId);
    List<AccessLog> findTop50ByOrderByAccessedAtDesc();
}
