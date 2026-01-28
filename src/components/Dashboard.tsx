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
        {/* Last 10 Transactions */}
        <div className="dashboard-card transactions-card">
          <h2>Latest Transactions</h2>
          <div className="transactions-list">
            {data.last_transactions.length > 0 ? (
              data.last_transactions.map((transaction, index) => {
                const isZeroAmount = transaction.amount === 0;
                return (
                <div
                  key={index}
                  className={`transaction-item${isZeroAmount ? ' transaction-item-error' : ''}`}
                >
                  <div className="transaction-info">
                    <span className="terminal-id">
                      Terminal {transaction.terminal_id.padStart(3, '0')}
                    </span>
                    <span className="transaction-id">{transaction.transaction_id}</span>
                    <span className="transaction-amount">
                      {transaction.amount === 0 ? 'ERROR' : formatCurrency(transaction.amount)}
                    </span>
                    <span className="transaction-time">
                      {formatTime(transaction.timestamp)}
                    </span>
                  </div>
                </div>
              )})
            ) : (
              <div className="no-data">No transactions available</div>
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

