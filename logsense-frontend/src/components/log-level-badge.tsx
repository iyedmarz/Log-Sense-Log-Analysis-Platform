const styles: Record<string, string> = {
  error: 'bg-destructive/15 text-destructive border-destructive/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  info: 'bg-info/15 text-info border-info/30',
  debug: 'bg-muted text-muted-foreground border-border',
};

export function LogLevelBadge({ level }: { level: string }) {
  const key = (level || 'info').toLowerCase();
  const cls = styles[key] ?? styles.info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {key}
    </span>
  );
}
