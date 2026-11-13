package com.dghs.healthcard.repository;

import com.dghs.healthcard.domain.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Optional<Doctor> findByBmdcRegNumber(String bmdcRegNumber);
    List<Doctor> findByHospitalId(UUID hospitalId);
}
