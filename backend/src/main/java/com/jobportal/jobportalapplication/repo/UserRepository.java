package com.jobportal.jobportalapplication.repo;

import com.jobportal.jobportalapplication.entity.Role;
import com.jobportal.jobportalapplication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Long countByRole(Role role);
    Long countByIsActive(Boolean isActive);
    Long countByCreatedAtAfter(LocalDateTime date);
}