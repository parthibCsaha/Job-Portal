package com.jobportal.jobportalapplication.service;

import com.jobportal.jobportalapplication.dto.AuthResponse;
import com.jobportal.jobportalapplication.dto.LoginRequest;
import com.jobportal.jobportalapplication.dto.RegisterRequest;
import com.jobportal.jobportalapplication.dto.UserResponse;
import com.jobportal.jobportalapplication.entity.Candidate;
import com.jobportal.jobportalapplication.entity.Employer;
import com.jobportal.jobportalapplication.entity.Role;
import com.jobportal.jobportalapplication.entity.User;
import com.jobportal.jobportalapplication.exception.BadRequestException;
import com.jobportal.jobportalapplication.repo.CandidateRepository;
import com.jobportal.jobportalapplication.repo.CompanyRepository;
import com.jobportal.jobportalapplication.repo.EmployerRepository;
import com.jobportal.jobportalapplication.repo.UserRepository;
import com.jobportal.jobportalapplication.security.JwtTokenProvider;
import com.jobportal.jobportalapplication.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setIsActive(true);

        user = userRepository.save(user);

        // Create profile based on role
        if (request.getRole() == Role.CANDIDATE) {
            Candidate candidate = new Candidate();
            candidate.setUser(user);
            candidate.setFullName(request.getFullName());
            candidate.setPhone(request.getPhone());
            candidate.setLocation(request.getLocation());
            candidateRepository.save(candidate);
        } else if (request.getRole() == Role.EMPLOYER) {
            Employer employer = new Employer();
            employer.setUser(user);
            employer.setPhone(request.getPhone());
            employer.setPosition(request.getPosition());

            if (request.getCompanyId() != null) {
                employer.setCompany(companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new BadRequestException("Company not found")));
            }

            employerRepository.save(employer);
        }

        // Authenticate and generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        UserResponse userResponse = mapToUserResponse(user);

        return new AuthResponse(token, refreshToken, userResponse);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserResponse userResponse = mapToUserResponse(user);

        return new AuthResponse(token, refreshToken, userResponse);
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setIsActive(user.getIsActive());

        if (user.getRole() == Role.CANDIDATE && user.getCandidate() != null) {
            response.setProfileId(user.getCandidate().getId());
            response.setFullName(user.getCandidate().getFullName());
        } else if (user.getRole() == Role.EMPLOYER && user.getEmployer() != null) {
            response.setProfileId(user.getEmployer().getId());
        }

        return response;
    }
}