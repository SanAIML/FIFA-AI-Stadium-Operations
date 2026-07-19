import { FileText, AlertOctagon, Timer, Target, BrainCircuit, Download, FileSpreadsheet, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { severityConfig } from '@/lib/severity';
import type { ReportMetric } from '@/lib/types';

const iconMap: Record<string, typeof FileText> = {
  'file-text': FileText,
  'alert-octagon': AlertOctagon,
  timer: Timer,
  target: Target,
  'brain-circuit': BrainCircuit,
};

export function ReportCard({
  metric,
  onExportPdf,
}: {
  metric: ReportMetric;
  onExportPdf?: () => void;
}) {
  const Icon = iconMap[metric.icon] ?? FileText;
  const cfg = severityConfig[metric.tone];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg ring-1', cfg.bg, cfg.ring)}>
          <Icon className={cn('h-5 w-5', cfg.text)} />
        </div>
        {metric.trend && (
          <span className="rounded-full border border-safe/30 bg-safe/10 px-2 py-0.5 text-[10px] font-medium text-safe">
            {metric.trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {metric.title}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{metric.value}</p>
      {metric.sub && <p className="mt-1 text-xs text-muted-foreground">{metric.sub}</p>}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px]" onClick={onExportPdf}>
          <Download className="h-3 w-3" /> PDF
        </Button>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px]">
          <FileSpreadsheet className="h-3 w-3" /> CSV
        </Button>
      </div>
    </div>
  );
}

export function ReportActions({ onExportPdf }: { onExportPdf?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onExportPdf}>
        <Download className="h-4 w-4" /> Export PDF
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5">
        <FileSpreadsheet className="h-4 w-4" /> Export CSV
      </Button>
      <Button size="sm" className="gap-1.5" onClick={onExportPdf}>
        <Sparkles className="h-4 w-4" /> Generate AI Report
      </Button>
    </div>
  );
}
