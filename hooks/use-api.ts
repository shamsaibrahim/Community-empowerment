'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiResponse, Opportunity, CommunityPost, Transaction, FinancialGoal } from '@/lib/types';

// Generic fetch hook
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      const result: ApiResponse<T> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Build URL with query params
function buildUrl(base: string, params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

// Opportunities hook
export function useOpportunities(filters?: { type?: string; level?: string }) {
  const url = useMemo(
    () => buildUrl('/api/opportunities', { type: filters?.type, level: filters?.level }),
    [filters?.type, filters?.level]
  );
  return useApi<Opportunity[]>(url);
}

// Community posts hook
export function useCommunityPosts(category?: string) {
  const url = useMemo(() => buildUrl('/api/community', { category }), [category]);
  return useApi<CommunityPost[]>(url);
}

// Financial summary hook
interface FinancialSummary {
  currentGoal: FinancialGoal;
  recentTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  progressPercent: number;
}

export function useFinancialSummary() {
  return useApi<FinancialSummary>('/api/financial');
}

// Transactions hook
export function useTransactions() {
  return useApi<Transaction[]>('/api/financial?type=transactions');
}

// Mutation hooks for creating/updating data
export function useCreateOpportunity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOpportunity = async (data: Partial<Opportunity>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<Opportunity> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create opportunity');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOpportunity, loading, error };
}

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: Partial<CommunityPost>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<CommunityPost> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
}

export function useAddTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = async (data: Partial<Transaction>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<Transaction> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addTransaction, loading, error };
}

export function useUpdateGoal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGoal = async (goalId: string, updates: Partial<FinancialGoal>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/financial', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, ...updates }),
      });
      const result: ApiResponse<FinancialGoal> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateGoal, loading, error };
}
