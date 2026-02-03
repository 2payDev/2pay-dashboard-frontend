import React from 'react';
import { DashboardData } from '../services/api';

interface DashboardProps {
  data: DashboardData;
}

const DashboardTailwind: React.FC<DashboardProps> = ({ data }) => {
  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatTime = (timestamp: string): string => timestamp;

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'from-emerald-500 via-emerald-400 to-emerald-500';
    if (percentage >= 50) return 'from-amber-400 via-amber-300 to-amber-400';
    return 'from-rose-500 via-rose-400 to-rose-500';
  };

  const pct = Math.max(0, Math.min(100, data.target_achievement_percentage || 0));
  const transactionTarget = 22000;
  const transactionPctRaw =
    transactionTarget > 0 ? (data.transactions_mtd / transactionTarget) * 100 : 0;
  const transactionPct = Math.max(0, Math.min(100, transactionPctRaw));
  const circleSize = 132;
  const strokeWidth = 12;
  const r = (circleSize - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="w-screen min-h-[100dvh] lg:h-screen bg-slate-950 text-slate-100 overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">
      <div className="w-full min-h-[100dvh] lg:h-full max-w-[1600px] mx-auto px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-6 flex flex-col">
        {/* Header */}
        <header className="mb-3 sm:mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              {/* Chart icon (Heroicons-style) */}
              <svg
                className="h-4 w-4 text-sky-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 20V10.5M10 20V4M16 20V13M20 20V8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-md md:text-xl lg:text-2xl font-semibold tracking-wide text-slate-100 truncate">
                Daily Performance Dashboard
              </h1>
              <p className="mt-0.5 text-[11px] md:text-xs text-slate-100 font-medium truncate">
                Live operational view • Optimized for large displays
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wide">
                Live
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] md:text-xs text-slate-400">
              {/* Clock icon */}
              <svg
                className="h-3.5 w-3.5 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6V12L15.5 13.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 pb-2">
          {/* Target Achievement (top on mobile only) */}
          <section className="sm:hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-base font-semibold text-slate-100">
                  Target Achievement
                </h2>
                <p className="text-[11px] text-slate-500">Month to date</p>
              </div>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-slate-300">
                MTD
              </span>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {/* Dual circles: turnover + transactions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Turnover circle */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative" style={{ width: circleSize, height: circleSize }}>
                    <svg width={circleSize} height={circleSize} className="block">
                      <defs>
                        <linearGradient id="targetGradTurnoverMobile" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={pct >= 80 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#fb7185'} />
                          <stop offset="100%" stopColor={pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#f43f5e'} />
                        </linearGradient>
                      </defs>
                      <circle
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={r}
                        stroke="rgba(255,255,255,0.10)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      <circle
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={r}
                        stroke="url(#targetGradTurnoverMobile)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={`${dash} ${c - dash}`}
                        transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p
                        className="font-extrabold tracking-tight text-slate-100 leading-none tabular-nums"
                        style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}
                      >
                        {pct.toFixed(1)}%
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Turnover
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transactions circle */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative" style={{ width: circleSize, height: circleSize }}>
                    <svg width={circleSize} height={circleSize} className="block">
                      <defs>
                        <linearGradient id="targetGradTxnMobile" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={transactionPct >= 80 ? '#34d399' : transactionPct >= 50 ? '#fbbf24' : '#fb7185'} />
                          <stop offset="100%" stopColor={transactionPct >= 80 ? '#22c55e' : transactionPct >= 50 ? '#f59e0b' : '#f43f5e'} />
                        </linearGradient>
                      </defs>
                      <circle
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={r}
                        stroke="rgba(255,255,255,0.10)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      <circle
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={r}
                        stroke="url(#targetGradTxnMobile)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={`${(transactionPct / 100) * c} ${c - (transactionPct / 100) * c}`}
                        transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p
                        className="font-extrabold tracking-tight text-slate-100 leading-none tabular-nums"
                        style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}
                      >
                        {transactionPct.toFixed(1)}%
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Turnover achievement */}
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Turnover
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatCurrency(data.turnover_till_date)} / {formatCurrency(data.target_till_date)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                      {pct.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Transactions achievement */}
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Transactions
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {data.transactions_mtd.toLocaleString()} / {transactionTarget.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                      {transactionPct.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(transactionPct)}`}
                      style={{ width: `${transactionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* KPI Row */}
          <section className="grid grid-cols-2 max-[420px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* KPI: Total Transactions */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-100">
                    Total transactions
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Today</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-sky-500/10 ring-1 ring-sky-400/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-sky-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 7H20M8 7L11 4M8 7L11 10M16 17H4M16 17L13 14M16 17L13 20"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
                {data.total_transactions_today.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Transactions
              </p>
            </div>

            {/* KPI: Today's Turnover */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-100">
                    Today&apos;s turnover
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Realized volume</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-emerald-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4V20M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
                {formatCurrency(data.today_turnover)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                PKR
              </p>
            </div>

            {/* KPI: Month Target */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-100">
                    Month target
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Planned volume</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-400/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-indigo-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
                {formatCurrency(data.target_till_date)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                PKR
              </p>
            </div>

            {/* KPI: Transaction Target (static) */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-100">
                    Transaction target
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Static</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-violet-500/10 ring-1 ring-violet-400/20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-violet-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 11L10 16L19 7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
                {transactionTarget.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Transactions
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Transactions */}
            <div className="lg:col-span-8 rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 overflow-hidden flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-slate-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7H19M5 12H19M5 17H13"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm md:text-base font-semibold text-slate-100">
                      Transactions
                    </h2>
                    <p className="text-[11px] text-slate-500">Last 10</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">PKR</div>
              </div>

              {/* Mobile list */}
              <div className="md:hidden flex-1 min-h-0 overflow-auto p-3 space-y-2">
                {data.last_transactions.length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    No transactions available
                  </div>
                )}
                {data.last_transactions.slice(0, 10).map((txn, idx) => {
                  const isZero = txn.amount === 0;
                  return (
                    <div
                      key={`${txn.transaction_id}-${idx}`}
                      className={`rounded-2xl p-3 ring-1 ${
                        isZero
                          ? 'bg-rose-500/10 ring-rose-400/20'
                          : 'bg-white/5 ring-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100 truncate">
                            Terminal {txn.terminal_id.padStart(3, '0')}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500 font-mono truncate">
                            {txn.transaction_id}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-semibold ${isZero ? 'text-rose-200' : 'text-slate-100'}`}>
                            {isZero ? 'ERROR' : formatCurrency(txn.amount)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">{formatTime(txn.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table (scrollable, hidden scrollbar) */}
              <div className="hidden md:block flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <table className="min-w-full text-left">
                  <thead className="sticky top-0 bg-slate-950/60 backdrop-blur border-b border-white/10">
                    <tr className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      <th className="px-4 py-3 font-semibold">Terminal</th>
                      <th className="px-4 py-3 font-semibold">Transaction ID</th>
                      <th className="px-4 py-3 font-semibold text-right">Amount</th>
                      <th className="px-4 py-3 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {data.last_transactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                          No transactions available
                        </td>
                      </tr>
                    )}
                    {data.last_transactions.slice(0, 10).map((txn, idx) => {
                      const isZero = txn.amount === 0;
                      return (
                        <tr
                          key={`${txn.transaction_id}-${idx}`}
                          className={`transition ${
                            isZero
                              ? 'bg-rose-500/10 hover:bg-rose-500/15'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <td className="px-4 py-3 text-sm font-semibold text-slate-100">
                            Terminal {txn.terminal_id.padStart(3, '0')}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400 font-mono">
                            {txn.transaction_id}
                          </td>
                          <td
                            className={`px-4 py-3 text-sm font-semibold text-right ${
                              isZero ? 'text-rose-200' : 'text-slate-100'
                            }`}
                          >
                            {isZero ? 'ERROR' : formatCurrency(txn.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400 text-right">
                            {formatTime(txn.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tablet-only: show Target below transactions (not at top) */}
            <div className="hidden sm:block lg:hidden">
              <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm md:text-base font-semibold text-slate-100">
                      Target Achievement
                    </h2>
                    <p className="text-[11px] text-slate-500">Month to date</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-slate-300">
                    MTD
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative" style={{ width: circleSize, height: circleSize }}>
                        <svg width={circleSize} height={circleSize} className="block">
                          <defs>
                            <linearGradient id="targetGradTurnoverTablet" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={pct >= 80 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#fb7185'} />
                              <stop offset="100%" stopColor={pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#f43f5e'} />
                            </linearGradient>
                          </defs>
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                          />
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="url(#targetGradTurnoverTablet)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray={`${dash} ${c - dash}`}
                            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p
                            className="font-extrabold tracking-tight text-slate-100 leading-none tabular-nums"
                            style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}
                          >
                            {pct.toFixed(1)}%
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Turnover
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="relative" style={{ width: circleSize, height: circleSize }}>
                        <svg width={circleSize} height={circleSize} className="block">
                          <defs>
                            <linearGradient id="targetGradTxnTablet" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={transactionPct >= 80 ? '#34d399' : transactionPct >= 50 ? '#fbbf24' : '#fb7185'} />
                              <stop offset="100%" stopColor={transactionPct >= 80 ? '#22c55e' : transactionPct >= 50 ? '#f59e0b' : '#f43f5e'} />
                            </linearGradient>
                          </defs>
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                          />
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="url(#targetGradTxnTablet)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray={`${(transactionPct / 100) * c} ${c - (transactionPct / 100) * c}`}
                            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p
                            className="font-extrabold tracking-tight text-slate-100 leading-none tabular-nums"
                            style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}
                          >
                            {transactionPct.toFixed(1)}%
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Transactions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Turnover
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {formatCurrency(data.turnover_till_date)} / {formatCurrency(data.target_till_date)}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-slate-100">
                          {pct.toFixed(1)}%
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Transactions
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {data.transactions_mtd.toLocaleString()} / {transactionTarget.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-slate-100">
                          {transactionPct.toFixed(1)}%
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(transactionPct)}`}
                          style={{ width: `${transactionPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Target Achievement (right side on large screens only) */}
            <div className="hidden lg:block lg:col-span-4">
              <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm shadow-black/30 overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm md:text-base font-semibold text-slate-100">
                      Target Achievement
                    </h2>
                    <p className="text-[11px] text-slate-500">Month to date</p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-slate-300">
                    MTD
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-4">
                  {/* Dual circles: turnover + transactions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {/* Turnover circle */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative" style={{ width: circleSize, height: circleSize }}>
                        <svg width={circleSize} height={circleSize} className="block">
                          <defs>
                            <linearGradient id="targetGradTurnoverDesktop" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={pct >= 80 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#fb7185'} />
                              <stop offset="100%" stopColor={pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#f43f5e'} />
                            </linearGradient>
                          </defs>
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                          />
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="url(#targetGradTurnoverDesktop)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray={`${dash} ${c - dash}`}
                            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p
                            className="font-extrabold tracking-tight text-slate-100 leading-none tabular-nums"
                            style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}
                          >
                            {pct.toFixed(1)}%
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Turnover
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Transactions circle */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative" style={{ width: circleSize, height: circleSize }}>
                        <svg width={circleSize} height={circleSize} className="block">
                          <defs>
                            <linearGradient id="targetGradTxnDesktop" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={transactionPct >= 80 ? '#34d399' : transactionPct >= 50 ? '#fbbf24' : '#fb7185'} />
                              <stop offset="100%" stopColor={transactionPct >= 80 ? '#22c55e' : transactionPct >= 50 ? '#f59e0b' : '#f43f5e'} />
                            </linearGradient>
                          </defs>
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                          />
                          <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={r}
                            stroke="url(#targetGradTxnDesktop)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray={`${(transactionPct / 100) * c} ${c - (transactionPct / 100) * c}`}
                            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p
                            className="font-extrabold tracking-tight text-slate-100 leading-none tabular-nums"
                            style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}
                          >
                            {transactionPct.toFixed(1)}%
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Transactions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Turnover achievement */}
                    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Turnover
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {formatCurrency(data.turnover_till_date)} / {formatCurrency(data.target_till_date)}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-slate-100">
                          {pct.toFixed(1)}%
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Transactions achievement */}
                    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Transactions
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {data.transactions_mtd.toLocaleString()} / {transactionTarget.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-slate-100">
                          {transactionPct.toFixed(1)}%
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(transactionPct)}`}
                          style={{ width: `${transactionPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardTailwind;


