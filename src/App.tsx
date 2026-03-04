import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import DashboardTailwind from './components/DashboardTailwind';
import LoginPage from './components/LoginPage';
import { fetchDashboardData, DashboardData } from './services/api';
import { isAuthenticated, logout } from './services/auth';
import axios from 'axios';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setData(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const loadData = async () => {
    try {
      setError(null);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
        setIsLoggedIn(false);
        return;
      }
      setError('Failed to load dashboard data');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      }
    } catch {
      // ignore if localStorage is not available
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', next);
      } catch {
        // ignore if localStorage is not available
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    loadData();

    intervalRef.current = setInterval(() => {
      loadData();
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

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

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

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
    <div className="App" style={{ position: 'relative' }}>
      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          padding: '6px 14px',
          background: '#146252',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        Logout
      </button>
      {data ? (
        <DashboardTailwind data={data} theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <div className="loading-container">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default App;

