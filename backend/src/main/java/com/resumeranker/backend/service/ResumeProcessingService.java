package com.resumeranker.backend.service;

import com.resumeranker.backend.model.ResumeRequest;
import com.resumeranker.backend.model.ResumeResponse;
import com.resumeranker.backend.util.FileDownloaderUtil;
import com.resumeranker.backend.util.FileParserUtil;
import org.apache.tika.exception.TikaException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ResumeProcessingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String mlServiceUrl = "http://localhost:8000/rank";

    public List<ResumeResponse> process(ResumeRequest request) throws TikaException, IOException {
        String jdText = extractJobDescription(request);

        List<String> resumeTexts = new ArrayList<>();
        List<String> resumeNames = new ArrayList<>();

        //in case of resume files
        if(request.getResumeFiles() != null){
            for(MultipartFile resume : request.getResumeFiles()){
                try{
                    resumeTexts.add(FileParserUtil.extractText(resume));
                    resumeNames.add(Objects.requireNonNull(resume.getOriginalFilename()));
                } catch(IOException | TikaException e){
                    throw new RuntimeException("Error processing resume file", e);
                }
            }
        }

        ////in case of resume urls
        if(request.getResumeUrls() != null){
            for(String url : request.getResumeUrls()){
                try(InputStream stream = FileDownloaderUtil.downloadFile(url)){
                    resumeTexts.add(FileParserUtil.extractText(stream));
                    resumeNames.add(url.substring(url.lastIndexOf('/') + 1));
                }
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("jobId", request.getJobId());
        payload.put("jobDescription", jdText);
        payload.put("resumeTexts", resumeTexts);
        payload.put("resumeNames", resumeNames);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<ResumeResponse[]> response = restTemplate.exchange(
                mlServiceUrl, HttpMethod.POST, entity, ResumeResponse[].class
        );

        return List.of(Objects.requireNonNull(response.getBody()));
    }

    private String extractJobDescription(ResumeRequest request) throws TikaException, IOException {
        try{
            if(request.getJdText() != null)
                return request.getJdText();
            if(request.getJdFile() != null)
                return FileParserUtil.extractText(request.getJdFile());
            if(request.getJdUrl() != null){
                InputStream stream = FileDownloaderUtil.downloadFile(request.getJdUrl());
                return FileParserUtil.extractText(stream);
            }
        }catch(Exception e){
            throw new RuntimeException("Error processing job description", e);
        }
    }
}
