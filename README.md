# 🇧🇩 National Digital Health Platform (NDHP)
### *Centralized Longitudinal EHR, Health Information Exchange (HIE) & HL7® FHIR® R4 Ecosystem*
**Directorate General of Health Services (DGHS) • Ministry of Health and Family Welfare, Government of Bangladesh**

---

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.4.2-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange?logo=openjdk)](https://www.oracle.com/java/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![HL7 FHIR R4](https://img.shields.io/badge/HL7%20FHIR-R4%20Standard-firebrick?logo=hl7)](https://hl7.org/fhir/R4/)
[![Docker Compose](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT%20%2F%20DGHS-blueviolet)](#license)

---

## 📖 Executive Summary

The **National Digital Health Platform (NDHP)** is an enterprise-grade, nationwide electronic healthcare backbone engineered for the Directorate General of Health Services (DGHS), Bangladesh. It addresses historic healthcare fragmentation by unifying multi-facility patient encounters into a single, immutable, longitudinal health record accessed through a **Biometric Digital Health Card**.

The architecture adheres strictly to the **Institute of Medicine (IOM) 8 Core Functions of an EHR** and the **HL7® FHIR® R4** interoperability standard, delivering seamless cross-hospital communication between major tertiary hospitals—such as **Dhaka Medical College Hospital (DMCH)** and **Chittagong Medical College Hospital (CMCH)**—while preventing diagnostic redundancy and protecting patient privacy.

---

## 🏛️ The Core Anatomy of an EHR (IOM 8-Pillars Alignment)

The platform is designed and centralized directly from the Institute of Medicine (IOM) Electronic Health Record Anatomy model:

```
                                  ┌──────────────────────────────────────────────┐
                                  │      NATIONAL DIGITAL HEALTH PLATFORM        │
                                  │           Centralized IOM EHR Hub            │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                ┌────────────────────────┬───────────────┴───────────────┬────────────────────────┐
                │                        │                               │                        │
       ┌────────┴────────┐      ┌────────┴────────┐             ┌────────┴────────┐      ┌────────┴────────┐
       │ 1. Health Info  │      │ 2. Results &    │             │ 3. Order Mgmt   │      │ 4. Decision     │
       │    & Data       │      │    1.5T MRI PACS│             │    (CPOE)       │      │    Support(CDSS)│
       │ • ICD-10 Codes  │      │ • 16-Slice MRI  │             │ • E-Prescribe   │      │ • Redundancy Blk│
       │ • Vitals/Allergy│      │ • HbA1c/Creatine│             │ • Lab/Rad Order │      │ • Drug-Drug Pre │
       └─────────────────┘      └─────────────────┘             └─────────────────┘      └─────────────────┘
                │                        │                               │                        │
                ├────────────────────────┼───────────────────────────────┼────────────────────────┤
                │                        │                               │                        │
       ┌────────┴────────┐      ┌────────┴────────┐             ┌────────┴────────┐      ┌────────┴────────┐
       │ 5. Electronic   │      │ 6. Patient      │             │ 7. Admin &      │      │ 8. Population   │
       │    Comm. (HIE)  │      │    Support      │             │    Claims       │      │    Health       │
       │ • HL7 FHIR R4   │      │ • Telemonitor   │             │ • Smart Card    │      │ • DGHS Radar    │
       │ • DMCH ⇄ CMCH   │      │ • Education     │             │ • Out-of-Pocket │      │ • Biosurveillanc│
       └─────────────────┘      └─────────────────┘             └─────────────────┘      └─────────────────┘
```

### 1. Health Information & Data
* Computable, structured problem list categorized with **ICD-10 clinical coding** (e.g., `E11.9` for Type 2 Diabetes, `I10` for Essential Primary Hypertension).
* Discrete longitudinal vitals (Blood Pressure, Fasting Blood Glucose, BMI) and active drug allergies (e.g., Penicillin/Beta-lactams).

### 2. Result Management & Diagnostic Imaging (1.5T MRI PACS)
* Web-native **16-Slice 1.5 Tesla Superconducting Brain MRI (PACS DICOM Viewer)** featuring interactive slice scrolling, windowing (brightness/contrast), magnification, and cine playback.
* Standardized lab panels (HbA1c 7.4%, Serum Creatinine 0.9 mg/dL, Fasting Blood Sugar 8.9 mmol/L).

### 3. Order Management (Computerized Physician Order Entry - CPOE)
* Physician workstation for ordering medications, diagnostic imaging, and laboratory tests with mandatory electronic timestamps and attending physician attribution.

### 4. Decision Support System (CDSS)
* **Non-Redundant Diagnostic Protection:** Intercepts redundant repeat testing across hospitals. For example, when a patient presents at CMCH 5 days after a Brain MRI at DMCH, CDSS flags the duplicate and provides the existing scan, saving **৳8,500** out-of-pocket costs.
* **Drug Interaction & Precaution Engines:** Alerts for Metformin + IV Gadolinium contrast renal verification (`eGFR > 60 mL/min`).
* **Preventative Care Reminders:** Prompts for annual diabetic retinopathy screenings.

### 5. Electronic Communication & Interoperability (HIE)
* National **Health Information Exchange (HIE)** synchronizing tertiary hospitals over a secure enterprise message bus.
* Direct RESTful export of **HL7 FHIR R4** resource bundles (`Patient`, `Condition`, `Observation`, `DiagnosticReport`, `MedicationRequest`).

### 6. Patient Support & Telemonitoring
* Continuous remote chronic care logging for home glucometers and automated blood pressure cuffs.
* Bilingual patient educational guidelines (Bengali & English) for lifestyle and dietary management.

### 7. Administrative Processes & Claims
* National Health Card verification against biometric NID databases.
* Transparent billing breakdowns displaying standard charges, non-redundant savings, government DGHS subsidies, and final patient copay.

### 8. Reporting & Population Health
* Automated disease biosurveillance radar tracking Dengue outbreaks, diabetes prevalence, and SDG-3 health indicator compliance.

---

## 💻 System Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19.3 + TypeScript** | Modern component tree, high performance, strict typing |
| **Build & Tooling** | **Vite 8.3** | Lightning-fast HMR (<400ms builds), zero bundle bloat |
| **Styling & Icons** | **Tailwind CSS 4.0 + Lucide React** | Enterprise medical dashboard palette, responsive layout |
| **Backend Framework** | **Spring Boot 3.4.2 (Java 21 LTS)** | Virtual Threads, RESTful services, declarative transactions |
| **Database & Persistence** | **PostgreSQL 16 / H2 Database** | Robust relational persistence with in-memory dev profile |
| **API Standards** | **HL7® FHIR® R4 & OpenAPI 3.0** | Universal health data schema, auto-generated Swagger UI |
| **Security & Audits** | **Spring Security + JPA Audit Ledger** | Immutable access history, patient-controlled consent, break-glass |
| **Containerization** | **Docker & Docker Compose** | Multi-stage production container images |

---

## 🎨 Enterprise UI: Collapsible Sidebar Drawer System

The frontend features an ergonomic, dual-mode **Sidebar Drawer Navigation System** modeled after premier clinical software (Epic Hyperspace, Cerner Millennium):

```
┌───────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ 🏥 DGHS PLATFORM   [EHR]                [ < ] │ 📂 DGHS Ecosystem / Clinical Cockpit / Comprehensive   │
├───────────────────────────────────────────────┤    EHR Hub / 🔬 Result Management                      │
│ CLINICAL COCKPIT              [IOM 8-PILLARS] ├────────────────────────────────────────────────────────┤
│ 🌐 Comprehensive EHR Hub           [8 Pillars]│                                                        │
│   ├── 🗺️ Overview & Blueprint       [IOM Map] │              FULL-WIDTH CLINICAL WORKSPACE             │
│   ├── 🔬 Result Management          [1.5T PACS│       (100% Panoramic Canvas, Zero Clutter)            │
│   ├── 🔔 Decision Support           [3 Alerts]│                                                        │
│   ├── 📋 Order Management           [Signed]  │ 🧠 16-Slice Interactive PACS Brain MRI Viewer          │
│   ├── 📊 Health Information & Data  [Synced]  │ 🧪 HbA1c & Fasting Glucose Comprehensive Panels        │
│   ├── 🌐 Electronic Communication   [HIE Live]│ 🛡️ CDSS Duplicate Test Interception (৳8,500 Saved)    │
│   ├── 🩺 Patient Support            [Tracked] │                                                        │
│   ├── 💳 Administrative Processes   [Eligible]│                                                        │
│   └── 📈 Population Health & Radar  [DGHS]    │                                                        │
│                                               │                                                        │
│ 🩺 Doctor CPOE & CDSS               [3 Alerts]│                                                        │
│ 💳 Patient Health Card              [SmartCard│                                                        │
├───────────────────────────────────────────────┤                                                        │
│ INTEROPERABILITY & AUDITS                     │                                                        │
│ ⚡ HL7 FHIR R4 Inspector            [Interoper│                                                        │
│ 🛡️ Central Audit Ledger             [10 Logs] │                                                        │
├───────────────────────────────────────────────┤                                                        │
│ 👤 Rahim Uddin (HID-2026-884219)          [📋]│                                                        │
│ 🟢 Spring Boot 3 Live (Port 8081)         v2.4│                                                        │
└───────────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

* **Accordion Submenu:** The 8 IOM pillars and the Architecture Blueprint are nested cleanly under *Comprehensive EHR Hub* inside the sidebar drawer.
* **100% Full-Width Workspace:** Internal redundant option rails have been eliminated inside the dashboard, maximizing reading area for MRI scans and clinical charts.
* **Dual-Mode Ergonomics:** Smooth toggle between full expanded mode (320px) and icon-only collapsed mode (80px).
* **Active Patient Dock:** Real-time subject indicator (`Rahim Uddin`, `HID-2026-884219`, `Blood O+`) with instant clipboard copy.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Java 21 LTS JDK** installed ([Eclipse Temurin](https://adoptium.net/) or Oracle JDK)
* **Node.js (v18+) & npm** ([NodeJS.org](https://nodejs.org/))
* **Git** installed

---

### Option 1: Running with Docker Compose (Recommended)

To run the entire ecosystem (PostgreSQL, Spring Boot Backend, and React Frontend) in one command:

```bash
# Clone the repository
git clone https://github.com/mtarek47/National-Digital-Health-Platform.git
cd National-Digital-Health-Platform

# Start all microservices via Docker Compose
docker compose up --build
```
* **Frontend Portal:** `http://localhost:3000`
* **Backend API & Swagger:** `http://localhost:8081/swagger-ui.html`

---

### Option 2: Running Locally for Development

#### Step 1: Start the Spring Boot Backend (Port 8081)
```bash
cd backend

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```
> The backend boots with the pre-configured `dev` profile using in-memory H2 database seeded with DGHS demo records, patients, and 1.5T Brain MRI studies.

#### Step 2: Start the Vite Frontend (Port 3000)
```bash
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 📡 Key REST & HL7 FHIR R4 Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/patients/health-id/{hid}` | Lookup Digital Health Card by national health identifier |
| `GET` | `/api/clinical/timeline/{patientId}` | Retrieve full cross-hospital longitudinal medical timeline |
| `GET` | `/api/facilities/hospitals` | List all connected tertiary hospitals (DMCH, CMCH, BSMMU) |
| `POST` | `/api/clinical/encounters` | Record a new CPOE hospital consultation encounter |
| `POST` | `/api/cdss/check-duplicate` | Query CDSS engine for diagnostic redundancy and cost savings |
| `POST` | `/api/consent/grant` | Grant time-bound clinical consent for hospital access |
| `GET` | `/api/audits/patient/{patientId}` | View tamper-evident access log history for a patient |
| `GET` | `/fhir/Patient/{id}` | Export HL7 FHIR R4 compliant `Patient` resource |
| `GET` | `/fhir/Bundle/{patientId}` | Export complete FHIR R4 Clinical Record Bundle |

---

## 🔒 Security, Consent & Privacy Architecture

1. **Role-Based Access Control (RBAC):** Restricts CPOE prescribing to accredited doctors, while patients retain granular consent management.
2. **Time-Bound Consent Protocols:** Patients authorize attending clinicians for configurable durations (e.g., 2 hours, 24 hours, emergency).
3. **Break-Glass Emergency Protocol:** Emergency clinicians can bypass standard consent by submitting a mandatory legal clinical justification, triggering an immediate immutable audit entry.
4. **Tamper-Evident National Audit Ledger:** Every cross-facility query, record fetch, and medication order is permanently logged with timestamp, hospital ID, IP address, and practitioner identity.

---

## 🧪 Demonstration Clinical Scenario

To review the system under realistic operational conditions:
1. Open **`http://localhost:3000`**.
2. **Patient Loaded:** Notice default active subject **Rahim Uddin (`HID-2026-884219`)**.
3. In the left sidebar drawer, expand **Comprehensive EHR Hub** and click **Result Management**:
   * Click **Launch 1.5T MRI PACS** to inspect the 16 axial brain slices with contrast presets.
4. Click **Decision Support (CDSS)** in the drawer:
   * Observe how the system intercepted a duplicate scan order, preventing redundant radiation/contrast and saving **৳8,500**.
5. Switch to **Doctor CPOE & CDSS**:
   * Test the interactive prescription builder, select medicines, and check real-time CDSS alerts.
6. Switch to **HL7 FHIR R4 Inspector**:
   * Inspect the valid FHIR JSON bundle synchronized across the HIE bus.

---

## 📄 License
Distributed under the **MIT License** in partnership with the open health architecture standards of the Directorate General of Health Services (DGHS), Bangladesh.

---

*Designed and engineered for national scale, clinical safety, and data sovereignty.* 🇧🇩
