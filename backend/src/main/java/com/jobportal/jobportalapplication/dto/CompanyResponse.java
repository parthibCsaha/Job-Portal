package com.jobportal.jobportalapplication.dto;

import lombok.Data;

@Data
public class CompanyResponse {
    private Long id;
    private String name;
    private String description;
    private String industry;
    private String location;
    private String website;
    private String logoUrl;
}