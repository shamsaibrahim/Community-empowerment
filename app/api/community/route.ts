import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { communityPosts as mockPosts, addCommunityPost } from '@/lib/data';
import { CommunityPost } from '@/lib/types';

const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// Helper to calculate time ago
function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// GET all community posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (useSupabase) {
      let query = supabase
        .from('community_posts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) query = query.eq('category', category);

      const { data, error } = await query;

      if (error) throw error;

      const posts: CommunityPost[] = (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        category: row.category,
        replies: row.replies,
        likes: row.likes,
        authors: row.authors || [],
        timeAgo: getTimeAgo(row.created_at),
        createdAt: row.created_at,
        isActive: row.is_active,
      }));

      return NextResponse.json({ success: true, data: posts });
    }

    // Fallback to mock data
    let filtered = mockPosts.filter((p) => p.isActive);
    if (category) filtered = filtered.filter((p) => p.category === category);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Community GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community posts' },
      { status: 500 }
    );
  }
}

// POST new community post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (useSupabase) {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          title: body.title,
          content: body.content,
          category: body.category,
          replies: 0,
          likes: 0,
          authors: body.authors || [],
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(
        { success: true, data, message: 'Post created successfully' },
        { status: 201 }
      );
    }

    // Fallback to mock data
    const newPost = addCommunityPost({
      ...body,
      replies: 0,
      likes: 0,
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    return NextResponse.json(
      { success: true, data: newPost, message: 'Post created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Community POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PATCH to like/update a post
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Post ID required' }, { status: 400 });
    }

    if (useSupabase) {
      if (action === 'like') {
        // Get current likes
        const { data: post, error: fetchError } = await supabase
          .from('community_posts')
          .select('likes')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        // Increment likes
        const { data, error } = await supabase
          .from('community_posts')
          .update({ likes: (post?.likes || 0) + 1 })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data, message: 'Post liked' });
      }

      if (action === 'incrementReplies') {
        const { data: post, error: fetchError } = await supabase
          .from('community_posts')
          .select('replies')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        const { data, error } = await supabase
          .from('community_posts')
          .update({ replies: (post?.replies || 0) + 1 })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data, message: 'Reply count updated' });
      }
    }

    return NextResponse.json({ success: false, error: 'Action not supported' }, { status: 400 });
  } catch (error) {
    console.error('Community PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
