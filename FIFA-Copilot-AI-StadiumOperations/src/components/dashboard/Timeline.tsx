import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Circle,
  Zap,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimelineItem } from '@/lib/types';

const typeConfig: Record<
  TimelineItem['type'],
  { icon: typeof AlertTriangle; tone: string; ring: string }
> = {
  alert: { icon: AlertTriangle, tone: 'text-critical bg-critical/15 ring-critical/30', ring: 'bg-critical' },
  prediction: { icon: Brain, tone: 'text-primary bg-primary/15 ring-primary/30', ring: 'bg-primary' },
  action: { icon: Zap, tone: 'text-warning bg-warning/15 ring-warning/30', ring: 'bg-warning' },
  resolution: { icon: CheckCircle2, tone: 'text-safe bg-safe/15 ring-safe/30', ring: 'bg-safe' },
  info: { icon: Info, tone: 'text-muted-foreground bg-muted ring-border', ring: 'bg-muted-foreground' },
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative">
      {items.map((item, idx) => {
        const cfg = typeConfig[item.type];
        const Icon = cfg.icon;
        return (
          <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full ring-1', cfg.tone)}>
                <Icon className="h-4 w-4" />
              </div>
              {idx < items.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-gradient-to-b from-border to-transparent" />
              )}
            </div>
            <div className="-mt-0.5 flex-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-medium tabular-nums text-muted-foreground">
                  {item.time}
                </span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {item.type}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] font-medium leading-snug text-foreground">
                {item.title}
              </p>
              {item.description && (
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { Circle };
