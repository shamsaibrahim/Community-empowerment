'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Loader2, Plus, X, Edit3, Target } from 'lucide-react';
import { useFinancialSummary, useAddTransaction, useUpdateGoal } from '@/hooks/use-api';

const TRANSACTION_CATEGORIES = ['Work', 'Business', 'Bills', 'Food', 'Transport', 'Entertainment', 'Other'];

export function FinancialSnapshot() {
  const { data, loading, error, refetch } = useFinancialSummary();
  const { addTransaction, loading: submitting } = useAddTransaction();
  const { updateGoal, loading: updatingGoal } = useUpdateGoal();
  
  const [showForm, setShowForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    label: '',
    amount: '',
    category: 'Work',
  });
  const [goalData, setGoalData] = useState({
    monthlyGoal: '',
    currentSavings: '',
  });
  
  const monthlyGoal = data?.currentGoal?.monthlyGoal || 50000;
  const currentSavings = data?.currentGoal?.currentSavings || 0;
  const progressPercent = data?.progressPercent || 0;
  const recentTransactions = data?.recentTransactions || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.amount) return;
    
    await addTransaction({
      type: formData.type,
      label: formData.label,
      amount: parseFloat(formData.amount),
      category: formData.category,
    });
    
    setFormData({ type: 'income', label: '', amount: '', category: 'Work' });
    setShowForm(false);
    refetch();
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalData.monthlyGoal) return;
    
    const goalId = data?.currentGoal?.id;
    if (goalId) {
      await updateGoal(goalId, {
        monthlyGoal: Number.parseFloat(goalData.monthlyGoal),
        currentSavings: goalData.currentSavings ? Number.parseFloat(goalData.currentSavings) : undefined,
      });
    }
    
    setGoalData({ monthlyGoal: '', currentSavings: '' });
    setShowGoalForm(false);
    refetch();
  };

  const openGoalForm = () => {
    setGoalData({
      monthlyGoal: monthlyGoal.toString(),
      currentSavings: currentSavings.toString(),
    });
    setShowGoalForm(true);
    setShowForm(false);
  };

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
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-3 py-1 rounded-full border transition-all duration-300 text-xs font-semibold flex items-center gap-1 ${
              showForm 
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 hover:border-accent/60 text-accent'
            }`}
          >
            {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {showForm ? 'Cancel' : 'Add'}
          </button>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-xl bg-background/50 border border-border/50 space-y-3">
            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                    : 'bg-background/50 text-muted-foreground border border-border/50 hover:border-green-500/30'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                    : 'bg-background/50 text-muted-foreground border border-border/50 hover:border-red-500/30'
                }`}
              >
                <TrendingDown className="w-4 h-4 inline mr-1" />
                Expense
              </button>
            </div>

            {/* Label Input */}
            <input
              type="text"
              placeholder="Description (e.g., Freelance Project)"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60"
              required
            />

            {/* Amount & Category Row */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">KES</span>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-12 pr-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60"
                  required
                  min="1"
                />
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60 cursor-pointer"
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !formData.label || !formData.amount}
              className="w-full py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Adding...' : 'Add Transaction'}
            </button>
          </form>
        )}

        {/* Goal Edit Form */}
        {showGoalForm && (
          <form onSubmit={handleGoalSubmit} className="mb-6 p-4 rounded-xl bg-background/50 border border-border/50 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Edit Savings Goal</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Monthly Goal (KES)</label>
                <input
                  type="number"
                  value={goalData.monthlyGoal}
                  onChange={(e) => setGoalData({ ...goalData, monthlyGoal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60"
                  required
                  min="1000"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Current Savings (KES)</label>
                <input
                  type="number"
                  value={goalData.currentSavings}
                  onChange={(e) => setGoalData({ ...goalData, currentSavings: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowGoalForm(false)}
                className="flex-1 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-muted-foreground hover:bg-background/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingGoal || !goalData.monthlyGoal}
                className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updatingGoal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                {updatingGoal ? 'Saving...' : 'Update Goal'}
              </button>
            </div>
          </form>
        )}

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
              {loading ? (
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              ) : (
                <>
                  <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {progressPercent.toFixed(0)}%
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">
                    of KES {monthlyGoal.toLocaleString()} goal
                  </div>
                </>
              )}
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
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                KES {monthlyGoal.toLocaleString()}
              </span>
              <button
                onClick={openGoalForm}
                className="p-1 rounded hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
                title="Edit Goal"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
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
          {recentTransactions.slice(0, 2).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30 hover:border-border hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${transaction.type === 'income' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} opacity-20`}>
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
                {transaction.type === 'income' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
