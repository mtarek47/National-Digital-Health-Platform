package com.dghs.healthcard.dto;

import java.time.LocalDateTime;

public class DuplicateCheckResponse {
    private boolean duplicateDetected;
    private String testCode;
    private String testName;
    private String warningMessage;
    private LocalDateTime previousTestDate;
    private String previousHospitalName;
    private String previousDoctorName;
    private String previousResultSummary;
    private long daysAgo;

    public DuplicateCheckResponse() {}

    public DuplicateCheckResponse(boolean duplicateDetected, String testCode, String testName, String warningMessage,
                                  LocalDateTime previousTestDate, String previousHospitalName, String previousDoctorName,
                                  String previousResultSummary, long daysAgo) {
        this.duplicateDetected = duplicateDetected;
        this.testCode = testCode;
        this.testName = testName;
        this.warningMessage = warningMessage;
        this.previousTestDate = previousTestDate;
        this.previousHospitalName = previousHospitalName;
        this.previousDoctorName = previousDoctorName;
        this.previousResultSummary = previousResultSummary;
        this.daysAgo = daysAgo;
    }

    public static DuplicateCheckResponseBuilder builder() { return new DuplicateCheckResponseBuilder(); }

    public static class DuplicateCheckResponseBuilder {
        private boolean duplicateDetected;
        private String testCode;
        private String testName;
        private String warningMessage;
        private LocalDateTime previousTestDate;
        private String previousHospitalName;
        private String previousDoctorName;
        private String previousResultSummary;
        private long daysAgo;

        public DuplicateCheckResponseBuilder duplicateDetected(boolean duplicateDetected) { this.duplicateDetected = duplicateDetected; return this; }
        public DuplicateCheckResponseBuilder testCode(String testCode) { this.testCode = testCode; return this; }
        public DuplicateCheckResponseBuilder testName(String testName) { this.testName = testName; return this; }
        public DuplicateCheckResponseBuilder warningMessage(String warningMessage) { this.warningMessage = warningMessage; return this; }
        public DuplicateCheckResponseBuilder previousTestDate(LocalDateTime previousTestDate) { this.previousTestDate = previousTestDate; return this; }
        public DuplicateCheckResponseBuilder previousHospitalName(String previousHospitalName) { this.previousHospitalName = previousHospitalName; return this; }
        public DuplicateCheckResponseBuilder previousDoctorName(String previousDoctorName) { this.previousDoctorName = previousDoctorName; return this; }
        public DuplicateCheckResponseBuilder previousResultSummary(String previousResultSummary) { this.previousResultSummary = previousResultSummary; return this; }
        public DuplicateCheckResponseBuilder daysAgo(long daysAgo) { this.daysAgo = daysAgo; return this; }
        public DuplicateCheckResponse build() {
            return new DuplicateCheckResponse(duplicateDetected, testCode, testName, warningMessage, previousTestDate, previousHospitalName, previousDoctorName, previousResultSummary, daysAgo);
        }
    }

    public boolean isDuplicateDetected() { return duplicateDetected; }
    public void setDuplicateDetected(boolean duplicateDetected) { this.duplicateDetected = duplicateDetected; }
    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getWarningMessage() { return warningMessage; }
    public void setWarningMessage(String warningMessage) { this.warningMessage = warningMessage; }
    public LocalDateTime getPreviousTestDate() { return previousTestDate; }
    public void setPreviousTestDate(LocalDateTime previousTestDate) { this.previousTestDate = previousTestDate; }
    public String getPreviousHospitalName() { return previousHospitalName; }
    public void setPreviousHospitalName(String previousHospitalName) { this.previousHospitalName = previousHospitalName; }
    public String getPreviousDoctorName() { return previousDoctorName; }
    public void setPreviousDoctorName(String previousDoctorName) { this.previousDoctorName = previousDoctorName; }
    public String getPreviousResultSummary() { return previousResultSummary; }
    public void setPreviousResultSummary(String previousResultSummary) { this.previousResultSummary = previousResultSummary; }
    public long getDaysAgo() { return daysAgo; }
    public void setDaysAgo(long daysAgo) { this.daysAgo = daysAgo; }
}
