import { BrainCircuit, TrendingUp, CheckCircle2, CloudRain, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { OperationalMemory } from '@/lib/types';

export function OperationalMemoryCard({
  memory,
  onSelect,
}: {
  memory: OperationalMemory;
  onSelect?: (memory: OperationalMemory) => void;
}) {
  const tone =
    memory.effectiveness >= 90
      ? 'text-safe'
      : memory.effectiveness >= 80
      ? 'text-warning'
      : 'text-high';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(memory)}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        onSelect && 'cursor-pointer'
      )}
      aria-label={`Operational memory: ${memory.match}`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
            <BrainCircuit className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold leading-tight text-foreground">
              {memory.match}
            </h4>
            <span className="font-mono text-[10px] text-muted-foreground">{memory.date}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Effectiveness
          </span>
          <span className={cn('flex items-center gap-1 text-sm font-semibold tabular-nums', tone)}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {memory.effectiveness}%
          </span>
        </div>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full',
            memory.effectiveness >= 90 ? 'bg-safe' : memory.effectiveness >= 80 ? 'bg-warning' : 'bg-high'
          )}
          style={{ width: `${memory.effectiveness}%` }}
        />
      </div>

      {(memory.weather || memory.crowdLevel) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {memory.weather && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">
              <CloudRain className="h-3 w-3 text-warning" />
              {memory.weather}
            </span>
          )}
          {memory.crowdLevel && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">
              <Users className="h-3 w-3 text-primary" />
              Crowd: {memory.crowdLevel}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 space-y-2.5">
        <Field label="Situation" value={memory.situation} />
        <Field label="Recommendation" value={memory.action} />
        <Field label="Outcome" value={memory.outcome} icon={<TrendingUp className="h-3 w-3 text-safe" />} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
        {memory.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="border-border bg-background/40 text-[10px] font-normal text-muted-foreground">
            #{tag}
          </Badge>
        ))}
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <p className="mt-0.5 flex items-start gap-1.5 text-[13px] leading-snug text-foreground/90">
        {icon && <span className="mt-0.5">{icon}</span>}
        {value}
      </p>
    </div>
  );
}
