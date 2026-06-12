/* eslint-disable prettier/prettier */
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAlerts } from '@/lib/api';
import { AlertTriangle, BellRing, CheckCircle2, Clock } from 'lucide-react';

export const Route = createFileRoute('/_app/alerts')({
  component: AlertsPage,
  head: () => ({ meta: [{ title: 'Alerts — LogSense' }] }),
});

const sevTone: Record<string, string> = {
  critical: 'text-destructive bg-destructive/15 border-destructive/30',
  high: 'text-warning bg-warning/15 border-warning/30',
  medium: 'text-info bg-info/15 border-info/30',
  low: 'text-muted-foreground bg-muted border-border',
};
const statusTone: Record<string, string> = {
  firing: 'text-destructive',
  acknowledged: 'text-warning',
  resolved: 'text-success',
};
const statusIcon: Record<string, any> = {
  firing: AlertTriangle,
  acknowledged: Clock,
  resolved: CheckCircle2,
};

function AlertsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 10_000,
  });

  const alerts = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Active alert conditions from your API
          </p>
        </div>
        <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
          <BellRing className="mr-2 h-4 w-4" /> New alert rule
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load alerts. Check that your API is reachable.
        </Card>
      )}

      <div className="grid gap-3">
        {alerts.map((a, i) => {
          const sev = a.severity?.toLowerCase() ?? 'low';
          const status = a.status?.toLowerCase() ?? 'firing';
          const Icon = statusIcon[status] ?? AlertTriangle;
          return (
            <Card
              key={`${a.title}-${i}`}
              className="flex items-center gap-4 p-4"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${sevTone[sev] ?? sevTone.low}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium">{a.title}</h3>
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${sevTone[sev] ?? sevTone.low}`}
                  >
                    {a.severity}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {a.condition}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-xs font-medium uppercase tracking-wider ${statusTone[status] ?? ''}`}
                >
                  {a.status}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {a.count} events
                </div>
              </div>
            </Card>
          );
        })}
        {!isLoading && alerts.length === 0 && !error && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No active alerts
          </Card>
        )}
      </div>
    </div>
  );
}
