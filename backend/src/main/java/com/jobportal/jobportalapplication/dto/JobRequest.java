package com.jobportal.jobportalapplication.dto;

import com.jobportal.jobportalapplication.entity.JobStatus;
import com.jobportal.jobportalapplication.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String salaryRange;

    private String experienceLevel;

    private JobStatus status;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private LocalDate closingDate;
}
