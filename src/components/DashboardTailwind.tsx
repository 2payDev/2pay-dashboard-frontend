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

  // Brand green for good, amber for warning, rose for behind
  const getProgressColor = (pct: number): string => {
    if (pct >= 80) return 'from-brand-dark to-brand-green';
    if (pct >= 50) return 'from-amber-500 to-amber-400';
    return 'from-rose-500 to-rose-400';
  };

  const getPaceColor = (status: string) => {
    if (status === 'ahead')    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    if (status === 'on_track') return 'bg-brand-icon text-brand-green ring-1 ring-brand-green/30';
    return 'bg-rose-50 text-rose-600 ring-1 ring-rose-200';
  };

  const paceLabel = (status: string) => {
    if (status === 'ahead')    return 'Ahead';
    if (status === 'on_track') return 'On Track';
    return 'Behind';
  };

  const pct = Math.max(0, Math.min(100, data.target_achievement_percentage || 0));
  const transactionTarget = 21500;
  const transactionPctRaw = transactionTarget > 0 ? (data.transactions_mtd / transactionTarget) * 100 : 0;
  const transactionPct = Math.max(0, Math.min(100, transactionPctRaw));

  const circleSize = 132;
  const strokeWidth = 12;
  const r = (circleSize - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const transactionDash = (transactionPct / 100) * c;

  const circleTrack = 'rgba(20,98,82,0.12)';
  const CircleGrad = ({ id, pctValue }: { id: string; pctValue: number }) => (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={pctValue >= 50 ? '#043D31' : pctValue >= 30 ? '#f59e0b' : '#f43f5e'} />
        <stop offset="100%" stopColor={pctValue >= 50 ? '#146252' : pctValue >= 30 ? '#fbbf24' : '#fb7185'} />
      </linearGradient>
    </defs>
  );

  // Shared class tokens
  const cardShadow = 'shadow-[0_2px_16px_-3px_rgba(20,98,82,0.10),0_1px_4px_rgba(0,0,0,0.04)]';
  const iconContainer = 'bg-gradient-to-br from-brand-icon to-[#d6ebe5]';

  // Reusable progress bar rows
  const TurnoverBarRow = () => (
    <div className={`bg-white rounded-2xl border border-brand-border ${cardShadow} p-3 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-nav text-brand-body">Monthly Turnover</p>
          <p className="mt-1 text-sm font-body font-medium text-brand-heading">
            {formatCurrency(data.turnover_till_date)} / {formatCurrency(data.target_till_date)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-nav font-bold px-1.5 py-0.5 rounded-full ${getPaceColor(data.turnover_pace_status)}`}>
            {paceLabel(data.turnover_pace_status)}
          </span>
          <p className="text-lg font-heading font-bold text-brand-text">{pct.toFixed(1)}%</p>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-[#e5edeb] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] font-body text-brand-body">
        Need <span className="text-brand-green font-semibold">{formatCurrency(data.turnover_needed_per_day)}/day</span>
        {' · '}Projected <span className="text-brand-green font-semibold">{formatCurrency(data.projected_turnover_eom)}</span>
      </p>
    </div>
  );

  const TransactionsBarRow = () => (
    <div className={`bg-white rounded-2xl border border-brand-border ${cardShadow} p-3 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-nav text-brand-body">Monthly Transactions</p>
          <p className="mt-1 text-sm font-body font-medium text-brand-heading">
            {data.transactions_mtd.toLocaleString()} / {transactionTarget.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-nav font-bold px-1.5 py-0.5 rounded-full ${getPaceColor(data.transactions_pace_status)}`}>
            {paceLabel(data.transactions_pace_status)}
          </span>
          <p className="text-lg font-heading font-bold text-brand-text">{transactionPct.toFixed(1)}%</p>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-[#e5edeb] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(transactionPct)}`} style={{ width: `${transactionPct}%` }} />
      </div>
      <p className="text-[11px] font-body text-brand-body">
        Need <span className="text-brand-green font-semibold">{Math.ceil(data.transactions_needed_per_day)}/day</span>
        {' · '}Projected <span className="text-brand-green font-semibold">{data.projected_transactions_eom.toLocaleString()}</span>
      </p>
    </div>
  );

  return (
    <div className="w-screen min-h-[100dvh] lg:h-screen bg-brand-bg overflow-x-hidden overflow-y-auto lg:overflow-y-hidden font-body">
      <div className="w-full min-h-[100dvh] lg:h-full max-w-[1600px] mx-auto flex flex-col">

        {/* ── Header ── gradient dark green bar */}
        <header className="bg-gradient-to-br from-[#021a15] via-brand-dark to-[#135748] shadow-[0_4px_24px_rgba(4,61,49,0.35)] px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo icon */}
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/10">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20V10.5M10 20V4M16 20V13M20 20V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-display font-bold text-white tracking-wide truncate">
                2Pay Terminal Dashboard
              </h1>
              <p className="mt-0.5 text-[11px] font-nav text-white/60 truncate">
                Payment terminal performance · {data.terminal_stats.length} active terminal{data.terminal_stats.length !== 1 ? 's' : ''} today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-nav font-medium text-emerald-300 uppercase tracking-wide">Live</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-nav text-white/50">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V12L15.5 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 px-4 py-4 sm:px-6 sm:py-4 lg:px-8 lg:py-5 flex flex-col gap-4">

          {/* Target Achievement — mobile only */}
          <section className={`sm:hidden bg-white rounded-2xl border border-brand-border ${cardShadow} overflow-hidden flex flex-col`}>
            <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-heading font-semibold text-brand-heading">Monthly Target Progress</h2>
                <p className="text-[11px] font-body text-brand-body">Day {data.days_elapsed} of {data.days_in_month} · {data.days_remaining} days left</p>
              </div>
              <span className="text-[10px] font-nav font-semibold px-2 py-1 rounded-full bg-brand-icon text-brand-green ring-1 ring-brand-green/20">MTD</span>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {/* Turnover circle */}
                <div className="relative shrink-0" style={{ width: circleSize, height: circleSize }}>
                  <svg width={circleSize} height={circleSize} className="block" viewBox={`0 0 ${circleSize} ${circleSize}`}>
                    <CircleGrad id="cgTurnMob" pctValue={pct} />
                    <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke={circleTrack} strokeWidth={strokeWidth} fill="transparent" />
                    <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke="url(#cgTurnMob)" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" strokeDasharray={`${dash} ${c-dash}`} transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}>{pct.toFixed(1)}%</p>
                    <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body mt-0.5">Turnover</p>
                  </div>
                </div>
                {/* Transactions circle */}
                <div className="relative shrink-0" style={{ width: circleSize, height: circleSize }}>
                  <svg width={circleSize} height={circleSize} className="block" viewBox={`0 0 ${circleSize} ${circleSize}`}>
                    <CircleGrad id="cgTxnMob" pctValue={transactionPct} />
                    <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke={circleTrack} strokeWidth={strokeWidth} fill="transparent" />
                    <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke="url(#cgTxnMob)" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" strokeDasharray={`${transactionDash} ${c-transactionDash}`} transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}>{transactionPct.toFixed(1)}%</p>
                    <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body mt-0.5">Transactions</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <TurnoverBarRow />
                <TransactionsBarRow />
              </div>
            </div>
          </section>

          {/* ── KPI Row — TODAY / THIS MONTH ── */}
          <section className="flex flex-col lg:flex-row gap-3 sm:gap-4">

            {/* TODAY */}
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.25em] text-brand-body px-1 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
                Today
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">

                {/* Today's Transactions */}
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-green ${cardShadow} p-4`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Transactions</p>
                      <p className="mt-0.5 text-xs font-body text-brand-body">Processed today</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-5 w-5 text-brand-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7H20M8 7L11 4M8 7L11 10M16 17H4M16 17L13 14M16 17L13 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-brand-text">
                    {data.total_transactions_today.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] font-body text-brand-body">
                    <span className="text-brand-green font-semibold">{data.transactions_mtd.toLocaleString()}</span> this month
                  </p>
                </div>

                {/* Today's Turnover */}
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-green ${cardShadow} p-4`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Turnover</p>
                      <p className="mt-0.5 text-xs font-body text-brand-body">Revenue today</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-5 w-5 text-brand-dark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-brand-text">
                    {formatCurrency(data.today_turnover)}
                  </p>
                  <p className="mt-1 text-[11px] font-body text-brand-body">
                    <span className="text-brand-green font-semibold">{formatCurrency(data.turnover_till_date)}</span> this month
                  </p>
                </div>

              </div>
            </div>

            {/* THIS MONTH */}
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.25em] text-brand-body px-1 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-dark" />
                This Month — Day {data.days_elapsed} of {data.days_in_month}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">

                {/* Revenue Target */}
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-dark ${cardShadow} p-4`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Revenue Target</p>
                      <p className="mt-0.5 text-xs font-body text-brand-body">{data.days_remaining} days remaining</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-5 w-5 text-brand-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" />
                        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-brand-text">
                    {formatCurrency(data.target_till_date)}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-nav font-bold px-1.5 py-0.5 rounded-full ${getPaceColor(data.turnover_pace_status)}`}>
                      {paceLabel(data.turnover_pace_status)}
                    </span>
                    <span className="text-[11px] font-body text-brand-body">
                      Proj <span className="text-brand-green font-semibold">{formatCurrency(data.projected_turnover_eom)}</span>
                    </span>
                  </div>
                </div>

                {/* Transaction Goal */}
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-dark ${cardShadow} p-4`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Txn Goal</p>
                      <p className="mt-0.5 text-xs font-body text-brand-body">{data.days_remaining} days remaining</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-5 w-5 text-brand-dark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 11L10 16L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-brand-text">
                    {transactionTarget.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-nav font-bold px-1.5 py-0.5 rounded-full ${getPaceColor(data.transactions_pace_status)}`}>
                      {paceLabel(data.transactions_pace_status)}
                    </span>
                    <span className="text-[11px] font-body text-brand-body">
                      Proj <span className="text-brand-green font-semibold">{data.projected_transactions_eom.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── Content: Terminal Table + Target Achievement ── */}
          <section className="min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1">

            {/* Terminal Table */}
            <div className={`lg:col-span-8 bg-white rounded-2xl border border-brand-border ${cardShadow} overflow-hidden flex flex-col min-h-0`}>
              <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-9 w-9 rounded-xl ${iconContainer} flex items-center justify-center`}>
                    <svg className="h-5 w-5 text-brand-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7H19M5 12H19M5 17H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-heading font-semibold text-brand-heading">Terminal Breakdown</h2>
                    <p className="text-[11px] font-body text-brand-body">Each payment terminal · today only</p>
                  </div>
                </div>
                <span className="text-[11px] font-nav text-brand-body">PKR</span>
              </div>

              {/* Mobile list */}
              <div className="md:hidden flex-1 min-h-0 overflow-auto p-3 space-y-2">
                {data.terminal_stats.length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm font-body text-brand-body">No transactions today</div>
                )}
                {data.terminal_stats.map((stat, idx) => (
                  <div key={`${stat.point}-${idx}`} className="bg-brand-bg rounded-xl p-3 border border-brand-border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-heading font-semibold text-brand-heading truncate">{stat.point}</p>
                        <p className="mt-1 text-xs font-body text-brand-body">{stat.transactions.toLocaleString()} transactions</p>
                      </div>
                      <p className="text-sm font-heading font-semibold text-brand-text shrink-0">{formatCurrency(stat.turnover)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <table className="min-w-full text-left">
                  <thead className="sticky top-0 bg-gradient-to-b from-[#f5faf9] to-brand-bg border-b border-brand-border">
                    <tr className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">
                      <th className="px-4 py-3 font-semibold">Terminal</th>
                      <th className="px-4 py-3 font-semibold text-right">Transactions</th>
                      <th className="px-4 py-3 font-semibold text-right">Turnover (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {data.terminal_stats.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-sm font-body text-brand-body">No transactions today</td>
                      </tr>
                    )}
                    {data.terminal_stats.map((stat, idx) => (
                      <tr key={`${stat.point}-${idx}`} className="transition-colors hover:bg-[#f5faf9]">
                        <td className="px-4 py-3 text-sm font-heading font-semibold text-brand-heading">{stat.point}</td>
                        <td className="px-4 py-3 text-sm font-body text-brand-body text-right">{stat.transactions.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-heading font-semibold text-brand-text text-right">{formatCurrency(stat.turnover)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Target Achievement — tablet */}
            <div className="hidden sm:block lg:hidden">
              <section className={`bg-white rounded-2xl border border-brand-border ${cardShadow} overflow-hidden flex flex-col`}>
                <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-heading font-semibold text-brand-heading">Monthly Target Progress</h2>
                    <p className="text-[11px] font-body text-brand-body">Day {data.days_elapsed} of {data.days_in_month} · {data.days_remaining} days left</p>
                  </div>
                  <span className="text-[10px] font-nav font-semibold px-2 py-1 rounded-full bg-brand-icon text-brand-green ring-1 ring-brand-green/20">MTD</span>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative" style={{ width: circleSize, height: circleSize }}>
                      <svg width={circleSize} height={circleSize} className="block">
                        <CircleGrad id="cgTurnTab" pctValue={pct} />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke={circleTrack} strokeWidth={strokeWidth} fill="transparent" />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke="url(#cgTurnTab)" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" strokeDasharray={`${dash} ${c-dash}`} transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}>{pct.toFixed(1)}%</p>
                        <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Turnover</p>
                      </div>
                    </div>
                    <div className="relative" style={{ width: circleSize, height: circleSize }}>
                      <svg width={circleSize} height={circleSize} className="block">
                        <CircleGrad id="cgTxnTab" pctValue={transactionPct} />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke={circleTrack} strokeWidth={strokeWidth} fill="transparent" />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke="url(#cgTxnTab)" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" strokeDasharray={`${transactionDash} ${c-transactionDash}`} transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}>{transactionPct.toFixed(1)}%</p>
                        <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Transactions</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <TurnoverBarRow />
                    <TransactionsBarRow />
                  </div>
                </div>
              </section>
            </div>

            {/* Target Achievement — desktop */}
            <div className="hidden lg:flex lg:flex-col lg:col-span-4 h-full">
              <section className={`bg-white rounded-2xl border border-brand-border ${cardShadow} overflow-hidden flex flex-col flex-1`}>
                <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-heading font-semibold text-brand-heading">Monthly Target Progress</h2>
                    <p className="text-[11px] font-body text-brand-body">Day {data.days_elapsed} of {data.days_in_month} · {data.days_remaining} days left</p>
                  </div>
                  <span className="text-[10px] font-nav font-semibold px-2 py-1 rounded-full bg-brand-icon text-brand-green ring-1 ring-brand-green/20">MTD</span>
                </div>
                <div className="px-3 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-center gap-4" style={{ marginBottom: '16px' }}>
                    <div className="relative scale-75 shrink-0" style={{ width: circleSize, height: circleSize }}>
                      <svg width={circleSize} height={circleSize} className="block">
                        <CircleGrad id="cgTurnDesk" pctValue={pct} />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke={circleTrack} strokeWidth={strokeWidth} fill="transparent" />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke="url(#cgTurnDesk)" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" strokeDasharray={`${dash} ${c-dash}`} transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}>{pct.toFixed(1)}%</p>
                        <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Turnover</p>
                      </div>
                    </div>
                    <div className="relative scale-75 shrink-0" style={{ width: circleSize, height: circleSize }}>
                      <svg width={circleSize} height={circleSize} className="block">
                        <CircleGrad id="cgTxnDesk" pctValue={transactionPct} />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke={circleTrack} strokeWidth={strokeWidth} fill="transparent" />
                        <circle cx={circleSize/2} cy={circleSize/2} r={r} stroke="url(#cgTxnDesk)" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" strokeDasharray={`${transactionDash} ${c-transactionDash}`} transform={`rotate(-90 ${circleSize/2} ${circleSize/2})`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(22, Math.floor(circleSize * 0.28)) }}>{transactionPct.toFixed(1)}%</p>
                        <p className="text-[11px] font-nav uppercase tracking-[0.22em] text-brand-body">Transactions</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <TurnoverBarRow />
                    <TransactionsBarRow />
                  </div>
                </div>
              </section>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardTailwind;
