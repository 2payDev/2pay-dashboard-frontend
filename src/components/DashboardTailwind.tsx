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

  // Mobile/tablet circles — normal size
  const circleSizeMob = 100;
  const strokeWidthMob = 9;
  const rMob = (circleSizeMob - strokeWidthMob) / 2;
  const cMob = 2 * Math.PI * rMob;
  const dashMob = (pct / 100) * cMob;
  const transactionDashMob = (transactionPct / 100) * cMob;

  // Desktop circles — very small, used inline with progress bar
  const circleSizeDesk = 68;
  const strokeWidthDesk = 7;
  const rDesk = (circleSizeDesk - strokeWidthDesk) / 2;
  const cDesk = 2 * Math.PI * rDesk;
  const dashDesk = (pct / 100) * cDesk;
  const transactionDashDesk = (transactionPct / 100) * cDesk;

  const circleTrack = 'rgba(20,98,82,0.12)';

  const CircleGrad = ({ id, pctValue }: { id: string; pctValue: number }) => (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={pctValue >= 50 ? '#043D31' : pctValue >= 30 ? '#f59e0b' : '#f43f5e'} />
        <stop offset="100%" stopColor={pctValue >= 50 ? '#146252' : pctValue >= 30 ? '#fbbf24' : '#fb7185'} />
      </linearGradient>
    </defs>
  );

  const cardShadow = 'shadow-[0_2px_16px_-3px_rgba(20,98,82,0.10),0_1px_4px_rgba(0,0,0,0.04)]';
  const iconContainer = 'bg-gradient-to-br from-brand-icon to-[#d6ebe5]';

  // Circle for mobile/tablet — side by side layout
  const CircleChartMob = ({ id, value, dash: d, label }: { id: string; value: number; dash: number; label: string }) => (
    <div className="relative shrink-0" style={{ width: circleSizeMob, height: circleSizeMob }}>
      <svg width={circleSizeMob} height={circleSizeMob} className="block" viewBox={`0 0 ${circleSizeMob} ${circleSizeMob}`}>
        <CircleGrad id={id} pctValue={value} />
        <circle cx={circleSizeMob/2} cy={circleSizeMob/2} r={rMob} stroke={circleTrack} strokeWidth={strokeWidthMob} fill="transparent" />
        <circle cx={circleSizeMob/2} cy={circleSizeMob/2} r={rMob} stroke={`url(#${id})`} strokeWidth={strokeWidthMob} strokeLinecap="round" fill="transparent"
          strokeDasharray={`${d} ${cMob - d}`} transform={`rotate(-90 ${circleSizeMob/2} ${circleSizeMob/2})`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(14, Math.floor(circleSizeMob * 0.20)) }}>
          {value.toFixed(1)}%
        </p>
        <p className="text-[8px] font-nav uppercase tracking-[0.15em] text-brand-body mt-0.5">{label}</p>
      </div>
    </div>
  );

  // Circle for desktop — small circle with label+badge beside it
  const CircleChartDesk = ({ id, value, dash: d, label, paceStatus }: {
    id: string; value: number; dash: number; label: string; paceStatus: string
  }) => (
    <div className="flex items-center gap-2 shrink-0">
      <div className="relative" style={{ width: circleSizeDesk, height: circleSizeDesk }}>
        <svg width={circleSizeDesk} height={circleSizeDesk} className="block" viewBox={`0 0 ${circleSizeDesk} ${circleSizeDesk}`}>
          <CircleGrad id={id} pctValue={value} />
          <circle cx={circleSizeDesk/2} cy={circleSizeDesk/2} r={rDesk} stroke={circleTrack} strokeWidth={strokeWidthDesk} fill="transparent" />
          <circle cx={circleSizeDesk/2} cy={circleSizeDesk/2} r={rDesk} stroke={`url(#${id})`} strokeWidth={strokeWidthDesk} strokeLinecap="round" fill="transparent"
            strokeDasharray={`${d} ${cDesk - d}`} transform={`rotate(-90 ${circleSizeDesk/2} ${circleSizeDesk/2})`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="font-heading font-extrabold text-brand-text leading-none tabular-nums" style={{ fontSize: Math.max(11, Math.floor(circleSizeDesk * 0.20)) }}>
            {value.toFixed(1)}%
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[9px] font-nav uppercase tracking-[0.10em] text-brand-body">{label}</p>
        <span className={`text-[9px] font-nav font-bold px-1.5 py-0.5 rounded-full w-fit ${getPaceColor(paceStatus)}`}>
          {paceLabel(paceStatus)}
        </span>
      </div>
    </div>
  );

  const TurnoverBarRow = () => (
    <div className={`bg-white rounded-xl border border-brand-border ${cardShadow} p-2 flex flex-col gap-1`}>
      <div className="flex items-center justify-between gap-1">
        <p className="text-[9px] uppercase tracking-[0.10em] font-nav text-brand-body truncate flex-1">Monthly Turnover</p>
        <p className="text-[11px] font-heading font-bold text-brand-text tabular-nums shrink-0">{pct.toFixed(1)}%</p>
      </div>
      <p className="text-[9px] font-body text-brand-body truncate">
        {formatCurrency(data.turnover_till_date)} / {formatCurrency(data.target_till_date)}
      </p>
      <div className="h-1.5 rounded-full bg-[#e5edeb] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap gap-x-1.5 text-[9px] font-body text-brand-body">
        <span>Need <span className="text-brand-green font-semibold">{formatCurrency(data.turnover_needed_per_day)}/day</span></span>
        <span>Proj <span className="text-brand-green font-semibold">{formatCurrency(data.projected_turnover_eom)}</span></span>
      </div>
    </div>
  );

  const TransactionsBarRow = () => (
    <div className={`bg-white rounded-xl border border-brand-border ${cardShadow} p-2 flex flex-col gap-1`}>
      <div className="flex items-center justify-between gap-1">
        <p className="text-[9px] uppercase tracking-[0.10em] font-nav text-brand-body truncate flex-1">Monthly Transactions</p>
        <p className="text-[11px] font-heading font-bold text-brand-text tabular-nums shrink-0">{transactionPct.toFixed(1)}%</p>
      </div>
      <p className="text-[9px] font-body text-brand-body truncate">
        {data.transactions_mtd.toLocaleString()} / {transactionTarget.toLocaleString()}
      </p>
      <div className="h-1.5 rounded-full bg-[#e5edeb] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(transactionPct)}`} style={{ width: `${transactionPct}%` }} />
      </div>
      <div className="flex flex-wrap gap-x-1.5 text-[9px] font-body text-brand-body">
        <span>Need <span className="text-brand-green font-semibold">{Math.ceil(data.transactions_needed_per_day)}/day</span></span>
        <span>Proj <span className="text-brand-green font-semibold">{data.projected_transactions_eom.toLocaleString()}</span></span>
      </div>
    </div>
  );

  return (
    <div className="w-screen min-h-[100dvh] lg:h-screen bg-brand-bg overflow-x-hidden overflow-y-auto lg:overflow-y-hidden font-body">
      <div className="w-full min-h-[100dvh] lg:h-full max-w-[1600px] mx-auto flex flex-col">

        {/* ── Header ── */}
        <header className="bg-gradient-to-br from-[#021a15] via-brand-dark to-[#135748] shadow-[0_4px_24px_rgba(4,61,49,0.35)] px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/10 shrink-0">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M4 20V10.5M10 20V4M16 20V13M20 20V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-display font-bold text-white tracking-wide truncate">
                2Pay Terminal Dashboard
              </h1>
              <p className="mt-0.5 text-[11px] font-nav text-white/60 truncate">
                {data.terminal_stats.length} terminal{data.terminal_stats.length !== 1 ? 's' : ''} active today
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-nav font-medium text-emerald-300 uppercase tracking-wide">Live</span>
            </div>
            <span className="relative flex h-2 w-2 sm:hidden">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-nav text-white/50">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
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
            <div className="p-3 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <CircleChartMob id="cgTurnMob" value={pct} dash={dashMob} label="Turnover" />
                <CircleChartMob id="cgTxnMob" value={transactionPct} dash={transactionDashMob} label="Transactions" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <TurnoverBarRow />
                <TransactionsBarRow />
              </div>
            </div>
          </section>

          {/* ── KPI Row ── */}
          <section className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* TODAY */}
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.25em] text-brand-body px-1 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
                Today
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-green ${cardShadow} p-3 sm:p-4`}>
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-[11px] font-nav uppercase tracking-tight sm:tracking-[0.22em] text-brand-body truncate">Transactions</p>
                      <p className="mt-0.5 text-[10px] sm:text-xs font-body text-brand-body truncate">Processed today</p>
                    </div>
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-brand-green" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7H20M8 7L11 4M8 7L11 10M16 17H4M16 17L13 14M16 17L13 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-brand-text tabular-nums">
                    {data.total_transactions_today.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[10px] sm:text-[11px] font-body text-brand-body truncate">
                    <span className="text-brand-green font-semibold">{data.transactions_mtd.toLocaleString()}</span> this month
                  </p>
                </div>
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-green ${cardShadow} p-3 sm:p-4`}>
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-[11px] font-nav uppercase tracking-tight sm:tracking-[0.22em] text-brand-body truncate">Turnover</p>
                      <p className="mt-0.5 text-[10px] sm:text-xs font-body text-brand-body truncate">Turnover today</p>
                    </div>
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-brand-dark" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4V20M8 8H12C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 sm:mt-3 text-lg sm:text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-brand-text tabular-nums truncate">
                    {formatCurrency(data.today_turnover)}
                  </p>
                  <p className="mt-1 text-[10px] sm:text-[11px] font-body text-brand-body truncate">
                    <span className="text-brand-green font-semibold">{formatCurrency(data.turnover_till_date)}</span> this month
                  </p>
                </div>
              </div>
            </div>

            {/* THIS MONTH */}
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.25em] text-brand-body px-1 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-dark" />
                This Month<span className="hidden sm:inline"> — Day {data.days_elapsed} of {data.days_in_month}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-dark ${cardShadow} p-3 sm:p-4`}>
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-[11px] font-nav uppercase tracking-tight sm:tracking-[0.22em] text-brand-body truncate">Turnover Target</p>
                      <p className="mt-0.5 text-[10px] sm:text-xs font-body text-brand-body truncate">{data.days_remaining} days left</p>
                    </div>
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-brand-green" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" />
                        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 sm:mt-3 text-lg sm:text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-brand-text tabular-nums truncate">
                    {formatCurrency(data.target_till_date)}
                  </p>
                  <div className="mt-1 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-nav font-bold px-1.5 py-0.5 rounded-full ${getPaceColor(data.turnover_pace_status)}`}>
                      {paceLabel(data.turnover_pace_status)}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-body text-brand-body truncate">
                      Proj <span className="text-brand-green font-semibold">{formatCurrency(data.projected_turnover_eom)}</span>
                    </span>
                  </div>
                </div>
                <div className={`bg-white rounded-2xl border border-brand-border border-t-2 border-t-brand-dark ${cardShadow} p-3 sm:p-4`}>
                  <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-[11px] font-nav uppercase tracking-tight sm:tracking-[0.22em] text-brand-body truncate">Txn Goal</p>
                      <p className="mt-0.5 text-[10px] sm:text-xs font-body text-brand-body truncate">{data.days_remaining} days left</p>
                    </div>
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-brand-dark" viewBox="0 0 24 24" fill="none">
                        <path d="M5 11L10 16L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-brand-text tabular-nums">
                    {transactionTarget.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-nav font-bold px-1.5 py-0.5 rounded-full ${getPaceColor(data.transactions_pace_status)}`}>
                      {paceLabel(data.transactions_pace_status)}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-body text-brand-body truncate">
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
                  <div className={`h-9 w-9 rounded-xl ${iconContainer} flex items-center justify-center shrink-0`}>
                    <svg className="h-5 w-5 text-brand-green" viewBox="0 0 24 24" fill="none">
                      <path d="M5 7H19M5 12H19M5 17H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-heading font-semibold text-brand-heading">Terminal Breakdown</h2>
                    <p className="text-[11px] font-body text-brand-body truncate">Each payment terminal · today only</p>
                  </div>
                </div>
                <span className="text-[11px] font-nav text-brand-body shrink-0 ml-2">PKR</span>
              </div>
              {/* Mobile list */}
              <div className="md:hidden flex-1 min-h-0 overflow-auto p-3 space-y-2">
                {data.terminal_stats.length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm font-body text-brand-body">No transactions today</div>
                )}
                {data.terminal_stats.map((stat, idx) => (
                  <div key={`${stat.point}-${idx}`} className="bg-brand-bg rounded-xl p-3 border border-brand-border">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-heading font-semibold text-brand-heading truncate">{stat.point}</p>
                        <p className="mt-0.5 text-xs font-body text-brand-body">{stat.transactions.toLocaleString()} txns</p>
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
                      <tr><td colSpan={3} className="px-4 py-10 text-center text-sm font-body text-brand-body">No transactions today</td></tr>
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
                <div className="p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-4">
                    <CircleChartMob id="cgTurnTab" value={pct} dash={dashMob} label="Turnover" />
                    <CircleChartMob id="cgTxnTab" value={transactionPct} dash={transactionDashMob} label="Transactions" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <TurnoverBarRow />
                    <TransactionsBarRow />
                  </div>
                </div>
              </section>
            </div>

            {/* ── Target Achievement — desktop LCD OPTIMIZED ── */}
            <div className="hidden lg:flex lg:flex-col lg:col-span-4 h-full">
              <section className={`bg-white rounded-2xl border border-brand-border ${cardShadow} overflow-hidden flex flex-col flex-1`}>
                <div className="px-3 py-2.5 border-b border-brand-border flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-sm font-heading font-semibold text-brand-heading">Monthly Target Progress</h2>
                    <p className="text-[10px] font-body text-brand-body">Day {data.days_elapsed} of {data.days_in_month} · {data.days_remaining} days left</p>
                  </div>
                  <span className="text-[10px] font-nav font-semibold px-2 py-1 rounded-full bg-brand-icon text-brand-green ring-1 ring-brand-green/20">MTD</span>
                </div>

                <div className="px-3 py-3 flex flex-col gap-3 flex-1 overflow-hidden">

                  {/* TURNOVER ROW: small circle left + progress info right */}
                  <div className="flex items-center gap-3">
                    <CircleChartDesk
                      id="cgTurnDesk"
                      value={pct}
                      dash={dashDesk}
                      label="Turnover"
                      paceStatus={data.turnover_pace_status}
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-[10px] font-body text-brand-body truncate">
                        {formatCurrency(data.turnover_till_date)}
                        <span className="text-brand-body/60"> / {formatCurrency(data.target_till_date)}</span>
                      </p>
                      <div className="h-2 rounded-full bg-[#e5edeb] overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(pct)}`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[9px] font-body text-brand-body truncate">
                        Need <span className="text-brand-green font-semibold">{formatCurrency(data.turnover_needed_per_day)}/day</span>
                        {' '}· Proj <span className="text-brand-green font-semibold">{formatCurrency(data.projected_turnover_eom)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-brand-border shrink-0" />

                  {/* TRANSACTIONS ROW: small circle left + progress info right */}
                  <div className="flex items-center gap-3">
                    <CircleChartDesk
                      id="cgTxnDesk"
                      value={transactionPct}
                      dash={transactionDashDesk}
                      label="Transactions"
                      paceStatus={data.transactions_pace_status}
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-[10px] font-body text-brand-body truncate">
                        {data.transactions_mtd.toLocaleString()}
                        <span className="text-brand-body/60"> / {transactionTarget.toLocaleString()}</span>
                      </p>
                      <div className="h-2 rounded-full bg-[#e5edeb] overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(transactionPct)}`} style={{ width: `${transactionPct}%` }} />
                      </div>
                      <p className="text-[9px] font-body text-brand-body truncate">
                        Need <span className="text-brand-green font-semibold">{Math.ceil(data.transactions_needed_per_day)}/day</span>
                        {' '}· Proj <span className="text-brand-green font-semibold">{data.projected_transactions_eom.toLocaleString()}</span>
                      </p>
                    </div>
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