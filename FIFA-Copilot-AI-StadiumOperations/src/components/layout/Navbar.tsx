import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Radio,
  MapPin,
  Command,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DemoModeBadge } from '@/components/shared/DemoModeBadge';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/60 px-5 glass">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-foreground">
            FIFA Copilot
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Mission Control</span>
        </div>
      </div>

      <DemoModeBadge />

      <div className="flex items-center gap-2 rounded-full border border-critical/40 bg-critical/10 px-3 py-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-critical" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-critical">
          Live Match
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">M47 · 73:42</span>
      </div>

      <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 md:flex">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground">Lusail Stadium</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="relative ml-auto hidden flex-1 max-w-md lg:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          aria-label="Search incidents, zones, staff, recommendations"
          placeholder="Search incidents, zones, staff, recommendations…"
          className="h-9 w-full rounded-lg border border-border bg-background/50 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-3">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-critical ring-2 ring-card" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-1.5 py-1 transition-colors hover:bg-accent"
              aria-label="Open user menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/15 text-[11px] font-semibold text-primary">
                  OM
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-xs font-medium text-foreground">Ops Manager</span>
                <span className="text-[10px] text-muted-foreground">Level 3 Access</span>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Operations Manager</span>
                <span className="text-xs text-muted-foreground">{email ?? 'ops.manager@fifa.org'}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Shift Handover</DropdownMenuItem>
            <DropdownMenuItem>Access Logs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-critical" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 text-xs xl:flex"
          onClick={handleLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </Button>

        <div className="hidden items-center gap-1.5 rounded-lg border border-safe/30 bg-safe/10 px-2.5 py-1.5 xl:flex">
          <Radio className="h-3.5 w-3.5 text-safe" />
          <span className="text-[11px] font-medium text-safe">All Channels</span>
        </div>
      </div>
    </header>
  );
}
