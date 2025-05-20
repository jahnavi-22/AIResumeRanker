package com.resumeranker.backend.model;

import lombok.Data;

import java.util.List;

@Data
public class ResumeRequest {
    private String jobId;
    private String jobDescription;
    private List<String> resumeTexts;
}
