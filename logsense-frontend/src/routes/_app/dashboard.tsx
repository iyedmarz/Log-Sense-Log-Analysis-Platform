/* eslint-disable prettier/prettier */
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Activity, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchDashboard } from '@/lib/api';

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
  head: () => ({ meta: [{ title: 'Dashboard — LogSense' }] }),
});

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-popover/95 p-2 text-xs shadow-lg backdrop-blur">
      <div className="mb-1 font-medium">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 10_000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Real-time overview from your log API
        </p>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load dashboard data. Check that your API is reachable.
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total requests',
            value: data?.total_requests,
            icon: Activity,
            tone: 'text-info',
          },
          {
            label: 'Error rate',
            value: data ? `${data.error_rate}%` : undefined,
            icon: AlertTriangle,
            tone: 'text-destructive',
          },
          {
            label: 'Active pages',
            value: data?.active_pages,
            icon: FileText,
            tone: 'text-success',
          },
          {
            label: 'Open alerts',
            value: data?.open_alerts,
            icon: TrendingUp,
            tone: 'text-warning',
          },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">
              {isLoading ? '—' : (s.value ?? '—')}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">Errors over time</h2>
            <p className="text-xs text-muted-foreground">Per hour</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.errors_over_time ?? []}
                margin={{ left: -16, right: 8, top: 8 }}
              >
                <defs>
                  <linearGradient id="gErr" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-destructive)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-destructive)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-destructive)"
                  fill="url(#gErr)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 text-sm font-semibold">Top pages</h2>
          <p className="mb-4 text-xs text-muted-foreground">Most requested</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.top_pages ?? []}
                layout="vertical"
                margin={{ left: 4, right: 8 }}
              >
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="page"
                  type="category"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={140}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: 'var(--color-muted)' }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-primary)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
