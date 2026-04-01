'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Heart, X, Send, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface Comment {
  id: string;
  user_name: string;
  content: string;
  likes: number;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  replies: number;
  likes: number;
  authors: { name: string; avatar: string }[];
}

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  onLike: (postId: number) => void;
}

export function PostDetail({ post, onClose, onLike }: PostDetailProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${post.id}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          userId: user?.id || 'anonymous',
          userName: user?.name || 'Anonymous User',
          content: newComment,
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/40 text-foreground">
            {post.category}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-3">{post.title}</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {post.content || 'No additional details provided.'}
          </p>
          
          {/* Authors */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {post.authors.map((author, idx) => (
                <div
                  key={author.name}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/40 via-primary/40 to-secondary/40 border-2 border-card flex items-center justify-center text-sm"
                  title={author.name}
                >
                  {author.avatar}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {post.authors.map(a => a.name).join(', ')}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>{post.likes} likes</span>
            </button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} replies</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No replies yet</p>
              <p className="text-xs">Be the first to reply!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl bg-background/50 border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center text-sm font-bold text-foreground">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground text-sm">{comment.user_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 pl-10">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Write a reply..." : "Sign in to reply..."}
              disabled={!user}
              className="flex-1 px-4 py-2 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim() || !user}
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
