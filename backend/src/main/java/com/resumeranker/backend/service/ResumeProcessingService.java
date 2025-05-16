package com.resumeranker.backend.service;

import com.resumeranker.backend.model.ResumeResponse;
import com.resumeranker.backend.util.FileParserUtil;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class ResumeProcessingService {

    public List<ResumeResponse> process(MultipartFile jdFile, List<MultipartFile> resumeFiles){
        String jdText;
        try{
            jdText = FileParserUtil.extractText(jdFile);
        } catch(IOException | TikaException e){
            throw new RuntimeException("Error processing job description file", e);
        }

        List<ResumeResponse> responses = new ArrayList<>();
        for(MultipartFile resume : resumeFiles){
            String resumeText;
            try{
                resumeText = FileParserUtil.extractText(resume);
            } catch(IOException | TikaException e){
//                throw new RuntimeException("Error processing resume file", e);
                continue;
            }

            //mocked response for phase 1b
            ResumeResponse response = new ResumeResponse();
            response.setName(resume.getOriginalFilename());
            response.setScore(new Random().nextInt(100)); // Mock scoring between 0-99
            response.setMatchedSkills(List.of("Java", "Spring Boot"));
            response.setMissingSkills(List.of("Docker", "Kubernetes"));
            responses.add(response);
        }
        return responses;
    }
}
