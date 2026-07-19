import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { getRememberedEmail } from '@/utils/auth';
import { cn } from '@/lib/utils';

export function LoginPage() {
  const { authenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState(getRememberedEmail() || 'admin@fifa.com');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(Boolean(getRememberedEmail()));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const success = login(email.trim(), password, remember);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid Email or Password.');
    }
    setSubmitting(false);
  };

  return (
    <div className="login-scene relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="login-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="login-radial absolute inset-0" aria-hidden="true" />
      <div className="login-map absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="login-scan absolute inset-0" aria-hidden="true" />

      <div className="login-stadium-lights absolute inset-0" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="login-light-beam"
            style={{
              left: `${10 + index * 11}%`,
              animationDelay: `${index * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="login-particles absolute inset-0" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="login-particle"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 23) % 100}%`,
              animationDelay: `${(index % 6) * 0.8}s`,
              animationDuration: `${6 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
            <Activity className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
            FIFA World Cup Operations Command Center
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[0.18em] text-foreground">FIFA COPILOT</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AI Stadium Operations Intelligence Platform
          </p>
        </div>

        <div className="login-card rounded-2xl border border-primary/20 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="admin@fifa.com"
                  aria-invalid={Boolean(error)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter password"
                  aria-invalid={Boolean(error)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-sm text-critical" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                />
                Remember Me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot Password
              </button>
            </div>

            <Button
              type="submit"
              className={cn('h-11 w-full gap-2 text-sm font-semibold', submitting && 'opacity-80')}
              disabled={submitting}
            >
              <ShieldCheck className="h-4 w-4" />
              Sign In
            </Button>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Powered by AI
        </div>
      </div>
    </div>
  );
}
