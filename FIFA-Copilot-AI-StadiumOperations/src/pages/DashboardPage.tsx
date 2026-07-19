import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Clock, Gauge, Sparkles } from 'lucide-react';
import { useDashboardData, useChatContext } from '@/hooks/useData';
import { defaultWelcomeMessage } from '@/services/chatService';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { EventFeed } from '@/components/dashboard/EventFeed';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { IncidentTable } from '@/components/dashboard/IncidentTable';
import { Timeline } from '@/components/dashboard/Timeline';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { MapPlaceholder } from '@/components/dashboard/MapPlaceholder';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { severityConfig } from '@/lib/severity';
import { cn } from '@/lib/utils';
import type { Incident, Recommendation } from '@/lib/types';

export function DashboardPage() {
  const {
    loading,
    error,
    isDemoMode,
    kpis,
    liveEvents,
    recommendations,
    incidents,
    timeline,
    stadiumNodes,
    crowdDensitySeries,
    suggestedPrompts,
    dashboard,
  } = useDashboardData();
  const chatContext = useChatContext();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  const chatMessages = useMemo(() => [defaultWelcomeMessage], []);
  const chatContextValue = useMemo(
    () => ({
      incidents,
      recommendations,
      memory: chatContext.memory,
      dashboard,
      isDemoMode,
    }),
    [incidents, recommendations, chatContext.memory, dashboard, isDemoMode]
  );

  if (loading) {
    return <LoadingState label="Loading operations dashboard…" className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">Operations Overview</h1>
          <Badge variant="outline" className="border-safe/30 bg-safe/10 text-[10px] font-medium text-safe">
            LIVE
          </Badge>
          {error && !isDemoMode && (
            <Badge variant="outline" className="border-critical/30 bg-critical/10 text-[10px] text-critical">
              Sync issue
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time stadium operations intelligence · Match 47 · Lusail Stadium
          {dashboard ? ` · AI Confidence ${dashboard.aiConfidence}%` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Crowd Density & Gate 4 Load</h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Density
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-critical" /> Gate 4
                    </span>
                  </div>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crowdDensitySeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gate4Grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--critical))" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(var(--critical))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Area type="monotone" dataKey="density" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#densityGrad)" />
                      <Area type="monotone" dataKey="gate4" stroke="hsl(var(--critical))" strokeWidth={2} fill="url(#gate4Grad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="h-[320px] lg:h-auto">
              <EventFeed events={liveEvents} />
            </div>
          </div>

          <div>
            <SectionHeader
              title="AI Recommendations"
              subtitle="Generated from live telemetry and operational memory"
              count={recommendations.length}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} onSelect={setSelectedRecommendation} />
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              title="Incident Center"
              subtitle="Active operations requiring management attention"
              count={incidents.length}
            />
            <IncidentTable incidents={incidents} onSelect={setSelectedIncident} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Operational Timeline</h3>
              </div>
              <Timeline items={timeline} />
            </div>
            <MapPlaceholder nodes={stadiumNodes} />
          </div>
        </div>

        <div className="h-[700px] xl:h-auto xl:min-h-[800px]">
          <ChatPanel
            messages={chatMessages}
            suggestions={suggestedPrompts}
            context={chatContextValue}
          />
        </div>
      </div>

      <Sheet open={!!selectedIncident} onOpenChange={(open) => !open && setSelectedIncident(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md scrollbar-thin">
          {selectedIncident && (
            <>
              <SheetHeader>
                <SheetDescription className="font-mono text-xs">{selectedIncident.code}</SheetDescription>
                <SheetTitle>{selectedIncident.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 px-1">
                <p className="text-sm text-foreground/90">{selectedIncident.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Info label="Severity" value={severityConfig[selectedIncident.severity].label} />
                  <Info label="Status" value={selectedIncident.status} />
                  <Info label="Team" value={selectedIncident.assignedTeam} />
                  <Info label="Zone" value={selectedIncident.zone} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={!!selectedRecommendation} onOpenChange={(open) => !open && setSelectedRecommendation(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md scrollbar-thin">
          {selectedRecommendation && (
            <>
              <SheetHeader>
                <SheetDescription className="flex items-center gap-1 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Recommendation Explanation
                </SheetDescription>
                <SheetTitle>{selectedRecommendation.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 px-1">
                <PanelBlock title="Reason" content={selectedRecommendation.reason} />
                <PanelBlock title="Recommended Action" content={selectedRecommendation.impact} />
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Confidence</p>
                  <p className={cn('mt-1 text-2xl font-semibold tabular-nums', selectedRecommendation.confidence >= 90 ? 'text-safe' : 'text-warning')}>
                    {selectedRecommendation.confidence}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  This recommendation is informed by operational memory from previous matches with similar weather, crowd levels, and congestion patterns.
                </p>
                <Button className="w-full" onClick={() => setSelectedRecommendation(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium capitalize text-foreground">{value}</p>
    </div>
  );
}

function PanelBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90">{content}</p>
    </div>
  );
}
