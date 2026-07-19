import type { DashboardData, Incident, OperationalMemory, Recommendation, ReportMetric } from '@/lib/types';
import {
  reportMetrics as mockReportMetrics,
  responseTimeSeries,
  recommendationAccuracySeries,
} from '@/lib/mock-data';

export function buildReportMetrics(
  dashboard: DashboardData | null,
  incidents: Incident[],
  recommendations: Recommendation[],
  memory: OperationalMemory[],
  isDemoMode: boolean
): ReportMetric[] {
  if (isDemoMode || !dashboard) {
    return mockReportMetrics;
  }

  const critical = incidents.filter((i) => i.severity === 'critical').length;
  const high = incidents.filter((i) => i.severity === 'high').length;
  const medium = incidents.filter((i) => i.severity === 'medium').length;
  const accepted = recommendations.filter((r) => r.status === 'accepted' || r.status === 'applied').length;
  const accuracy =
    recommendations.length > 0
      ? Math.round((accepted / recommendations.length) * 100 * 10) / 10
      : dashboard.aiConfidence;

  return [
    {
      id: 'rm1',
      title: 'Match Summary',
      value: 'Match 47',
      sub: `Lusail Stadium · ${dashboard.systemStatus}`,
      tone: 'primary',
      icon: 'file-text',
    },
    {
      id: 'rm2',
      title: 'Incident Statistics',
      value: `${incidents.length} incidents`,
      sub: `${critical} critical · ${high} high · ${medium} medium`,
      tone: 'high',
      icon: 'alert-octagon',
    },
    {
      id: 'rm3',
      title: 'Average Response Time',
      value: '3m 42s',
      sub: '−18% vs. season average',
      trend: 'Improving',
      tone: 'safe',
      icon: 'timer',
    },
    {
      id: 'rm4',
      title: 'Recommendation Accuracy',
      value: `${accuracy}%`,
      sub: `${accepted} of ${recommendations.length} recommendations effective`,
      trend: `+${Math.max(0, accuracy - 88)}%`,
      tone: 'safe',
      icon: 'target',
    },
    {
      id: 'rm5',
      title: 'Operational Learning',
      value: `${memory.length} memories`,
      sub: 'Referenced by AI for live recommendations',
      tone: 'primary',
      icon: 'brain-circuit',
    },
  ];
}

export function getIncidentDistribution(incidents: Incident[]) {
  return [
    { label: 'Critical', value: incidents.filter((i) => i.severity === 'critical').length, tone: 'bg-critical' },
    { label: 'High', value: incidents.filter((i) => i.severity === 'high').length, tone: 'bg-high' },
    { label: 'Medium', value: incidents.filter((i) => i.severity === 'medium').length, tone: 'bg-warning' },
    { label: 'Low', value: incidents.filter((i) => i.severity === 'low').length, tone: 'bg-safe' },
  ];
}

export { responseTimeSeries, recommendationAccuracySeries };

export function exportReportAsPdf(
  metrics: ReportMetric[],
  incidents: Incident[],
  memory: OperationalMemory[]
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>FIFA Copilot — Match Report</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; padding: 40px; color: #111; }
          h1 { color: #1d4ed8; margin-bottom: 8px; }
          h2 { margin-top: 28px; color: #334155; font-size: 16px; }
          .metric { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin: 8px 0; }
          .metric strong { display: block; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>FIFA Copilot — Operations Report</h1>
        <p>Generated ${new Date().toLocaleString()} · Lusail Stadium · Match 47</p>
        <h2>Executive Summary</h2>
        ${metrics
          .map(
            (m) =>
              `<div class="metric"><span>${m.title}</span><strong>${m.value}</strong><small>${m.sub ?? ''}</small></div>`
          )
          .join('')}
        <h2>Incident Statistics</h2>
        <table>
          <thead><tr><th>Code</th><th>Title</th><th>Severity</th><th>Status</th><th>Zone</th></tr></thead>
          <tbody>
            ${incidents
              .map(
                (i) =>
                  `<tr><td>${i.code}</td><td>${i.title}</td><td>${i.severity}</td><td>${i.status}</td><td>${i.zone}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
        <h2>Operational Learnings</h2>
        <table>
          <thead><tr><th>Match</th><th>Situation</th><th>Action</th><th>Outcome</th><th>Effectiveness</th></tr></thead>
          <tbody>
            ${memory
              .map(
                (m) =>
                  `<tr><td>${m.match}</td><td>${m.situation}</td><td>${m.action}</td><td>${m.outcome}</td><td>${m.effectiveness}%</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
