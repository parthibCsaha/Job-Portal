### 🚀 Job Portal – Full Stack Web Application

    A modern full-stack recruitment platform built with Spring Boot, React (Vite), and PostgreSQL.
    It connects candidates, employers, and admins through a clean, secure, and scalable system. 
------------------------------------------------------------------------------------------------------------
### ⭐ Features
  #### 👨‍🎓 Candidates
  
    Browse & filter jobs (location, type, experience, keywords)
    View job details with company info
    Apply with cover letter + resume upload
    Track application status
    Save jobs for later
    Manage profile

  #### 👨‍💼 Employers
    
    Create & manage job posts
    View applicants per job
    Update application status:
    Pending → Reviewed → Shortlisted → Accepted → Rejected
    Company profile management
    Email notifications to candidates

  #### 🛡️ Admins

    Manage users, companies, jobs, and applications
    View platform-wide statistics
    Complete system oversight
------------------------------------------------------------------------------------------------------------
### 🏗️ System Architecture
```mermaid
flowchart LR

    %% ======================= CLIENT ======================
    subgraph Client["🌐 Frontend (React + Vite)"]
        UI["User Interface"]
    end

    %% ======================= BACKEND ======================
    subgraph Server["⚙️ Backend (Spring Boot)"]
        AuthService["AuthService"]
        UserService["UserService"]
        JobService["JobService"]
        CompanyService["CompanyService"]
        ApplicationService["ApplicationService"]
        SavedJobService["SavedJobService"]
        NotificationService["NotificationService"]
        EmailService["EmailService"]
    end

    %% ======================= DATABASE ======================
    subgraph DB["🗄 PostgreSQL"]
        UserTable[(users)]
        CompanyTable[(companies)]
        JobTable[(jobs)]
        CandidateTable[(candidates)]
        EmployerTable[(employers)]
        ApplicationTable[(applications)]
        SavedJobTable[(saved_jobs)]
        NotificationTable[(notifications)]
        RoleTable[(roles)]
    end

    %% ======================= UI TO API =====================
    UI --> AuthService
    UI --> UserService
    UI --> JobService
    UI --> CompanyService
    UI --> ApplicationService
    UI --> SavedJobService
    UI --> NotificationService

    %% ======================= SERVICES TO DATABASE ==========
    AuthService --> UserTable
    AuthService --> RoleTable

    UserService --> UserTable
    UserService --> CandidateTable
    UserService --> EmployerTable

    CompanyService --> CompanyTable

    JobService --> JobTable
    JobService --> CompanyTable

    ApplicationService --> ApplicationTable
    ApplicationService --> UserTable
    ApplicationService --> JobTable

    SavedJobService --> SavedJobTable
    SavedJobTable --> UserTable
    SavedJobTable --> JobTable

    NotificationService --> NotificationTable
    NotificationService --> UserTable

    EmailService --> NotificationService
```
-------------------------------------------------------------------------------------------------
📊 Data Model (ER Diagram)
```mermaid
erDiagram
  USER ||--|{ CANDIDATE : "is"
  USER ||--|{ EMPLOYER : "is"
  USER }|--|| ROLE : "has"
  
  EMPLOYER }|--|| COMPANY : "works_for"
  EMPLOYER ||--|{ JOB : "creates"
  
  COMPANY ||--|{ JOB : "offers"
  
  JOB ||--|{ APPLICATION : "receives"
  JOB ||--|{ SAVEDJOB : "is_saved_as"
  
  CANDIDATE ||--|{ APPLICATION : "submits"
  CANDIDATE ||--|{ SAVEDJOB : "saves"
  
  APPLICATION {
    Long id
    Long job_id
    Long candidate_id
    String status
    String resume_url
    String cover_letter
    Timestamp applied_at
  }
  
  JOB {
    Long id
    String title
    String description
    String job_type
    String job_status
    Long company_id
    Long employer_id
  }
  
  USER {
    Long id
    String name
    String email
    String password
  }
  
  ROLE {
    Long id
    String name
  }
  
  CANDIDATE {
    Long id
    Long user_id
  }
  
  EMPLOYER {
    Long id
    Long user_id
    Long company_id
  }
  
  SAVEDJOB {
    Long id
    Long job_id
    Long user_id
  }
  
  NOTIFICATION {
    Long id
    Long user_id
    String message
    Boolean read
  }
```
----------------------------------------------------------------------------------------------

