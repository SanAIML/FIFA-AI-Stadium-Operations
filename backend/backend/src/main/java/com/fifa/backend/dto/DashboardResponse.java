package com.fifa.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardResponse {

    private long activeIncidents;

    private long criticalIncidents;

    private long recommendations;

    private long operationalMemory;

    private String systemStatus;

    private int aiConfidence;

}