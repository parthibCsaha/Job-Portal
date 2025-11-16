package com.jobportal.jobportalapplication.controller;

import com.jobportal.jobportalapplication.dto.ApiResponse;
import com.jobportal.jobportalapplication.dto.PasswordChangeRequest;
import com.jobportal.jobportalapplication.dto.ProfileUpdateRequest;
import com.jobportal.jobportalapplication.dto.UserResponse;
import com.jobportal.jobportalapplication.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile(
            Authentication authentication) {
        UserResponse profile = userService.getCurrentUserProfile(authentication);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile retrieved successfully", profile)
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {
        UserResponse profile = userService.updateProfile(request, authentication);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile updated successfully", profile)
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody PasswordChangeRequest request,
            Authentication authentication) {
        userService.changePassword(
                request.getCurrentPassword(),
                request.getNewPassword(),
                authentication
        );
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Password changed successfully")
        );
    }
}