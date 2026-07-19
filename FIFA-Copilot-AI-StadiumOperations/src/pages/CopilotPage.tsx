import { useMemo } from 'react';
import { Bot, CloudRain, Users, AlertTriangle, Lightbulb, HelpCircle, Sparkles, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { PageHeader } from '@/components/shared/SectionHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { defaultWelcomeMessage } from '@/services/chatService';
import { useChatContext, useDashboardData } from '@/hooks/useData';
import { severityConfig } from '@/lib/severity';

export function CopilotPage() {
  const { loading, recommendations, incidents, suggestedPrompts, contextSnapshot, dashboard, isDemoMode } =
    useDashboardData();
  const chatContext = useChatContext();

  const pendingRecs = recommendations.filter((r) => r.status === 'pending');
  const activeIncidents = incidents.filter((i) => i.status === 'active' || i.status === 'acknowledged');
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
    return <LoadingState label="Loading AI Copilot…" className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      <PageHeader
        title="AI Copilot"
        subtitle="Conversational operations intelligence with live context awareness"
        badge={
          <Badge variant="outline" className="border-safe/30 bg-safe/10 text-[10px] font-medium text-safe">
            <Sparkles className="mr-1 h-3 w-3" /> ONLINE
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-[calc(100vh-180px)] min-h-[600px] lg:col-span-2">
          <ChatPanel
            messages={chatMessages}
            suggestions={suggestedPrompts}
            context={chatContextValue}
          />
        </div>

        <div className="space-y-4">
          <ContextCard
            icon={CloudRain}
            title="Current Weather"
            tone="text-warning"
            ring="ring-warning/25 bg-warning/10"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-foreground">{contextSnapshot.weather}</span>
              <span className="text-sm text-muted-foreground">{contextSnapshot.temperature}°C</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Precipitation 18mm/h · Wind 22km/h NW</p>
          </ContextCard>

          <ContextCard icon={Users} title="Current Crowd Density" tone="text-primary" ring="ring-primary/25 bg-primary/10">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-foreground">{contextSnapshot.crowdDensity}%</span>
              <span className="text-xs text-muted-foreground">
                {contextSnapshot.attendance.toLocaleString()} / {contextSnapshot.capacity.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${contextSnapshot.crowdDensity}%` }} />
            </div>
          </ContextCard>

          <ContextCard icon={AlertTriangle} title="Current Incidents" tone="text-critical" ring="ring-critical/25 bg-critical/10">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-foreground">{contextSnapshot.activeIncidents} Active</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {activeIncidents.slice(0, 3).map((inc) => {
                const cfg = severityConfig[inc.severity];
                return (
                  <li key={inc.id} className="flex items-center gap-2">
                    <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                    <span className="text-xs text-foreground/90">{inc.title}</span>
                  </li>
                );
              })}
            </ul>
          </ContextCard>

          <ContextCard icon={Lightbulb} title="Current Recommendations" tone="text-primary" ring="ring-primary/25 bg-primary/10">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-foreground">{pendingRecs.length} Pending</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {pendingRecs.map((rec) => (
                <li key={rec.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground/90">{rec.title}</span>
                  <span className="font-mono text-[10px] text-safe">{rec.confidence}%</span>
                </li>
              ))}
            </ul>
          </ContextCard>

          <ContextCard icon={HelpCircle} title="Suggested Questions" tone="text-primary" ring="ring-primary/25 bg-primary/10">
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </ContextCard>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card/40 p-3 text-[11px] text-muted-foreground">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            Context refreshed every 15s · AI model: FIFA-Ops-v4.2
          </div>
        </div>
      </div>
    </div>
  );
}

export { Bot };

function ContextCard({
  icon: Icon,
  title,
  tone,
  ring,
  children,
}: {
  icon: typeof Bot;
  title: string;
  tone: string;
  ring: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg ring-1', ring)}>
          <Icon className={cn('h-4 w-4', tone)} />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
