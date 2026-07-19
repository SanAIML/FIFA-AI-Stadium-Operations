export interface BackendDashboardResponse {
  activeIncidents: number;
  criticalIncidents: number;
  recommendations: number;
  operationalMemory: number;
  systemStatus: string;
  aiConfidence: number;
}

export interface BackendIncident {
  id: number;
  title: string;
  location: string;
  severity: string;
  status: string;
  description: string;
  assignedTeam: string;
  confidenceScore: number;
  recommendedAction: string;
}

export interface BackendRecommendation {
  id: number;
  title: string;
  reason: string;
  action: string;
  confidence: number;
  status: string;
}

export interface BackendOperationalMemory {
  id: number;
  situation: string;
  recommendation: string;
  outcome: string;
  effectiveness: number;
  weather: string;
  crowdLevel: string;
}
