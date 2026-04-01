import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { transactions as mockTransactions, financialGoals as mockGoals, addTransaction, updateFinancialGoal } from '@/lib/data';
import { Transaction, FinancialGoal } from '@/lib/types';

const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// GET financial data (transactions and goals)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (useSupabase) {
      if (type === 'transactions') {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        const transactions: Transaction[] = (data || []).map((row) => ({
          id: row.id,
          type: row.type,
          label: row.label,
          amount: Number(row.amount),
          category: row.category,
          date: row.date,
        }));

        return NextResponse.json({ success: true, data: transactions });
      }

      if (type === 'goals') {
        const { data, error } = await supabase
          .from('financial_goals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const goals: FinancialGoal[] = (data || []).map((row) => ({
          id: row.id,
          userId: row.user_id,
          monthlyGoal: Number(row.monthly_goal),
          currentSavings: Number(row.current_savings),
          month: row.month,
          year: row.year,
        }));

        return NextResponse.json({ success: true, data: goals });
      }

      // Default: return summary
      const [transResult, goalResult] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('financial_goals').select('*').limit(1).single(),
      ]);

      if (transResult.error) throw transResult.error;

      const transactions: Transaction[] = (transResult.data || []).map((row) => ({
        id: row.id,
        type: row.type,
        label: row.label,
        amount: Number(row.amount),
        category: row.category,
        date: row.date,
      }));

      const currentGoal: FinancialGoal | null = goalResult.data
        ? {
            id: goalResult.data.id,
            userId: goalResult.data.user_id,
            monthlyGoal: Number(goalResult.data.monthly_goal),
            currentSavings: Number(goalResult.data.current_savings),
            month: goalResult.data.month,
            year: goalResult.data.year,
          }
        : null;

      const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      const summary = {
        currentGoal,
        recentTransactions: transactions.slice(0, 5),
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
        progressPercent: currentGoal ? (currentGoal.currentSavings / currentGoal.monthlyGoal) * 100 : 0,
      };

      return NextResponse.json({ success: true, data: summary });
    }

    // Fallback to mock data
    if (type === 'transactions') {
      return NextResponse.json({
        success: true,
        data: mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      });
    }

    if (type === 'goals') {
      return NextResponse.json({ success: true, data: mockGoals });
    }

    const currentGoal = mockGoals[0];
    const recentTransactions = mockTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const totalIncome = mockTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = mockTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        currentGoal,
        recentTransactions,
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
        progressPercent: currentGoal ? (currentGoal.currentSavings / currentGoal.monthlyGoal) * 100 : 0,
      },
    });
  } catch (error) {
    console.error('Financial GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch financial data' }, { status: 500 });
  }
}

// POST new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (useSupabase) {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: body.userId || 'demo-user',
          type: body.type,
          label: body.label,
          amount: body.amount,
          category: body.category,
          date: body.date || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data, message: 'Transaction added successfully' }, { status: 201 });
    }

    const newTransaction = addTransaction({
      ...body,
      date: body.date || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ success: true, data: newTransaction, message: 'Transaction added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Financial POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add transaction' }, { status: 500 });
  }
}

// PATCH update financial goal
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, ...updates } = body;

    if (useSupabase) {
      const updateData: Record<string, unknown> = {};
      if (updates.monthlyGoal !== undefined) updateData.monthly_goal = updates.monthlyGoal;
      if (updates.currentSavings !== undefined) updateData.current_savings = updates.currentSavings;
      if (updates.month !== undefined) updateData.month = updates.month;
      if (updates.year !== undefined) updateData.year = updates.year;

      const { data, error } = await supabase
        .from('financial_goals')
        .update(updateData)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data, message: 'Goal updated successfully' });
    }

    const updatedGoal = updateFinancialGoal(goalId || '1', updates);

    if (!updatedGoal) {
      return NextResponse.json({ success: false, error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedGoal, message: 'Goal updated successfully' });
  } catch (error) {
    console.error('Financial PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 });
  }
}
