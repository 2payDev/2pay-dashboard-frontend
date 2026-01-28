import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { fetchDashboardData, DashboardData } from './services/api';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    // Load data immediately
    loadData();

    // Set up auto-refresh every minute (60000 milliseconds)
    const interval = setInterval(() => {
      loadData();
    }, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Force desktop layout (for LCD / TV screens) when ?layout=desktop or ?tv=1 is in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const forceDesktop =
      params.get('layout') === 'desktop' || params.get('tv') === '1';

    if (forceDesktop) {
      document.body.classList.add('force-desktop-layout');
    } else {
      document.body.classList.remove('force-desktop-layout');
    }
  }, []);

  if (loading && !data) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      {data ? (
        <Dashboard data={data} />
      ) : (
        <div className="loading-container">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default App;

