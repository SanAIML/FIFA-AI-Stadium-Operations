import { useMemo, useState } from 'react';
import { Search, Filter, ShieldAlert, Clock, User, MapPin, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/SectionHeader';
import { IncidentTable } from '@/components/dashboard/IncidentTable';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { severityConfig, statusConfig, priorityConfig } from '@/lib/severity';
import { useIncidentsData } from '@/hooks/useData';
import type { Incident, Severity, IncidentStatus } from '@/lib/types';

const severityFilters: (Severity | 'all')[] = ['all', 'critical', 'high', 'medium', 'low'];
const statusFilters: (IncidentStatus | 'all')[] = ['all', 'active', 'acknowledged', 'monitoring', 'resolved'];

export function IncidentsPage() {
  const { loading, incidents: allIncidents } = useIncidentsData();
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [status, setStatus] = useState<IncidentStatus | 'all'>('all');
  const [selected, setSelected] = useState<Incident | null>(null);

  const filtered = useMemo(() => {
    return allIncidents.filter((i) => {
      if (severity !== 'all' && i.severity !== severity) return false;
      if (status !== 'all' && i.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.assignedTeam.toLowerCase().includes(q) ||
          i.zone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allIncidents, query, severity, status]);

  if (loading) {
    return <LoadingState label="Loading incidents…" className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      <PageHeader
        title="Incident Management"
        subtitle="Track, triage, and resolve operational incidents across the stadium"
        badge={
          <Badge variant="outline" className="border-critical/40 bg-critical/10 text-[10px] font-medium text-critical">
            {allIncidents.filter((i) => i.status === 'active').length} ACTIVE
          </Badge>
        }
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code, title, team, or zone…"
              aria-label="Search incidents"
              className="h-9 w-full rounded-lg border border-border bg-background/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Severity</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {severityFilters.map((s) => (
                <Chip key={s} active={severity === s} onClick={() => setSeverity(s)}>
                  {s === 'all' ? 'All' : severityConfig[s as Severity].label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Status</span>
            <div className="flex flex-wrap gap-1.5">
              {statusFilters.map((s) => (
                <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                  {s === 'all' ? 'All' : statusConfig[s as IncidentStatus].label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {allIncidents.length} incidents
        </p>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <ShieldAlert className="h-3.5 w-3.5" /> Export Log
        </Button>
      </div>

      <IncidentTable incidents={filtered} onSelect={(i) => setSelected(i)} />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md scrollbar-thin">
          {selected && <IncidentDetail incident={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
        active
          ? 'border-primary/40 bg-primary/15 text-primary'
          : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

function IncidentDetail({ incident }: { incident: Incident }) {
  const cfg = severityConfig[incident.severity];
  const status = statusConfig[incident.status];
  return (
    <>
      <SheetHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className={cn('flex h-2.5 w-2.5 rounded-full', cfg.dot)} />
          <SheetDescription className="font-mono text-xs text-muted-foreground">
            {incident.code}
          </SheetDescription>
        </div>
        <SheetTitle className="text-base font-semibold text-foreground">
          {incident.title}
        </SheetTitle>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline" className={cn('border text-[10px]', cfg.text, cfg.bg, cfg.border)}>
            {cfg.label}
          </Badge>
          <Badge variant="outline" className={cn('border text-[10px]', status.className)}>
            {status.label}
          </Badge>
          <Badge variant="outline" className={cn('border text-[10px] font-semibold', priorityConfig[incident.priority])}>
            {incident.priority}
          </Badge>
        </div>
      </SheetHeader>

      <div className="space-y-4 px-1 pb-6">
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <p className="text-[13px] leading-relaxed text-foreground/90">{incident.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailField icon={User} label="Assigned Team" value={incident.assignedTeam} />
          <DetailField icon={Clock} label="ETA" value={incident.eta} />
          <DetailField icon={MapPin} label="Zone" value={incident.zone} />
          <DetailField icon={Activity} label="Reported" value={incident.reportedAt} />
        </div>

        <div>
          <h4 className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Incident Timeline
          </h4>
          <ol className="relative space-y-3 border-l border-border pl-4">
            {incident.updates.map((u, idx) => (
              <li key={idx} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{u.time}</span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{u.actor}</span>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-foreground/90">{u.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button size="sm" className="gap-1.5 text-xs">
            <ShieldAlert className="h-3.5 w-3.5" /> Escalate
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            Acknowledge
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            Resolve
          </Button>
        </div>
      </div>
    </>
  );
}

function DetailField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-1 text-[13px] font-medium text-foreground">{value}</p>
    </div>
  );
}
