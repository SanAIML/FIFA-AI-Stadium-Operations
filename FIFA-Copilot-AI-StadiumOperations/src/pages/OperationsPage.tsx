import { useMemo, useState } from 'react';
import { Radio, Users, Activity, CloudRain, Wind, Droplets, Gauge, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader, SectionHeader } from '@/components/shared/SectionHeader';
import { EventFeed } from '@/components/dashboard/EventFeed';
import { Timeline } from '@/components/dashboard/Timeline';
import { MapPlaceholder } from '@/components/dashboard/MapPlaceholder';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { IncidentTable } from '@/components/dashboard/IncidentTable';
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
import { useDashboardData } from '@/hooks/useData';
import { severityConfig } from '@/lib/severity';
import type { Incident, Recommendation } from '@/lib/types';

export function OperationsPage() {
  const {
    loading,
    liveEvents,
    timeline,
    stadiumNodes,
    staffGroups,
    contextSnapshot,
    dashboard,
    incidents,
    recommendations,
  } = useDashboardData();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  const healthScore = dashboard?.aiConfidence ?? 87;

  const criticalHighSummary = useMemo(() => {
    const critical = incidents.filter((i) => i.severity === 'critical').length;
    const high = incidents.filter((i) => i.severity === 'high').length;
    return `${critical} critical · ${high} high`;
  }, [incidents]);

  if (loading) {
    return <LoadingState label="Loading live operations…" className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      <PageHeader
        title="Live Operations"
        subtitle="Real-time stadium telemetry, staffing, and operational flow"
        badge={
          <Badge variant="outline" className="border-critical/40 bg-critical/10 text-[10px] font-medium text-critical">
            <span className="relative mr-1 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-critical" />
            </span>
            LIVE
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric icon={CloudRain} label="Weather" value={contextSnapshot.weather} sub={`${contextSnapshot.temperature}°C · 18mm/h`} tone="text-warning" />
        <Metric icon={Users} label="Crowd Density" value={`${contextSnapshot.crowdDensity}%`} sub={`${contextSnapshot.attendance.toLocaleString()} attendees`} tone="text-primary" />
        <Metric icon={Activity} label="Active Incidents" value={String(contextSnapshot.activeIncidents)} sub={criticalHighSummary} tone="text-critical" />
        <Metric icon={Gauge} label="Stadium Health" value={`${healthScore}%`} sub="Within target envelope" tone="text-safe" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Environmental Sensors</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Sensor label="Wind" value="22 km/h" sub="NW" />
            <Sensor label="Precipitation" value="18 mm/h" sub="Heavy" icon={Droplets} />
            <Sensor label="Visibility" value="2.4 km" sub="Reduced" />
            <Sensor label="Humidity" value="84%" sub="High" />
            <Sensor label="Pitch Temp" value="19°C" sub="Normal" />
            <Sensor label="Air Quality" value="42 AQI" sub="Good" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Staff Deployment</h3>
          </div>
          <div className="space-y-2.5">
            {staffGroups.map((g) => {
              const pct = Math.round((g.available / g.total) * 100);
              const tone = pct >= 85 ? 'bg-safe' : pct >= 60 ? 'bg-warning' : 'bg-critical';
              return (
                <div key={g.id}>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-foreground">{g.name}</span>
                      <span className="ml-1.5 text-muted-foreground">· {g.location}</span>
                    </div>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {g.available}/{g.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', tone)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-[340px]">
          <EventFeed events={liveEvents} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MapPlaceholder nodes={stadiumNodes} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Operational Timeline</h3>
          </div>
          <Timeline items={timeline} />
        </div>
      </div>

      <div>
        <SectionHeader title="Zone Telemetry" subtitle="Per-gate load and status" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {stadiumNodes.map((n) => {
            const cfg = severityConfig[n.severity];
            return (
              <div key={n.id} className={cn('rounded-lg border bg-card p-3', cfg.border)}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {n.label}
                  </span>
                  <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                </div>
                <p className={cn('mt-2 text-2xl font-semibold tabular-nums', cfg.text)}>{n.load}%</p>
                <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{cfg.label} load</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader title="Live Recommendations" subtitle="Click a card for AI explanation" count={recommendations.length} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {recommendations.slice(0, 4).map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} onSelect={setSelectedRecommendation} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Active Incidents" subtitle="Click a row for incident details" count={incidents.length} />
        <IncidentTable incidents={incidents.slice(0, 5)} onSelect={setSelectedIncident} />
      </div>

      <Sheet open={!!selectedIncident} onOpenChange={(open) => !open && setSelectedIncident(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md scrollbar-thin">
          {selectedIncident && (
            <>
              <SheetHeader>
                <SheetDescription className="font-mono text-xs">{selectedIncident.code}</SheetDescription>
                <SheetTitle>{selectedIncident.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 px-1 text-sm">
                <p>{selectedIncident.description}</p>
                <Button className="w-full" onClick={() => setSelectedIncident(null)}>Close</Button>
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
                  AI Explanation
                </SheetDescription>
                <SheetTitle>{selectedRecommendation.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 px-1 text-sm">
                <p><strong>Reason:</strong> {selectedRecommendation.reason}</p>
                <p><strong>Action:</strong> {selectedRecommendation.impact}</p>
                <p><strong>Confidence:</strong> {selectedRecommendation.confidence}%</p>
                <Button className="w-full" onClick={() => setSelectedRecommendation(null)}>Close</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <Icon className={cn('h-4 w-4', tone)} />
      </div>
      <p className={cn('mt-2 text-2xl font-semibold tabular-nums', tone)}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Sensor({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon?: typeof Droplets;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        <span className="text-[10px] uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
