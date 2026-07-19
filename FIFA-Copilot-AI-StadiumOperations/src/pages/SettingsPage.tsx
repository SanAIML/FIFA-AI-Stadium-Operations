import { Palette, Bell, Gauge, Globe, Bot, Moon, Sun, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/SectionHeader';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function SettingsPage() {
  const [notif, setNotif] = useState({
    critical: true,
    high: true,
    medium: false,
    voice: true,
    desktop: true,
  });
  const [simSpeed, setSimSpeed] = useState([1]);
  const [aiConfidence, setAiConfidence] = useState([85]);
  const [autoEscalate, setAutoEscalate] = useState(true);

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 p-5">
      <PageHeader
        title="Settings"
        subtitle="Configure platform behavior, notifications, and AI parameters"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SettingCard icon={Palette} title="Theme" description="Appearance and color scheme">
          <div className="grid grid-cols-2 gap-2">
            <ThemeOption label="Dark" icon={Moon} active />
            <ThemeOption label="Light" icon={Sun} />
          </div>
        </SettingCard>

        <SettingCard icon={Globe} title="Language" description="Interface and report language">
          <div className="grid grid-cols-2 gap-2">
            <Option label="English (US)" active />
            <Option label="العربية" />
            <Option label="Español" />
            <Option label="Français" />
          </div>
        </SettingCard>

        <SettingCard icon={Bell} title="Notification Settings" description="Choose which alerts reach you">
          <div className="space-y-3">
            <ToggleRow label="Critical incidents" desc="Immediate alert for P1 events" checked={notif.critical} onChange={(v) => setNotif({ ...notif, critical: v })} />
            <ToggleRow label="High severity" desc="Alert for P2 events" checked={notif.high} onChange={(v) => setNotif({ ...notif, high: v })} />
            <ToggleRow label="Medium severity" desc="Alert for P3 events" checked={notif.medium} onChange={(v) => setNotif({ ...notif, medium: v })} />
            <ToggleRow label="Voice announcements" desc="Spoken alerts in command center" checked={notif.voice} onChange={(v) => setNotif({ ...notif, voice: v })} />
            <ToggleRow label="Desktop notifications" desc="OS-level push notifications" checked={notif.desktop} onChange={(v) => setNotif({ ...notif, desktop: v })} />
          </div>
        </SettingCard>

        <SettingCard icon={Gauge} title="Simulation Speed" description="Telemetry playback rate for training mode">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Playback rate</span>
              <span className="font-mono text-sm font-semibold text-primary">{simSpeed[0]}x</span>
            </div>
            <Slider value={simSpeed} onValueChange={setSimSpeed} min={0.25} max={4} step={0.25} />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0.25x</span>
              <span>1x</span>
              <span>4x</span>
            </div>
          </div>
        </SettingCard>

        <SettingCard icon={Bot} title="AI Configuration" description="Tune recommendation and escalation behavior" className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Minimum confidence to auto-suggest</span>
                <span className="font-mono text-sm font-semibold text-primary">{aiConfidence[0]}%</span>
              </div>
              <div className="mt-2">
                <Slider value={aiConfidence} onValueChange={setAiConfidence} min={50} max={99} step={1} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Conservative (50%)</span>
                <span>Aggressive (99%)</span>
              </div>
            </div>
            <ToggleRow
              label="Auto-escalate critical incidents"
              desc="Automatically route P1 incidents to senior operations when unacknowledged for 60s"
              checked={autoEscalate}
              onChange={setAutoEscalate}
            />
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <Button size="sm" className="gap-1.5 text-xs">
                <Check className="h-3.5 w-3.5" /> Save Configuration
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Reset to Defaults
              </Button>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}

function SettingCard({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: typeof Palette;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}

function ThemeOption({ label, icon: Icon, active }: { label: string; icon: typeof Moon; active?: boolean }) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors',
        active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Option({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        'rounded-lg border px-3 py-2 text-xs transition-colors',
        active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
