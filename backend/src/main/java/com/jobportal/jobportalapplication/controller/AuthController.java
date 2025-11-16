package com.jobportal.jobportalapplication.controller;

import com.jobportal.jobportalapplication.dto.ApiResponse;
import com.jobportal.jobportalapplication.dto.AuthResponse;
import com.jobportal.jobportalapplication.dto.LoginRequest;
import com.jobportal.jobportalapplication.dto.RegisterRequest;
import com.jobportal.jobportalapplication.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User registered successfully", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", response)
        );
    }
}