/* eslint-disable prettier/prettier */
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogLevelBadge } from '@/components/log-level-badge';
import { fetchLogs } from '@/lib/api';
import { Search } from 'lucide-react';

export const Route = createFileRoute('/_app/logs')({
  component: LogsPage,
  head: () => ({ meta: [{ title: 'Logs — LogSense' }] }),
});

const levels = ['all', 'error', 'warning', 'info', 'debug'] as const;

function LogsPage() {
  const [filter, setFilter] = useState<(typeof levels)[number]>('all');
  const [q, setQ] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['logs'],
    queryFn: fetchLogs,
    refetchInterval: 5_000,
  });

  const filtered = useMemo(() => {
    const logs = data ?? [];
    return logs.filter((l) => {
      if (filter !== 'all' && l.level?.toLowerCase() !== filter) return false;
      if (
        q &&
        !`${l.message} ${l.service} ${l.ip}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [data, filter, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Logs</h1>
        <p className="text-sm text-muted-foreground">
          Live events from your API
        </p>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load logs. Check that your API is reachable.
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search message, service or IP…"
              className="h-9 pl-9 bg-muted/40"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 p-1">
            {levels.map((lv) => (
              <Button
                key={lv}
                variant={filter === lv ? 'default' : 'ghost'}
                size="sm"
                className={`h-7 px-3 text-xs capitalize ${filter === lv ? '' : 'text-muted-foreground'}`}
                onClick={() => setFilter(lv)}
              >
                {lv}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[180px_90px_120px_1fr] gap-3 border-b border-border/60 bg-muted/30 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Timestamp</span>
          <span>Level</span>
          <span>IP</span>
          <span>Message</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.map((log, i) => (
            <div
              key={`${log.timestamp}-${i}`}
              className="grid grid-cols-[180px_90px_120px_1fr] items-center gap-3 border-b border-border/40 px-4 py-2.5 text-sm transition hover:bg-muted/40"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {log.timestamp}
              </span>
              <LogLevelBadge level={log.level} />
              <span className="truncate font-mono text-xs text-foreground/80">
                {log.ip}
              </span>
              <div className="min-w-0">
                <div className="truncate font-mono text-xs">{log.message}</div>
                {log.service && (
                  <div className="truncate font-mono text-[11px] text-muted-foreground">
                    {log.service}
                  </div>
                )}
              </div>
            </div>
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No logs match your filters
            </div>
          )}
          {isLoading && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}
        </div>
        <div className="border-t border-border/60 bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
          Showing {filtered.length} of {data?.length ?? 0} events
        </div>
      </Card>
    </div>
  );
}
