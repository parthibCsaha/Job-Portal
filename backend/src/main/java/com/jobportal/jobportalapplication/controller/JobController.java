package com.jobportal.jobportalapplication.controller;

import com.jobportal.jobportalapplication.dto.ApiResponse;
import com.jobportal.jobportalapplication.dto.JobRequest;
import com.jobportal.jobportalapplication.dto.JobResponse;
import com.jobportal.jobportalapplication.entity.JobType;
import com.jobportal.jobportalapplication.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postedDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PageRequest pageRequest = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(sortDir), sortBy)
        );

        Page<JobResponse> jobs = jobService.getAllJobs(pageRequest);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Jobs retrieved successfully", jobs)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postedDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PageRequest pageRequest = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(sortDir), sortBy)
        );

        Page<JobResponse> jobs = jobService.searchJobs(
                keyword, location, jobType, experienceLevel, companyId, pageRequest
        );

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Jobs retrieved successfully", jobs)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Job retrieved successfully", job)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        JobResponse job = jobService.createJob(request, authentication);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Job created successfully", job)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        JobResponse job = jobService.updateJob(id, request, authentication);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Job updated successfully", job)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {
        jobService.deleteJob(id, authentication);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Job deleted successfully")
        );
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<JobResponse> jobs = jobService.getEmployerJobs(authentication, pageRequest);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Jobs retrieved successfully", jobs)
        );
    }
}