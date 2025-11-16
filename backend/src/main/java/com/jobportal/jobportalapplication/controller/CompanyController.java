package com.jobportal.jobportalapplication.controller;

import com.jobportal.jobportalapplication.dto.ApiResponse;
import com.jobportal.jobportalapplication.dto.CompanyRequest;
import com.jobportal.jobportalapplication.dto.CompanyResponse;
import com.jobportal.jobportalapplication.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> getAllCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<CompanyResponse> companies = companyService.getAllCompanies(pageRequest);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Companies retrieved successfully", companies)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(
            @PathVariable Long id) {
        CompanyResponse company = companyService.getCompanyById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Company retrieved successfully", company)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CompanyRequest request) {
        CompanyResponse company = companyService.createCompany(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Company created successfully", company)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequest request) {
        CompanyResponse company = companyService.updateCompany(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Company updated successfully", company)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Company deleted successfully")
        );
    }
}