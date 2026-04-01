import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let query = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true });

    if (month) query = query.eq('month', month);
    if (year) query = query.eq('year', Number.parseInt(year));

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Budgets GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', category, budgetAmount, month, year } = body;

    if (!category || !budgetAmount || !month || !year) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('budgets')
      .upsert({
        user_id: userId,
        category,
        budget_amount: budgetAmount,
        spent_amount: 0,
        month,
        year,
      }, { onConflict: 'user_id,category,month,year' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Budgets POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create budget' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, budgetAmount, spentAmount } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Budget ID required' }, { status: 400 });
    }

    const updateData: Record<string, number> = {};
    if (budgetAmount !== undefined) updateData.budget_amount = budgetAmount;
    if (spentAmount !== undefined) updateData.spent_amount = spentAmount;

    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Budgets PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Budget ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    console.error('Budgets DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete budget' }, { status: 500 });
  }
}
