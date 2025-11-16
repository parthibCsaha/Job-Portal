package com.jobportal.jobportalapplication.controller;

import com.jobportal.jobportalapplication.dto.ApiResponse;
import com.jobportal.jobportalapplication.dto.ApplicationRequest;
import com.jobportal.jobportalapplication.dto.ApplicationResponse;
import com.jobportal.jobportalapplication.entity.ApplicationStatus;
import com.jobportal.jobportalapplication.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {
        ApplicationResponse application = applicationService.applyForJob(
                request, authentication
        );
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Application submitted successfully", application)
        );
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ApplicationResponse> applications = applicationService
                .getCandidateApplications(authentication, pageRequest);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Applications retrieved successfully", applications)
        );
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ApplicationResponse> applications = applicationService
                .getJobApplications(jobId, authentication, pageRequest);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Applications retrieved successfully", applications)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'EMPLOYER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplication(
            @PathVariable Long id,
            Authentication authentication) {
        ApplicationResponse application = applicationService
                .getApplicationById(id, authentication);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Application retrieved successfully", application)
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {
        ApplicationResponse application = applicationService
                .updateApplicationStatus(id, status, authentication);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Application status updated successfully", application)
        );
    }
}