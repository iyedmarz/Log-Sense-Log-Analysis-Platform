export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:5000';

export type DashboardData = {
  active_pages: number;
  error_rate: number;
  open_alerts: number;
  total_requests: number;
  errors_over_time: { hour: string; count: number }[];
  top_pages: { page: string; count: number }[];
};

export type LogEntry = {
  ip: string;
  level: string;
  message: string;
  service: string;
  timestamp: string;
};

export type Alert = {
  title: string;
  severity: string;
  condition: string;
  status: string;
  count: number;
};

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchDashboard = () => getJSON<DashboardData>('/api/dashboard');
export const fetchLogs = () => getJSON<LogEntry[]>('/api/logs');
export const fetchAlerts = () => getJSON<Alert[]>('/api/alerts');
