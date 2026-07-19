import { useMemo, useState } from 'react';
import { BrainCircuit, Sparkles, Database, TrendingUp } from 'lucide-react';
import { OperationalMemoryCard } from '@/components/dashboard/OperationalMemoryCard';
import { PageHeader } from '@/components/shared/SectionHeader';
import { LoadingState } from '@/components/shared/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMemoryData } from '@/hooks/useData';
import type { OperationalMemory } from '@/lib/types';

export function MemoryPage() {
  const { loading, memory: operationalMemory } = useMemoryData();
  const [selected, setSelected] = useState<OperationalMemory | null>(null);

  const avgEffectiveness = useMemo(() => {
    if (operationalMemory.length === 0) return 0;
    return Math.round(
      operationalMemory.reduce((acc, m) => acc + m.effectiveness, 0) / operationalMemory.length
    );
  }, [operationalMemory]);

  const tagCount = useMemo(
    () => new Set(operationalMemory.flatMap((m) => m.tags)).size,
    [operationalMemory]
  );

  if (loading) {
    return <LoadingState label="Loading operational memory…" className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-5">
      <PageHeader
        title="Operational Memory"
        subtitle="The AI's institutional knowledge base — built from every completed match"
        badge={
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] font-medium text-primary">
            <Sparkles className="mr-1 h-3 w-3" /> {operationalMemory.length} MEMORIES
          </Badge>
        }
      />

      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5">
        <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <div className="max-w-2xl">
              <h3 className="text-sm font-semibold text-foreground">
                AI learns from every completed match
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                The system uses previous operational experience to improve future recommendations.
                Each resolved incident becomes a knowledge card — capturing the situation, the action
                taken, the outcome, and the measured effectiveness. When similar conditions arise,
                the AI surfaces the most relevant memories to inform real-time decisions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Stat label="Avg Effectiveness" value={`${avgEffectiveness}%`} tone="text-safe" />
            <Stat label="Memories Stored" value={String(operationalMemory.length)} tone="text-primary" />
            <Stat label="Tags Indexed" value={String(tagCount)} tone="text-primary" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Database className="h-3.5 w-3.5 text-primary" />
        Knowledge base · last updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · indexed by situation, zone, and effectiveness
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {operationalMemory.map((m) => (
          <OperationalMemoryCard key={m.id} memory={m} onSelect={setSelected} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 p-4 text-xs text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        Memory is consolidated into the AI model after each match. Effectiveness scores weight
        which memories are surfaced first when similar conditions are detected.
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md scrollbar-thin">
          {selected && (
            <>
              <SheetHeader>
                <SheetDescription>Previous Match Reference</SheetDescription>
                <SheetTitle>{selected.match}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 px-1 text-sm">
                <Block label="Situation" value={selected.situation} />
                <Block label="Recommendation" value={selected.action} />
                <Block label="Outcome" value={selected.outcome} />
                <Block label="Effectiveness" value={`${selected.effectiveness}%`} />
                {selected.weather && <Block label="Weather" value={selected.weather} />}
                {selected.crowdLevel && <Block label="Crowd Level" value={selected.crowdLevel} />}
                <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                  The AI uses this memory to justify live recommendations when it detects similar weather, crowd density, and operational conditions.
                </p>
                <Button className="w-full" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-background/40 px-4 py-2">
      <span className={`text-xl font-semibold tabular-nums ${tone}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-foreground/90">{value}</p>
    </div>
  );
}
