package com.resumeranker.backend.controller;

import com.resumeranker.backend.model.ResumeRequest;
import com.resumeranker.backend.model.ResumeResponse;
import com.resumeranker.backend.service.ResumeProcessingService;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/resume")
public class UploadController {

    @Autowired
    private ResumeProcessingService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<List<ResumeResponse>> uploadResumes(
            @RequestParam(required = false) String jobId,
            @RequestParam(required = false) String jdText,
            @RequestParam(required = false) MultipartFile jdFile,
            @RequestParam(required = false) String jdUrl,
            @RequestParam(required = false) List<MultipartFile> resumeFiles,
            @RequestParam(required = false) List<String> resumeUrls) throws TikaException, IOException {

        ResumeRequest request = new ResumeRequest();
        request.setJobId(jobId);
        request.setJdText(jdText);
        request.setJdFile(jdFile);
        request.setJdUrl(jdUrl);
        request.setResumeFiles(resumeFiles);
        request.setResumeUrls(resumeUrls);

        List<ResumeResponse> responses = resumeService.process(request);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResultsPDF(@RequestParam String jobId){
        byte[] pdf = resumeService.generateResultsPDF(jobId);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=Results-" + jobId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
