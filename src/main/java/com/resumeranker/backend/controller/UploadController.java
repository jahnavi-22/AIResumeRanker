package com.resumeranker.backend.controller;

import com.resumeranker.backend.model.ResumeResponse;
import com.resumeranker.backend.service.ResumeProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class UploadController {

    @Autowired
    private ResumeProcessingService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<List<ResumeResponse>> uploadResumes(
            @RequestParam("jdFile") MultipartFile jdFile,
            @RequestParam("resumeFiles") List<MultipartFile> resumeFiles) {

        List<ResumeResponse> responses = resumeService.process(jdFile, resumeFiles);
        return ResponseEntity.ok(responses);
    }
}
