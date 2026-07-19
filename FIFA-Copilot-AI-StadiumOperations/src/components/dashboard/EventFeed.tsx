import { Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { severityConfig } from '@/lib/severity';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { LiveEvent } from '@/lib/types';

export function EventFeed({ events }: { events: LiveEvent[] }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Live Event Feed</h3>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-critical" />
          </span>
          Streaming
        </span>
      </div>
      <ScrollArea className="flex-1">
        <ol className="relative px-4 py-3">
          {events.map((event, idx) => {
            const cfg = severityConfig[event.severity];
            return (
              <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <span className={cn('mt-1 h-2.5 w-2.5 rounded-full ring-2 ring-card', cfg.dot)} />
                  {idx < events.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="-mt-0.5 flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-[11px] font-medium', cfg.text)}>
                      {cfg.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {event.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] font-medium leading-snug text-foreground">
                    {event.title}
                  </p>
                  {event.detail && (
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {event.detail}
                    </p>
                  )}
                  {event.zone && (
                    <span className="mt-1 inline-block rounded border border-border bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {event.zone}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </ScrollArea>
    </div>
  );
}
