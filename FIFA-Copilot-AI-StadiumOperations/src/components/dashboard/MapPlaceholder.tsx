import { cn } from '@/lib/utils';
import { severityConfig } from '@/lib/severity';
import type { StadiumNode } from '@/lib/types';

const typeIcon: Record<StadiumNode['type'], string> = {
  gate: 'G',
  medical: '+',
  parking: 'P',
  security: 'S',
};

export function MapPlaceholder({ nodes }: { nodes: StadiumNode[] }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Stadium Map</h3>
          <p className="text-[10px] text-muted-foreground">Live zone telemetry overlay</p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          {(['safe', 'warning', 'high', 'critical'] as const).map((s) => (
            <span key={s} className="flex items-center gap-1 text-muted-foreground">
              <span className={cn('h-2 w-2 rounded-full', severityConfig[s].dot)} />
              {severityConfig[s].label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full bg-grid bg-radial-fade">
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="pitchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="150" rx="170" ry="120" fill="hsl(var(--secondary) / 0.4)" stroke="hsl(var(--border))" strokeWidth="1.5" />
          <ellipse cx="200" cy="150" rx="120" ry="85" fill="url(#pitchGlow)" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="150" y="120" width="100" height="60" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" rx="2" />
          <circle cx="200" cy="150" r="4" fill="hsl(var(--primary) / 0.5)" />
          <line x1="200" y1="65" x2="200" y2="235" stroke="hsl(var(--border))" strokeWidth="0.75" strokeDasharray="2 4" />
        </svg>

        {nodes.map((node) => {
          const cfg = severityConfig[node.severity];
          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="group relative flex flex-col items-center">
                {node.severity === 'critical' && (
                  <span className={cn('absolute h-8 w-8 animate-pulse-ring rounded-full', cfg.dot)} />
                )}
                <div
                  className={cn(
                    'relative flex h-7 w-7 items-center justify-center rounded-full border-2 bg-card text-[10px] font-bold ring-2',
                    cfg.dot,
                    cfg.text,
                    'ring-card'
                  )}
                >
                  {typeIcon[node.type]}
                </div>
                <div className="mt-1 rounded-md border border-border bg-card/90 px-1.5 py-0.5 text-center backdrop-blur">
                  <div className="text-[9px] font-semibold leading-none text-foreground">
                    {node.label}
                  </div>
                  <div className={cn('text-[9px] font-medium leading-tight', cfg.text)}>
                    {node.load}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute bottom-3 right-3 rounded-md border border-border bg-card/80 px-2 py-1 font-mono text-[9px] text-muted-foreground backdrop-blur">
          LUSAIL · 25.4184°N 51.4900°E
        </div>
      </div>
    </div>
  );
}
