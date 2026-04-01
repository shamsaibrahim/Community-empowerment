import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET saved opportunities for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .select(`
        id,
        opportunity_id,
        created_at,
        opportunities (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Saved opportunities GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch saved opportunities' }, { status: 500 });
  }
}

// POST save an opportunity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, opportunityId } = body;

    if (!userId || !opportunityId) {
      return NextResponse.json({ success: false, error: 'User ID and Opportunity ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('saved_opportunities')
      .insert({
        user_id: userId,
        opportunity_id: opportunityId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, error: 'Already saved' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data, message: 'Opportunity saved' }, { status: 201 });
  } catch (error) {
    console.error('Saved opportunities POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save opportunity' }, { status: 500 });
  }
}

// DELETE unsave an opportunity
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const opportunityId = searchParams.get('opportunityId');

    if (!userId || !opportunityId) {
      return NextResponse.json({ success: false, error: 'User ID and Opportunity ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('user_id', userId)
      .eq('opportunity_id', Number.parseInt(opportunityId));

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Opportunity unsaved' });
  } catch (error) {
    console.error('Saved opportunities DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to unsave opportunity' }, { status: 500 });
  }
}
