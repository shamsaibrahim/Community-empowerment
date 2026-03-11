'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function FinancialSnapshot() {
  const monthlyGoal = 50000;
  const currentSavings = 34000;
  const progressPercent = (currentSavings / monthlyGoal) * 100;

  const recentTransactions = [
    { type: 'income', label: 'Freelance Project', amount: '+KES 25,000', color: 'from-green-500 to-emerald-500' },
    { type: 'expense', label: 'Utilities', amount: '-KES 8,500', color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="group relative h-full min-h-[380px]">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all duration-300 group-hover:border-border group-hover:shadow-2xl group-hover:shadow-accent/10" />

      {/* Content */}
      <div className="relative p-6 md:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              Financial Snapshot
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Monthly savings progress
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30">
            <span className="text-xs font-semibold text-accent">Active</span>
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="flex flex-col items-center justify-center mb-8 flex-1">
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray={`${(progressPercent / 100) * 502.65} 502.65`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="oklch(0.62 0.28 150)" />
                  <stop offset="100%" stopColor="oklch(0.52 0.25 265)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {progressPercent.toFixed(0)}%
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-2">
                of KES 50,000 goal
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-3 border-t border-border/40 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-muted-foreground">
              Current Savings
            </span>
            <span className="font-semibold text-foreground">
              KES {currentSavings.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-muted-foreground">
              Monthly Goal
            </span>
            <span className="font-semibold text-foreground">
              KES {monthlyGoal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-muted-foreground">
              Remaining
            </span>
            <span className="font-semibold text-accent">
              KES {(monthlyGoal - currentSavings).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="mt-6 space-y-2">
          {recentTransactions.map((transaction, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30 hover:border-border hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${transaction.color} opacity-20`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <span className="text-xs md:text-sm text-foreground font-medium">
                  {transaction.label}
                </span>
              </div>
              <span
                className={`text-xs md:text-sm font-semibold ${
                  transaction.type === 'income'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
