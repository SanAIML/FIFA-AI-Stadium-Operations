import type { Tone } from './types';

export const severityConfig: Record<
  Tone,
  { label: string; text: string; bg: string; border: string; dot: string; ring: string }
> = {
  critical: {
    label: 'Critical',
    text: 'text-critical',
    bg: 'bg-critical/15',
    border: 'border-critical/40',
    dot: 'bg-critical',
    ring: 'ring-critical/30',
  },
  high: {
    label: 'High',
    text: 'text-high',
    bg: 'bg-high/15',
    border: 'border-high/40',
    dot: 'bg-high',
    ring: 'ring-high/30',
  },
  medium: {
    label: 'Medium',
    text: 'text-warning',
    bg: 'bg-warning/15',
    border: 'border-warning/40',
    dot: 'bg-warning',
    ring: 'ring-warning/30',
  },
  warning: {
    label: 'Warning',
    text: 'text-warning',
    bg: 'bg-warning/15',
    border: 'border-warning/40',
    dot: 'bg-warning',
    ring: 'ring-warning/30',
  },
  low: {
    label: 'Low',
    text: 'text-safe',
    bg: 'bg-safe/15',
    border: 'border-safe/40',
    dot: 'bg-safe',
    ring: 'ring-safe/30',
  },
  safe: {
    label: 'Safe',
    text: 'text-safe',
    bg: 'bg-safe/15',
    border: 'border-safe/40',
    dot: 'bg-safe',
    ring: 'ring-safe/30',
  },
  primary: {
    label: 'Info',
    text: 'text-primary',
    bg: 'bg-primary/15',
    border: 'border-primary/40',
    dot: 'bg-primary',
    ring: 'ring-primary/30',
  },
};

export const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  active: { label: 'Active', className: 'bg-critical/15 text-critical border-critical/40' },
  acknowledged: { label: 'Acknowledged', className: 'bg-primary/15 text-primary border-primary/40' },
  monitoring: { label: 'Monitoring', className: 'bg-warning/15 text-warning border-warning/40' },
  resolved: { label: 'Resolved', className: 'bg-safe/15 text-safe border-safe/40' },
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning border-warning/40' },
  accepted: { label: 'Accepted', className: 'bg-primary/15 text-primary border-primary/40' },
  rejected: { label: 'Rejected', className: 'bg-muted text-muted-foreground border-border' },
  applied: { label: 'Applied', className: 'bg-safe/15 text-safe border-safe/40' },
};

export const priorityConfig: Record<string, string> = {
  P1: 'bg-critical/15 text-critical border-critical/40',
  P2: 'bg-high/15 text-high border-high/40',
  P3: 'bg-warning/15 text-warning border-warning/40',
  P4: 'bg-muted text-muted-foreground border-border',
};
