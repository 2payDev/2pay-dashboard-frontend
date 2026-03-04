import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import DashboardTailwind from './components/DashboardTailwind';
import LoginPage from './components/LoginPage';
import { fetchDashboardData, DashboardData } from './services/api';
import { isAuthenticated, logout } from './services/auth';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setData(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigate('/login', { replace: true });
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
        navigate('/login', { replace: true });
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

  useEffect(() => {
    // If user manually visits /login while already logged in, send them to dashboard.
    if (isLoggedIn && location.pathname === '/login') {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

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

  const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const DashboardScreen = () => {
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
        {data ? (
          <DashboardTailwind data={data} theme={theme} onToggleTheme={toggleTheme} onLogout={handleLogout} />
        ) : (
          <div className="loading-container">
            <p>No data available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              navigate('/dashboard', { replace: true });
            }}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardScreen />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

