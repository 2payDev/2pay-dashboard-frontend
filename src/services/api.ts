import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Transaction {
  terminal_id: string;
  transaction_id: string;
  amount: number;
  timestamp: string;
}

export interface DashboardData {
  last_transactions: Transaction[];
  total_transactions_today: number;
  today_turnover: number;
  turnover_till_date: number;
  transactions_mtd: number;
  target_till_date: number;
  target_achievement_percentage: number;
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await axios.get<DashboardData>(`${API_BASE_URL}/api/dashboard`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

