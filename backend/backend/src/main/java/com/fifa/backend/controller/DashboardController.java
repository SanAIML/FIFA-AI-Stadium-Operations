package com.fifa.backend.controller;

import com.fifa.backend.dto.DashboardResponse;
import com.fifa.backend.repository.IncidentRepository;
import com.fifa.backend.repository.RecommendationRepository;
import com.fifa.backend.repository.OperationalMemoryRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final IncidentRepository incidentRepository;
    private final RecommendationRepository recommendationRepository;
    private final OperationalMemoryRepository memoryRepository;

    public DashboardController(
            IncidentRepository incidentRepository,
            RecommendationRepository recommendationRepository,
            OperationalMemoryRepository memoryRepository) {

        this.incidentRepository = incidentRepository;
        this.recommendationRepository = recommendationRepository;
        this.memoryRepository = memoryRepository;
    }

    @GetMapping
    public DashboardResponse dashboard() {

        return DashboardResponse.builder()
                .activeIncidents(incidentRepository.count())
                .criticalIncidents(1)
                .recommendations(recommendationRepository.count())
                .operationalMemory(memoryRepository.count())
                .systemStatus("Operational")
                .aiConfidence(94)
                .build();
    }
}