import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { opportunities as mockOpportunities, addOpportunity } from '@/lib/data';
import { ApiResponse, Opportunity } from '@/lib/types';

const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// GET all opportunities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');

    if (useSupabase) {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (type) query = query.eq('type', type);
      if (level) query = query.eq('level', level);

      const { data, error } = await query;

      if (error) throw error;

      const opportunities: Opportunity[] = (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        type: row.type,
        company: row.company,
        description: row.description,
        tags: row.tags || [],
        level: row.level,
        location: row.location,
        salary: row.salary,
        posted: row.posted,
        deadline: row.deadline,
        match: row.match,
        isActive: row.is_active,
      }));

      return NextResponse.json({ success: true, data: opportunities });
    }

    // Fallback to mock data
    let filtered = mockOpportunities.filter((o) => o.isActive);
    if (type) filtered = filtered.filter((o) => o.type === type);
    if (level) filtered = filtered.filter((o) => o.level === level);

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Opportunities GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

// POST new opportunity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (useSupabase) {
      const { data, error } = await supabase
        .from('opportunities')
        .insert({
          title: body.title,
          type: body.type,
          company: body.company,
          description: body.description,
          tags: body.tags || [],
          level: body.level,
          location: body.location,
          salary: body.salary,
          posted: 'Just now',
          deadline: body.deadline,
          match: body.match || 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(
        { success: true, data, message: 'Opportunity created successfully' },
        { status: 201 }
      );
    }

    // Fallback to mock data
    const newOpportunity = addOpportunity({
      ...body,
      posted: 'Just now',
      isActive: true,
    });

    return NextResponse.json(
      { success: true, data: newOpportunity, message: 'Opportunity created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Opportunities POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
