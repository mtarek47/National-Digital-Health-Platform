package com.dghs.healthcard.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "hospitals")
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String facilityType;

    @Column(length = 100)
    private String district;

    public Hospital() {}

    public Hospital(UUID id, String code, String name, String facilityType, String district) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.facilityType = facilityType;
        this.district = district;
    }

    public static HospitalBuilder builder() { return new HospitalBuilder(); }

    public static class HospitalBuilder {
        private UUID id;
        private String code;
        private String name;
        private String facilityType;
        private String district;

        public HospitalBuilder id(UUID id) { this.id = id; return this; }
        public HospitalBuilder code(String code) { this.code = code; return this; }
        public HospitalBuilder name(String name) { this.name = name; return this; }
        public HospitalBuilder facilityType(String facilityType) { this.facilityType = facilityType; return this; }
        public HospitalBuilder district(String district) { this.district = district; return this; }
        public Hospital build() { return new Hospital(id, code, name, facilityType, district); }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getFacilityType() { return facilityType; }
    public void setFacilityType(String facilityType) { this.facilityType = facilityType; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
}
