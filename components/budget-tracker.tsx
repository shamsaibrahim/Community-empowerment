'use client';

import { useState, useEffect } from 'react';
import { PieChart, Plus, X, Loader2, Trash2, Edit2, Check, Wallet } from 'lucide-react';

interface Budget {
  id: string;
  category: string;
  budget_amount: number;
  spent_amount: number;
  month: string;
  year: number;
}

const BUDGET_CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Savings',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'from-orange-500 to-amber-500',
  Transport: 'from-blue-500 to-cyan-500',
  Bills: 'from-red-500 to-rose-500',
  Entertainment: 'from-purple-500 to-violet-500',
  Shopping: 'from-pink-500 to-fuchsia-500',
  Health: 'from-green-500 to-emerald-500',
  Education: 'from-indigo-500 to-blue-500',
  Savings: 'from-teal-500 to-cyan-500',
  Other: 'from-gray-500 to-slate-500',
};

export function BudgetTracker() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    category: 'Food',
    budgetAmount: '',
  });

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`);
      const data = await res.json();
      if (data.success) {
        setBudgets(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.budgetAmount) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category,
          budgetAmount: Number.parseFloat(formData.budgetAmount),
          month: currentMonth,
          year: currentYear,
        }),
      });

      if (res.ok) {
        setFormData({ category: 'Food', budgetAmount: '' });
        setShowForm(false);
        fetchBudgets();
      }
    } catch (err) {
      console.error('Failed to create budget:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/budgets?id=${id}`, { method: 'DELETE' });
      fetchBudgets();
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const handleUpdateSpent = async (id: string) => {
    if (!editAmount) return;
    
    try {
      await fetch('/api/budgets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          spentAmount: Number.parseFloat(editAmount),
        }),
      });
      setEditingId(null);
      setEditAmount('');
      fetchBudgets();
    } catch (err) {
      console.error('Failed to update budget:', err);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.budget_amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent_amount), 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="group relative w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all duration-300 group-hover:border-border group-hover:shadow-2xl group-hover:shadow-accent/10" />

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-5 h-5 text-accent" />
              Budget Tracker
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {currentMonth} {currentYear}
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
            {showForm ? 'Cancel' : 'Add Budget'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-background/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="text-lg font-bold text-foreground">KES {totalBudget.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-lg font-bold text-destructive">KES {totalSpent.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border/50">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              KES {remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-xl bg-background/50 border border-border/50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60"
                >
                  {BUDGET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Budget Amount (KES)</label>
                <input
                  type="number"
                  value={formData.budgetAmount}
                  onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                  placeholder="e.g. 10000"
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Adding...' : 'Add Budget'}
            </button>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        )}

        {/* Budget List */}
        {!loading && budgets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No budgets set for this month</p>
            <p className="text-xs">Click "Add Budget" to get started</p>
          </div>
        )}

        {!loading && budgets.length > 0 && (
          <div className="space-y-3">
            {budgets.map((budget) => {
              const percentage = budget.budget_amount > 0 
                ? Math.min((Number(budget.spent_amount) / Number(budget.budget_amount)) * 100, 100)
                : 0;
              const isOverBudget = Number(budget.spent_amount) > Number(budget.budget_amount);
              const colorClass = CATEGORY_COLORS[budget.category] || CATEGORY_COLORS.Other;

              return (
                <div
                  key={budget.id}
                  className="p-4 rounded-xl bg-background/30 border border-border/40 hover:border-accent/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClass}`} />
                      <span className="font-medium text-foreground">{budget.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {editingId === budget.id ? (
                        <>
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            placeholder="Spent"
                            className="w-24 px-2 py-1 text-xs rounded bg-background border border-border text-foreground"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateSpent(budget.id)}
                            className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditAmount(''); }}
                            className="p-1 text-muted-foreground hover:bg-muted/20 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(budget.id); setEditAmount(String(budget.spent_amount)); }}
                            className="p-1 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded transition-colors"
                            title="Update spent amount"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(budget.id)}
                            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Delete budget"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${isOverBudget ? 'from-red-500 to-rose-500' : colorClass} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className={isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                      KES {Number(budget.spent_amount).toLocaleString()} spent
                    </span>
                    <span className="text-muted-foreground">
                      of KES {Number(budget.budget_amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
