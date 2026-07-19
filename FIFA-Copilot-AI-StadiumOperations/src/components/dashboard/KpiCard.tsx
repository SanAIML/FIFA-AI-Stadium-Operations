import { Activity, AlertTriangle, ShieldAlert, Users, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Kpi } from '@/lib/types';

const iconMap: Record<string, typeof Activity> = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  'shield-alert': ShieldAlert,
  users: Users,
};

const toneRing: Record<string, string> = {
  safe: 'text-safe ring-safe/25 bg-safe/10',
  warning: 'text-warning ring-warning/25 bg-warning/10',
  high: 'text-high ring-high/25 bg-high/10',
  critical: 'text-critical ring-critical/25 bg-critical/10',
  primary: 'text-primary ring-primary/25 bg-primary/10',
};

const barTone: Record<string, string> = {
  safe: 'bg-safe',
  warning: 'bg-warning',
  high: 'bg-high',
  critical: 'bg-critical',
  primary: 'bg-primary',
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = iconMap[kpi.icon] ?? Activity;
  const TrendIcon = kpi.trend === 'up' ? ArrowUp : kpi.trend === 'down' ? ArrowDown : Minus;
  const trendTone =
    kpi.trend === 'up'
      ? kpi.id === 'incidents' || kpi.id === 'risks'
        ? 'text-critical'
        : 'text-safe'
      : kpi.trend === 'down'
      ? kpi.id === 'staff'
        ? 'text-warning'
        : 'text-safe'
      : 'text-muted-foreground';

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {kpi.label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums text-foreground">
              {kpi.value}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg ring-1',
            toneRing[kpi.tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={cn('flex items-center gap-0.5 text-[11px] font-medium', trendTone)}>
            <TrendIcon className="h-3 w-3" />
            {kpi.delta}
          </span>
          <span className="text-[11px] text-muted-foreground">vs last hour</span>
        </div>
      </div>

      {kpi.id === 'health' && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all', barTone[kpi.tone])}
            style={{ width: `${kpi.numeric}%` }}
          />
        </div>
      )}
    </div>
  );
}
