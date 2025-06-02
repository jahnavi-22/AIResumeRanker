package com.resumeranker.backend.model;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ResumeRequest {
    private String jobId;

    //Job Description input
    private String jdText;
    private MultipartFile jdFile;
    private String jdUrl;

    //Resume input
    private List<MultipartFile> resumeFiles;
    private List<String> resumeUrls;
}
