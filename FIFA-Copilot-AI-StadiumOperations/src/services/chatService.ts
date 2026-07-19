import type { ChatContext } from '@/lib/types';

function formatIncidentList(context: ChatContext): string {
  const urgent = context.incidents
    .filter((i) => i.status === 'active' || i.status === 'acknowledged')
    .slice(0, 5);

  if (urgent.length === 0) return 'No active incidents requiring immediate attention.';

  return urgent
    .map(
      (inc, idx) =>
        `${idx + 1}. ${inc.title} (${inc.priority}): ${inc.description.slice(0, 120)}${inc.description.length > 120 ? '…' : ''}`
    )
    .join('\n\n');
}

function formatRiskList(context: ChatContext): string {
  const risks = [...context.incidents]
    .filter((i) => i.severity === 'critical' || i.severity === 'high')
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3, warning: 4, safe: 5 };
      return order[a.severity] - order[b.severity];
    });

  if (risks.length === 0) return 'No elevated risks detected in current telemetry.';

  return risks
    .map(
      (inc) =>
        `• ${inc.severity.toUpperCase()} — ${inc.title} (${inc.zone}): ${inc.assignedTeam}, ETA ${inc.eta}`
    )
    .join('\n');
}

function formatPendingRecommendations(context: ChatContext): string {
  const pending = context.recommendations.filter((r) => r.status === 'pending');
  if (pending.length === 0) return 'All recommendations have been actioned.';

  return pending
    .map((rec, idx) => `${idx + 1}. ${rec.title} (${rec.confidence}% confidence)\n   Reason: ${rec.reason}`)
    .join('\n\n');
}

function findRelevantMemory(context: ChatContext, query: string): string {
  const normalized = query.toLowerCase();
  const match = context.memory.find(
    (m) =>
      m.situation.toLowerCase().includes('gate 4') ||
      m.situation.toLowerCase().includes('rain') ||
      m.tags.some((t) => normalized.includes(t.replace('-', ' ')))
  );

  if (!match) {
    return 'Operational memory indicates similar congestion scenarios were resolved by opening alternate gates and redirecting volunteers.';
  }

  return `Based on ${match.match} (${match.effectiveness}% effective):\n• Situation: ${match.situation}\n• Action: ${match.action}\n• Outcome: ${match.outcome}${match.weather ? `\n• Weather: ${match.weather}` : ''}${match.crowdLevel ? `\n• Crowd Level: ${match.crowdLevel}` : ''}`;
}

export function generateChatResponse(query: string, context: ChatContext): string {
  const normalized = query.toLowerCase().trim();

  if (normalized.includes('what needs attention') || normalized.includes('needs attention')) {
    return `Priority items requiring immediate action:\n\n${formatIncidentList(context)}\n\nPending AI recommendations:\n${formatPendingRecommendations(context)}`;
  }

  if (normalized.includes('highest risk') || normalized.includes('show highest')) {
    return `Highest operational risks right now:\n\n${formatRiskList(context)}\n\nAI confidence: ${context.dashboard?.aiConfidence ?? 94}%. ${context.isDemoMode ? '(Demo Mode — using sample data)' : 'Live telemetry active.'}`;
  }

  if (normalized.includes('generate report') || normalized.includes('match report')) {
    const total = context.incidents.length;
    const critical = context.incidents.filter((i) => i.severity === 'critical').length;
    return `Match report summary:\n\n• Total incidents: ${total}\n• Critical: ${critical}\n• Pending recommendations: ${context.recommendations.filter((r) => r.status === 'pending').length}\n• Operational memories referenced: ${context.memory.length}\n• Stadium status: ${context.dashboard?.systemStatus ?? 'Operational'}\n\nNavigate to Reports for full analytics and PDF export.`;
  }

  if (normalized.includes('summarize') && normalized.includes('30')) {
    const recent = context.incidents.slice(0, 4);
    const summary = recent
      .map((inc) => `• ${inc.reportedAt} — ${inc.title} (${inc.severity})`)
      .join('\n');
    return `Last 30 minutes summary:\n\n${summary || '• No significant events in the last 30 minutes.'}\n\nStadium health: ${context.dashboard?.aiConfidence ?? 87}% with ${context.dashboard?.activeIncidents ?? context.incidents.length} tracked incidents.`;
  }

  if (normalized.includes('gate 4') || normalized.includes('why gate')) {
    const gateIncident = context.incidents.find((i) => i.zone.toLowerCase().includes('gate 4'));
    const gateRec = context.recommendations.find((r) => r.title.toLowerCase().includes('gate'));
    const memory = findRelevantMemory(context, 'gate 4 rain congestion');

    let response = 'Gate 4 analysis:\n\n';
    if (gateIncident) {
      response += `Current incident: ${gateIncident.title}\n${gateIncident.description}\n\n`;
    }
    if (gateRec) {
      response += `AI recommendation: ${gateRec.title} (${gateRec.confidence}% confidence)\n${gateRec.reason}\n\n`;
    }
    response += `Historical precedent:\n${memory}`;
    return response;
  }

  if (normalized.includes('crowd density')) {
    const density = Math.min(95, 55 + context.incidents.length * 8);
    return `Current crowd density estimate: ${density}% of capacity.\n\nActive zones:\n${context.incidents.map((i) => `• ${i.zone}: ${i.severity}`).join('\n') || '• All zones within safe envelope.'}`;
  }

  if (normalized.includes('pending') && normalized.includes('recommendation')) {
    return `Pending recommendations:\n\n${formatPendingRecommendations(context)}`;
  }

  const activeCount = context.incidents.filter(
    (i) => i.status === 'active' || i.status === 'acknowledged'
  ).length;
  const pendingCount = context.recommendations.filter((r) => r.status === 'pending').length;

  return `Based on current telemetry, I am monitoring ${activeCount} active incidents and ${pendingCount} pending recommendations. The most urgent item is: ${context.incidents[0]?.title ?? 'none detected'}.\n\nAsk about specific zones, risks, or request a match report for deeper analysis.`;
}

export const defaultSuggestedPrompts = [
  'What needs attention?',
  'Show highest risks',
  'Generate report',
  'Summarize last 30 minutes',
  'Why Gate 4?',
  'Which recommendations are pending?',
];

export const defaultWelcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content:
    'Good afternoon. Live operations are being monitored for Match 47 at Lusail Stadium. I can surface active incidents, highest risks, and AI recommendations grounded in operational memory. How can I assist?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};
