package com.resumeranker.backend.controller;

import com.resumeranker.backend.model.ResumeResponse;
import com.resumeranker.backend.service.ResumeProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/resume")
public class UploadController {

    @Autowired
    private ResumeProcessingService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<List<ResumeResponse>> uploadResumes(
            @RequestParam("jobId") String jobId,
            @RequestParam("jdFile") MultipartFile jdFile,
            @RequestParam("resumeFiles") List<MultipartFile> resumeFiles) {

        List<ResumeResponse> responses = resumeService.process(jobId, jdFile, resumeFiles);
        return ResponseEntity.ok(responses);
    }
}
