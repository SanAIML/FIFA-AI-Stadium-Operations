import type {
  BackendIncident,
  BackendOperationalMemory,
  BackendRecommendation,
  BackendDashboardResponse,
} from '@/types/api';
import type {
  Incident,
  Kpi,
  OperationalMemory,
  Recommendation,
  Severity,
  IncidentStatus,
  Priority,
  ContextSnapshot,
} from '@/lib/types';

function mapSeverity(value: string): Severity {
  const normalized = value.toLowerCase();
  if (normalized === 'critical') return 'critical';
  if (normalized === 'high') return 'high';
  if (normalized === 'medium') return 'medium';
  if (normalized === 'low') return 'low';
  if (normalized === 'warning') return 'warning';
  return 'safe';
}

function mapIncidentStatus(value: string): IncidentStatus {
  const normalized = value.toLowerCase().replace('_', ' ');
  if (normalized.includes('progress') || normalized === 'in progress') return 'acknowledged';
  if (normalized === 'resolved') return 'resolved';
  if (normalized === 'monitoring') return 'monitoring';
  if (normalized === 'acknowledged') return 'acknowledged';
  return 'active';
}

function mapRecommendationStatus(value: string): Recommendation['status'] {
  const normalized = value.toLowerCase();
  if (normalized === 'accepted') return 'accepted';
  if (normalized === 'rejected') return 'rejected';
  if (normalized === 'applied') return 'applied';
  return 'pending';
}

function derivePriority(severity: Severity): Priority {
  if (severity === 'critical') return 'P1';
  if (severity === 'high') return 'P1';
  if (severity === 'medium') return 'P2';
  if (severity === 'low') return 'P4';
  return 'P3';
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function mapBackendIncident(incident: BackendIncident): Incident {
  const severity = mapSeverity(incident.severity);
  return {
    id: String(incident.id),
    code: `INC-${2400 + incident.id}`,
    severity,
    title: incident.title,
    assignedTeam: incident.assignedTeam || 'Unassigned',
    eta: severity === 'critical' ? '1m 30s' : severity === 'high' ? '4m' : '12m',
    priority: derivePriority(severity),
    status: mapIncidentStatus(incident.status),
    zone: incident.location || 'Stadium-wide',
    reportedAt: formatTime(),
    description: incident.description || '',
    updates: [
      {
        time: formatTime(),
        text: incident.description || 'Incident reported.',
        actor: 'Ops Console',
      },
      ...(incident.recommendedAction
        ? [
            {
              time: formatTime(),
              text: `Recommended action: ${incident.recommendedAction}`,
              actor: 'AI Copilot',
            },
          ]
        : []),
    ],
  };
}

export function mapBackendRecommendation(rec: BackendRecommendation): Recommendation {
  return {
    id: String(rec.id),
    title: rec.title,
    reason: rec.reason,
    confidence: rec.confidence,
    impact: rec.action,
    category: 'Operations',
    status: mapRecommendationStatus(rec.status),
    zone: 'Stadium-wide',
  };
}

export function mapBackendMemory(memory: BackendOperationalMemory, index: number): OperationalMemory {
  const tags = [
    memory.weather?.toLowerCase() || 'operations',
    memory.crowdLevel?.toLowerCase().replace(/\s+/g, '-') || 'crowd',
  ];
  return {
    id: String(memory.id),
    match: `Match ${String(index + 1).padStart(2, '0')} — Knowledge Base`,
    date: new Date().toISOString().slice(0, 10),
    situation: memory.situation,
    action: memory.recommendation,
    outcome: memory.outcome,
    effectiveness: memory.effectiveness,
    tags,
    weather: memory.weather,
    crowdLevel: memory.crowdLevel,
  };
}

export function buildKpisFromDashboard(
  dashboard: BackendDashboardResponse,
  incidents: Incident[]
): Kpi[] {
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length;
  const highCount = incidents.filter((i) => i.severity === 'high').length;

  return [
    {
      id: 'health',
      label: 'Stadium Health',
      value: `${dashboard.aiConfidence}%`,
      numeric: dashboard.aiConfidence,
      delta: dashboard.systemStatus === 'Operational' ? '+2.4%' : '-1.2%',
      trend: dashboard.systemStatus === 'Operational' ? 'up' : 'down',
      tone: dashboard.aiConfidence >= 85 ? 'safe' : 'warning',
      icon: 'activity',
    },
    {
      id: 'incidents',
      label: 'Active Incidents',
      value: String(dashboard.activeIncidents),
      numeric: dashboard.activeIncidents,
      delta: `+${Math.max(0, dashboard.activeIncidents - 3)}`,
      trend: dashboard.activeIncidents > 3 ? 'up' : 'flat',
      tone: dashboard.activeIncidents > 4 ? 'warning' : 'primary',
      icon: 'alert-triangle',
    },
    {
      id: 'risks',
      label: 'Critical Risks',
      value: String(criticalCount || dashboard.criticalIncidents),
      numeric: criticalCount || dashboard.criticalIncidents,
      delta: String(highCount),
      trend: criticalCount > 0 ? 'up' : 'flat',
      tone: criticalCount > 0 ? 'critical' : 'safe',
      icon: 'shield-alert',
    },
    {
      id: 'staff',
      label: 'AI Confidence',
      value: `${dashboard.aiConfidence}%`,
      numeric: dashboard.aiConfidence,
      delta: `${dashboard.recommendations} recs`,
      trend: 'up',
      tone: 'primary',
      icon: 'users',
    },
  ];
}

export function buildContextSnapshot(
  dashboard: BackendDashboardResponse,
  incidents: Incident[],
  recommendations: Recommendation[]
): ContextSnapshot {
  const pendingRecs = recommendations.filter((r) => r.status === 'pending').length;
  const activeIncidents = incidents.filter(
    (i) => i.status === 'active' || i.status === 'acknowledged'
  ).length;

  return {
    weather: 'Heavy Rain',
    temperature: 17,
    crowdDensity: Math.min(95, 55 + activeIncidents * 8),
    capacity: 68000,
    attendance: 60214,
    activeIncidents: activeIncidents || dashboard.activeIncidents,
    openRecommendations: pendingRecs || dashboard.recommendations,
  };
}
