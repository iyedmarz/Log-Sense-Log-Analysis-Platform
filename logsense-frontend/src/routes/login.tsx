import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@logsense.io');
  const [password, setPassword] = useState('demo1234');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    login(email);
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_30%,_var(--primary)_0%,_transparent_40%),radial-gradient(circle_at_80%_70%,_var(--primary-glow)_0%,_transparent_45%)]" />
      <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/80 p-8 backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to LogSense
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to monitor your applications
            </p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
          >
            Sign in
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo mode — any credentials work
          </p>
        </form>
      </Card>
    </div>
  );
}
