import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { ReportCard, ReportActions } from '@/components/dashboard/ReportCard';
import { PageHeader, SectionHeader } from '@/components/shared/SectionHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { useDashboardData } from '@/hooks/useData';
import {
  buildReportMetrics,
  exportReportAsPdf,
  getIncidentDistribution,
  recommendationAccuracySeries,
  responseTimeSeries,
} from '@/services/reportService';

export function ReportsPage() {
  const { loading, dashboard, incidents, recommendations, memory, isDemoMode } = useDashboardData();

  const reportMetrics = useMemo(
    () => buildReportMetrics(dashboard, incidents, recommendations, memory, isDemoMode),
    [dashboard, incidents, recommendations, memory, isDemoMode]
  );

  const incidentDistribution = useMemo(() => getIncidentDistribution(incidents), [incidents]);
  const maxIncidents = Math.max(incidents.length, 1);
  const healthScore = dashboard?.aiConfidence ?? 87;

  const handleExportPdf = () => {
    exportReportAsPdf(reportMetrics, incidents, memory);
  };

  if (loading) {
    return <LoadingState label="Loading reports…" className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Post-match intelligence, response performance, and AI accuracy"
        action={<ReportActions onExportPdf={handleExportPdf} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {reportMetrics.map((m) => (
          <ReportCard key={m.id} metric={m} onExportPdf={handleExportPdf} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <SectionHeader title="Average Response Time" subtitle="Minutes per incident across recent matches" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeSeries} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="match" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} unit="m" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <SectionHeader title="Recommendation Accuracy" subtitle="AI recommendation effectiveness over time" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recommendationAccuracySeries} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[70, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--safe))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--safe))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-1">
          <SectionHeader title="Operational Health Index" subtitle="Composite score this match" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="55%" outerRadius="100%" data={[{ name: 'Health', value: healthScore, fill: 'hsl(var(--safe))' }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={10} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-10 text-center">
            <p className="text-3xl font-semibold text-foreground">{healthScore}%</p>
            <p className="text-xs text-muted-foreground">Healthy · within target envelope</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
          <SectionHeader title="Incident Distribution" subtitle="By severity across the current match" />
          <div className="space-y-3 py-2">
            {incidentDistribution.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-foreground/90">{row.label}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">{row.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${(row.value / maxIncidents) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <SectionHeader title="Operational Learnings" subtitle="Insights derived from operational memory" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {memory.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-xs font-semibold text-foreground">{item.match}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.situation}</p>
              <p className="mt-2 text-xs text-foreground/90">
                <span className="text-primary">Recommendation:</span> {item.action}
              </p>
              <p className="mt-1 text-xs text-safe">Outcome: {item.outcome} · {item.effectiveness}% effective</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
