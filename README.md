### 🚀 Job Portal – Full Stack Web Application

    A modern full-stack recruitment platform built with Spring Boot, React (Vite), and PostgreSQL.
    It connects candidates, employers, and admins through a clean, secure, and scalable system. 
------------------------------------------------------------------------------------------------------------
### ⭐ Features
  #### 👨‍🎓 Candidates
<ul>
    Browse & filter jobs (location, type, experience, keywords)
    View job details with company info
    Apply with cover letter + resume upload
    Track application status
    Save jobs for later
    Manage profile
</ul>

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
### 🏛️ Architecture
  #### System Architecture
  
  flowchart LR
    subgraph Client["🌐 Frontend (React + Vite)"]
        UI["User Interface"]
    end

    subgraph Server["⚙️ Backend (Spring Boot)"]
        AuthAPI["Auth Service"]
        JobAPI["Job Service"]
        AppAPI["Application Service"]
        UserAPI["User/Profile Service"]
        CompanyAPI["Company Service"]
    end

    subgraph DB["🗄 PostgreSQL"]
        Users[(users)]
        Jobs[(jobs)]
        Applications[(applications)]
        Companies[(companies)]
        Roles[(roles)]
        Saved[(saved_jobs)]
    end

    UI --> AuthAPI
    UI --> JobAPI
    UI --> AppAPI
    UI --> UserAPI
    UI --> CompanyAPI

    AuthAPI --> Users
    JobAPI --> Jobs
    AppAPI --> Applications
    UserAPI --> Users
    CompanyAPI --> Companies
    JobAPI --> Companies
    Users --> Roles
    Saved --> Users
    Saved --> Jobs

-------------------------------------------------------------------------------------------------

