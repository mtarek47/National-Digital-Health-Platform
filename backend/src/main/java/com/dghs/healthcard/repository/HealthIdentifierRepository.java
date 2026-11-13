package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.HealthIdentifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HealthIdentifierRepository extends JpaRepository<HealthIdentifier, UUID> {
    Optional<HealthIdentifier> findByIdentifierValue(String identifierValue);
    Optional<HealthIdentifier> findByCardToken(String cardToken);
    Optional<HealthIdentifier> findByPatientId(UUID patientId);
}
