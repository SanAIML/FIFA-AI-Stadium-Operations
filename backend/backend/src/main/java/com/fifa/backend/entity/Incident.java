package com.fifa.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String location;

    private String severity;

    private String status;

    private String description;

    private String assignedTeam;

    private Double confidenceScore;

    private String recommendedAction;
}