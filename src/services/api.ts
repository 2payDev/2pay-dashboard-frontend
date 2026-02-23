import axios from 'axios';

// Backend base URL is driven entirely by environment configuration.
// In production (e.g. Vercel), set REACT_APP_API_URL to your backend URL.
// For local development, it falls back to http://localhost:8000.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface TerminalStats {
  point: string;
  transactions: number;
  turnover: number;
}

export interface DashboardData {
  terminal_stats: TerminalStats[];
  total_transactions_today: number;
  today_turnover: number;
  turnover_till_date: number;
  transactions_mtd: number;
  target_till_date: number;
  target_achievement_percentage: number;
  // Pace-to-target
  days_elapsed: number;
  days_in_month: number;
  days_remaining: number;
  daily_run_rate_turnover: number;
  projected_turnover_eom: number;
  turnover_needed_per_day: number;
  turnover_pace_status: 'ahead' | 'on_track' | 'behind';
  daily_run_rate_transactions: number;
  projected_transactions_eom: number;
  transactions_needed_per_day: number;
  transactions_pace_status: 'ahead' | 'on_track' | 'behind';
}

const isDashboardData = (data: any): data is DashboardData => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.terminal_stats)) return false;
  const numberKeys: Array<keyof DashboardData> = [
    'total_transactions_today',
    'today_turnover',
    'turnover_till_date',
    'transactions_mtd',
    'target_till_date',
    'target_achievement_percentage',
  ];
  return numberKeys.every((key) => typeof (data as any)[key] === 'number');
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await axios.get<DashboardData>(`${API_BASE_URL}/api/dashboard`, {
      timeout: 8000,
    });
    const data = response.data;

    if (!isDashboardData(data)) {
      console.error('API response has unexpected shape:', data);
      throw new Error('Invalid dashboard data received from server');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

