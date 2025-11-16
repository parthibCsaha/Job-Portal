package com.jobportal.jobportalapplication.service;

import com.jobportal.jobportalapplication.entity.Application;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public void sendApplicationConfirmation(Application application) {
        try {
            String to = application.getCandidate().getUser().getEmail();
            String subject = "Application Submitted - " + application.getJob().getTitle();
            String body = String.format(
                    "Dear %s,\n\n" +
                            "Your application for %s at %s has been submitted successfully.\n\n" +
                            "Application ID: %d\n" +
                            "Applied on: %s\n\n" +
                            "We will review your application and get back to you soon.\n\n" +
                            "Best regards,\n" +
                            "Job Portal Team",
                    application.getCandidate().getFullName(),
                    application.getJob().getTitle(),
                    application.getJob().getCompany().getName(),
                    application.getId(),
                    application.getAppliedDate()
            );

            sendEmail(to, subject, body);
        } catch (Exception e) {
            log.error("Failed to send application confirmation email", e);
        }
    }

    public void sendApplicationStatusUpdate(Application application) {
        try {
            String to = application.getCandidate().getUser().getEmail();
            String subject = "Application Status Update - " + application.getJob().getTitle();
            String body = String.format(
                    "Dear %s,\n\n" +
                            "Your application status has been updated.\n\n" +
                            "Job: %s\n" +
                            "Company: %s\n" +
                            "New Status: %s\n\n" +
                            "Best regards,\n" +
                            "Job Portal Team",
                    application.getCandidate().getFullName(),
                    application.getJob().getTitle(),
                    application.getJob().getCompany().getName(),
                    application.getStatus()
            );

            sendEmail(to, subject, body);
        } catch (Exception e) {
            log.error("Failed to send status update email", e);
        }
    }

    public void sendNewApplicationAlert(Application application) {
        try {
            String to = application.getJob().getEmployer().getUser().getEmail();
            String subject = "New Application Received - " + application.getJob().getTitle();
            String body = String.format(
                    "Dear Employer,\n\n" +
                            "You have received a new application for %s.\n\n" +
                            "Candidate: %s\n" +
                            "Applied on: %s\n\n" +
                            "Please log in to review the application.\n\n" +
                            "Best regards,\n" +
                            "Job Portal Team",
                    application.getJob().getTitle(),
                    application.getCandidate().getFullName(),
                    application.getAppliedDate()
            );

            sendEmail(to, subject, body);
        } catch (Exception e) {
            log.error("Failed to send new application alert", e);
        }
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        log.info("Email sent to: {}", to);
    }
}