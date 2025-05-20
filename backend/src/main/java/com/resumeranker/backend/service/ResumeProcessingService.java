package com.resumeranker.backend.service;

import com.resumeranker.backend.model.ResumeRequest;
import com.resumeranker.backend.model.ResumeResponse;
import com.resumeranker.backend.util.FileParserUtil;
import org.apache.tika.exception.TikaException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ResumeProcessingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String mlServiceUrl = "http://localhost:8000/rank";

    public List<ResumeResponse> process(String jobId, MultipartFile jdFile, List<MultipartFile> resumeFiles){
        String jdText;
        try{
            jdText = FileParserUtil.extractText(jdFile);
        } catch(IOException | TikaException e){
            throw new RuntimeException("Error processing job description file", e);
        }

        List<String> resumeTexts = new ArrayList<>();
        for (MultipartFile resume : resumeFiles) {
            try {
                resumeTexts.add(FileParserUtil.extractText(resume));
            } catch (IOException | TikaException e) {
                throw new RuntimeException("Error processing resume file", e);
            }
        }

        ResumeRequest request = new ResumeRequest();
        request.setJobId(jobId);
        request.setJobDescription(jdText);
        request.setResumeTexts(resumeTexts);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ResumeRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ResumeResponse[]> response = restTemplate.exchange(
                mlServiceUrl, HttpMethod.POST, entity, ResumeResponse[].class
        );

        return List.of(Objects.requireNonNull(response.getBody()));
    }
}
