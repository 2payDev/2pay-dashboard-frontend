import React from 'react';
import './Dashboard.css';
import { DashboardData } from '../services/api';

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp: string): string => {
    return timestamp;
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)';
    if (percentage >= 50) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #b45309 100%)';
    return 'linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Daily Performance Dashboard</h1>
        <div className="last-updated">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Daily Terminal Performance */}
        <div className="dashboard-card transactions-card">
          <h2>Daily Terminal Performance</h2>
          <div className="transactions-list">
            {data.terminal_stats.length > 0 ? (
              data.terminal_stats.map((stat, index) => {
                return (
                <div
                  key={index}
                  className="transaction-item"
                >
                  <div className="transaction-info">
                    <span className="terminal-id">
                      {stat.point}
                    </span>
                    <span className="transaction-id">{stat.transactions.toLocaleString()} transactions</span>
                    <span className="transaction-amount">
                      {formatCurrency(stat.turnover)}
                    </span>
                  </div>
                </div>
              )})
            ) : (
              <div className="no-data">No terminal data available</div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="dashboard-card stats-card">
          <h2>Total Transactions (Today)</h2>
          <div className="stat-value large">
            {data.total_transactions_today.toLocaleString()}
          </div>
          <div className="stat-label">Transactions</div>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Today's Turnover</h2>
          <div className="stat-value large currency" style={{fontSize: '2.8rem'}}>
            {formatCurrency(data.today_turnover)}
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <h2>Total Month Target</h2>
          <div className="stat-value large currency" style={{fontSize: '2.6rem'}}>
            {formatCurrency(data.target_till_date)}
          </div>
        </div>

        {/* Target Achievement */}
        <div className="dashboard-card achievement-card">
          <h2>Target Achievement</h2>
          <div className="achievement-content">
            <div className="achievement-percentage">
              {data.target_achievement_percentage.toFixed(1)}%
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(data.target_achievement_percentage, 100)}%`,
                  background: getProgressBarColor(data.target_achievement_percentage),
                }}
              ></div>
            </div>
            <div className="achievement-details">
              <span>Achieved: {formatCurrency(data.turnover_till_date)}</span>
              <span>Target: {formatCurrency(data.target_till_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

