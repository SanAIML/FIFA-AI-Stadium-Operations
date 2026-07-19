import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { severityConfig, statusConfig, priorityConfig } from '@/lib/severity';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Incident } from '@/lib/types';

export function IncidentTable({
  incidents,
  onSelect,
}: {
  incidents: Incident[];
  onSelect?: (incident: Incident) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-10 px-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Severity
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Incident
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Assigned Team
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              ETA
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Priority
            </TableHead>
            <TableHead className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => {
            const cfg = severityConfig[incident.severity];
            const status = statusConfig[incident.status];
            return (
              <TableRow
                key={incident.id}
                className={cn(
                  'cursor-pointer border-border transition-colors hover:bg-accent/50',
                  incident.severity === 'critical' && 'bg-critical/[0.04]'
                )}
                onClick={() => onSelect?.(incident)}
              >
                <TableCell className="px-3 py-3">
                  <span className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                    <span className={cn('text-xs font-semibold', cfg.text)}>
                      {cfg.label}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-foreground">
                      {incident.title}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {incident.code} · {incident.zone} · {incident.reportedAt}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs text-foreground/90">
                  {incident.assignedTeam}
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-mono text-xs tabular-nums text-foreground/90">
                    {incident.eta}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={cn('border px-1.5 py-0 text-[10px] font-semibold', priorityConfig[incident.priority])}
                  >
                    {incident.priority}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className={cn('border text-[10px] font-medium', status.className)}>
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
