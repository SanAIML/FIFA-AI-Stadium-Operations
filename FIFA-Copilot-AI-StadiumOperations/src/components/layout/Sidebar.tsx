import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  ShieldAlert,
  Bot,
  BrainCircuit,
  FileBarChart,
  Settings,
  Activity,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/operations', label: 'Live Operations', icon: Radio },
  { to: '/incidents', label: 'Incidents', icon: ShieldAlert },
  { to: '/copilot', label: 'AI Copilot', icon: Bot },
  { to: '/memory', label: 'Operational Memory', icon: BrainCircuit },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card/40 glass">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <Activity className="h-5 w-5 text-primary" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-safe ring-2 ring-card" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-wide text-foreground">
            FIFA COPILOT
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Stadium Ops Intel
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Mission Control
        </p>
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all',
                      isActive
                        ? 'bg-primary/15 text-primary ring-1 ring-primary/25'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg border border-border bg-background/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              System Status
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-safe">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-safe" />
              </span>
              Connected
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'AI', value: '98ms' },
              { label: 'Sensors', value: '1.2k' },
              { label: 'Sync', value: 'Live' },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-border bg-card/40 py-1.5">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
                <div className="text-[11px] font-semibold text-foreground">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
          <CircleDot className="h-3 w-3 text-primary" />
          <span>v2.4.1 · Region: QAT-1</span>
        </div>
      </div>
    </aside>
  );
}
