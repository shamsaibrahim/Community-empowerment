'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Loader2, BarChart3 } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  label: string;
  amount: number;
  category: string;
  date: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function FinancialAnalytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'bar' | 'pie' | 'line'>('bar');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/financial?type=transactions');
        const data = await res.json();
        if (data.success) {
          setTransactions(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;

  // Prepare data for bar chart (income vs expense by category)
  const categoryData = transactions.reduce((acc, t) => {
    const existing = acc.find(item => item.category === t.category);
    if (existing) {
      if (t.type === 'income') {
        existing.income += Number(t.amount);
      } else {
        existing.expense += Number(t.amount);
      }
    } else {
      acc.push({
        category: t.category,
        income: t.type === 'income' ? Number(t.amount) : 0,
        expense: t.type === 'expense' ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, [] as { category: string; income: number; expense: number }[]);

  // Prepare data for pie chart (expenses by category)
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({ name: t.category, value: Number(t.amount) });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Prepare data for line chart (daily totals)
  const dailyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      if (t.type === 'income') {
        existing.income += Number(t.amount);
      } else {
        existing.expense += Number(t.amount);
      }
    } else {
      acc.push({
        date,
        income: t.type === 'income' ? Number(t.amount) : 0,
        expense: t.type === 'expense' ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, [] as { date: string; income: number; expense: number }[]);

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
              <BarChart3 className="w-5 h-5 text-accent" />
              Financial Analytics
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Track your income and expenses
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-muted/30 border border-border/50">
            {(['bar', 'pie', 'line'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeChart === type
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <p className="text-lg font-bold text-green-500">KES {totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
            <p className="text-lg font-bold text-red-500">KES {totalExpenses.toLocaleString()}</p>
          </div>
          <div className={`p-3 rounded-xl border ${netSavings >= 0 ? 'bg-accent/10 border-accent/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
            <div className="flex items-center gap-1 mb-1">
              {netSavings >= 0 ? <TrendingUp className="w-4 h-4 text-accent" /> : <TrendingDown className="w-4 h-4 text-orange-500" />}
              <span className="text-xs text-muted-foreground">Net</span>
            </div>
            <p className={`text-lg font-bold ${netSavings >= 0 ? 'text-accent' : 'text-orange-500'}`}>
              KES {netSavings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {/* Charts */}
        {!loading && transactions.length > 0 && (
          <div className="h-64">
            {activeChart === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`KES ${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'pie' && expensesByCategory.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`KES ${value.toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`KES ${value.toLocaleString()}`, '']}
                  />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && transactions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No transaction data available</p>
            <p className="text-xs">Add transactions to see analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}
