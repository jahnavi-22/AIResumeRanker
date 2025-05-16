package com.resumeranker.backend.model;

import lombok.Data;

import java.util.List;

@Data
public class ResumeResponse {
    private String name;
    private int score;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}
