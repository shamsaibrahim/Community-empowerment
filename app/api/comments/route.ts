import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ success: false, error: 'Post ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', Number.parseInt(postId))
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId, userName, content } = body;

    if (!postId || !userName || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Insert comment
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId || 'anonymous',
        user_name: userName,
        content,
      })
      .select()
      .single();

    if (commentError) throw commentError;

    // Update reply count on the post
    const { error: updateError } = await supabase.rpc('increment_replies', { post_id: postId });
    
    // If RPC doesn't exist, try direct update
    if (updateError) {
      await supabase
        .from('community_posts')
        .update({ replies: supabase.rpc('increment', { x: 1 }) })
        .eq('id', postId);
    }

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    console.error('Comments POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}
