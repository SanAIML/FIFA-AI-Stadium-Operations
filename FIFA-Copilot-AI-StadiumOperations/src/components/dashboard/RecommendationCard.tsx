import { Sparkles, TrendingUp, Check, X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { statusConfig } from '@/lib/severity';
import type { Recommendation } from '@/lib/types';

export function RecommendationCard({
  rec,
  onSelect,
}: {
  rec: Recommendation;
  onSelect?: (rec: Recommendation) => void;
}) {
  const status = statusConfig[rec.status];
  const confidenceTone =
    rec.confidence >= 90
      ? 'text-safe'
      : rec.confidence >= 80
      ? 'text-warning'
      : 'text-high';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(rec)}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
        onSelect && 'cursor-pointer'
      )}
      aria-label={`Recommendation: ${rec.title}`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
            <Lightbulb className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold leading-tight text-foreground">
              {rec.title}
            </h4>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {rec.category} · {rec.zone}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={cn('shrink-0 border', status.className)}>
          {status.label}
        </Badge>
      </div>

      <div className="mt-3 space-y-2.5">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Reason
          </span>
          <p className="mt-0.5 text-[13px] leading-snug text-foreground/90">{rec.reason}</p>
        </div>
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Expected Impact
          </span>
          <p className="mt-0.5 flex items-start gap-1.5 text-[13px] leading-snug text-foreground/90">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe" />
            {rec.impact}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] text-muted-foreground">Confidence</span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full',
                  rec.confidence >= 90 ? 'bg-safe' : rec.confidence >= 80 ? 'bg-warning' : 'bg-high'
                )}
                style={{ width: `${rec.confidence}%` }}
              />
            </div>
            <span className={cn('text-xs font-semibold tabular-nums', confidenceTone)}>
              {rec.confidence}%
            </span>
          </div>
        </div>
        {rec.status === 'pending' && (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={(event) => event.stopPropagation()}
            >
              <X className="h-3 w-3" /> Reject
            </Button>
            <Button
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={(event) => event.stopPropagation()}
            >
              <Check className="h-3 w-3" /> Accept
            </Button>
          </div>
        )}
      </div>
    </button>
  );
}
