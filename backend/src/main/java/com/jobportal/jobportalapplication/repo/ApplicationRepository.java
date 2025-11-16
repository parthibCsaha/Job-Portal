package com.jobportal.jobportalapplication.repo;

import com.jobportal.jobportalapplication.entity.Application;
import com.jobportal.jobportalapplication.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findByCandidateId(Long candidateId, Pageable pageable);
    Page<Application> findByJobId(Long jobId, Pageable pageable);
    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    Boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    Long countByStatus(ApplicationStatus status);
    Long countByAppliedDateAfter(LocalDateTime date);
    Long countByJobId(Long jobId);
}
