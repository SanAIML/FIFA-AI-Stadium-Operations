import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingState({ label = 'Loading live data…', className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn('flex min-h-[240px] flex-col items-center justify-center gap-3 text-muted-foreground', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center" role="status" aria-label="Loading page">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
