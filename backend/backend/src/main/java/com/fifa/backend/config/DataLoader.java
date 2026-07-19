package com.fifa.backend.config;

import com.fifa.backend.entity.Incident;
import com.fifa.backend.entity.OperationalMemory;
import com.fifa.backend.entity.Recommendation;
import com.fifa.backend.repository.IncidentRepository;
import com.fifa.backend.repository.OperationalMemoryRepository;
import com.fifa.backend.repository.RecommendationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(
            IncidentRepository incidentRepository,
            RecommendationRepository recommendationRepository,
            OperationalMemoryRepository memoryRepository) {

        return args -> {

            // ==========================
            // INCIDENTS
            // ==========================

            incidentRepository.save(
                    Incident.builder()
                            .title("Gate 4 Congestion")
                            .location("Gate 4")
                            .severity("HIGH")
                            .status("ACTIVE")
                            .description("Crowd density exceeded threshold.")
                            .assignedTeam("Security Team Alpha")
                            .confidenceScore(92.5)
                            .recommendedAction("Open Gate 5")
                            .build()
            );

            incidentRepository.save(
                    Incident.builder()
                            .title("Medical Emergency")
                            .location("Stand B")
                            .severity("CRITICAL")
                            .status("IN_PROGRESS")
                            .description("Spectator collapsed.")
                            .assignedTeam("Medical Team 2")
                            .confidenceScore(98.0)
                            .recommendedAction("Dispatch nearest medical unit")
                            .build()
            );

            // ==========================
            // RECOMMENDATIONS
            // ==========================

            recommendationRepository.save(
                    Recommendation.builder()
                            .title("Open Gate 5")
                            .reason("Crowd congestion predicted in 8 minutes")
                            .action("Deploy 3 volunteers")
                            .confidence(94)
                            .status("PENDING")
                            .build()
            );

            recommendationRepository.save(
                    Recommendation.builder()
                            .title("Increase Medical Presence")
                            .reason("High heat index")
                            .action("Move Team B to East Stand")
                            .confidence(88)
                            .status("PENDING")
                            .build()
            );

            // ==========================
            // OPERATIONAL MEMORY
            // ==========================

            memoryRepository.save(
                    OperationalMemory.builder()
                            .situation("Heavy rain with Gate 4 congestion")
                            .recommendation("Open Gate 5")
                            .outcome("Queue reduced by 31%")
                            .effectiveness(91)
                            .weather("Rain")
                            .crowdLevel("High")
                            .build()
            );

            memoryRepository.save(
                    OperationalMemory.builder()
                            .situation("Medical emergency during halftime")
                            .recommendation("Dispatch nearest medical team")
                            .outcome("Response completed in under 2 minutes")
                            .effectiveness(95)
                            .weather("Clear")
                            .crowdLevel("Medium")
                            .build()
            );

        };
    }
}