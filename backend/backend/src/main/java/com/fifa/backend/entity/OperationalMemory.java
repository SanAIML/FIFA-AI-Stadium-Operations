package com.fifa.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperationalMemory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String situation;

    private String recommendation;

    private String outcome;

    private Integer effectiveness;

    private String weather;

    private String crowdLevel;
}