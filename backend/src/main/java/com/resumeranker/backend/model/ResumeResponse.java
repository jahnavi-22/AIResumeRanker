package com.resumeranker.backend.model;

import lombok.Data;

import java.util.List;

@Data
public class ResumeResponse {
    private String name;
    private double score;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private int rank;
    private int total;
    private List<Double> topScores;
}
