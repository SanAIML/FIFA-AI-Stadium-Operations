export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'safe' | 'warning';
export type Tone = Severity | 'primary';
export type IncidentStatus = 'active' | 'acknowledged' | 'resolved' | 'monitoring';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Kpi {
  id: string;
  label: string;
  value: string;
  numeric: number;
  unit?: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  tone: Tone;
  icon: string;
}

export interface LiveEvent {
  id: string;
  time: string;
  title: string;
  detail?: string;
  severity: Severity;
  zone?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  confidence: number;
  impact: string;
  category: string;
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  zone?: string;
}

export interface Incident {
  id: string;
  code: string;
  severity: Severity;
  title: string;
  assignedTeam: string;
  eta: string;
  priority: Priority;
  status: IncidentStatus;
  zone: string;
  reportedAt: string;
  description: string;
  updates: { time: string; text: string; actor: string }[];
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'alert' | 'prediction' | 'action' | 'resolution' | 'info';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  citations?: string[];
}

export interface OperationalMemory {
  id: string;
  match: string;
  date: string;
  situation: string;
  action: string;
  outcome: string;
  effectiveness: number;
  tags: string[];
  weather?: string;
  crowdLevel?: string;
}

export interface DashboardData {
  activeIncidents: number;
  criticalIncidents: number;
  recommendations: number;
  operationalMemory: number;
  systemStatus: string;
  aiConfidence: number;
}

export interface ChatContext {
  incidents: Incident[];
  recommendations: Recommendation[];
  memory: OperationalMemory[];
  dashboard: DashboardData | null;
  isDemoMode: boolean;
}

export interface StaffGroup {
  id: string;
  name: string;
  available: number;
  total: number;
  location: string;
  lead: string;
}

export interface ReportMetric {
  id: string;
  title: string;
  value: string;
  sub?: string;
  trend?: string;
  tone: Tone;
  icon: string;
}

export interface StadiumNode {
  id: string;
  label: string;
  type: 'gate' | 'medical' | 'parking' | 'security';
  x: number;
  y: number;
  load: number;
  severity: Severity;
}

export interface ContextSnapshot {
  weather: string;
  temperature: number;
  crowdDensity: number;
  capacity: number;
  attendance: number;
  activeIncidents: number;
  openRecommendations: number;
}
