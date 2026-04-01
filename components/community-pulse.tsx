'use client';

import { useState } from 'react';
import { MessageCircle, Heart, Share2, Users, Loader2, Plus, X, Send } from 'lucide-react';
import { useCommunityPosts, useCreatePost } from '@/hooks/use-api';
import { useAuth } from '@/contexts/auth-context';
import { PostDetail } from './post-detail';

const POST_CATEGORIES = ['Career Guidance', 'Financial Wellness', 'Community', 'Skills & Training', 'Mentorship'];

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  replies: number;
  likes: number;
  authors: { name: string; avatar: string }[];
  timeAgo: string;
}

export function CommunityPulse() {
  const { data: communityPosts, loading, error, refetch } = useCommunityPosts();
  const { createPost, loading: submitting } = useCreatePost();
  const { user } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Community',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !user) return;
    
    await createPost({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      authors: [{ name: user.name || 'Anonymous', avatar: '👤' }],
    });
    
    setFormData({ title: '', content: '', category: 'Community' });
    setShowForm(false);
    refetch();
  };

  const handleLike = async (postId: number) => {
    try {
      await fetch('/api/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, action: 'like' }),
      });
      refetch();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <div className="group relative w-full">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all duration-300 group-hover:border-border group-hover:shadow-2xl group-hover:shadow-accent/10" />

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Community Pulse
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Latest discussions and community insights
            </p>
          </div>
          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-3 py-1 rounded-full border transition-all duration-300 text-xs font-semibold flex items-center gap-1 ${
                showForm 
                  ? 'bg-accent text-accent-foreground border-accent' 
                  : 'bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 hover:border-accent/60 text-accent'
              }`}
            >
              {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showForm ? 'Cancel' : 'New Post'}
            </button>
          ) : (
            <span className="px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground">
              Sign in to post
            </span>
          )}
        </div>

        {/* Create Post Form */}
        {showForm && user && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-xl bg-background/50 border border-border/50 space-y-4">
            <div>
              <input
                type="text"
                placeholder="What's on your mind? Start a discussion..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 text-sm"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Add more details (optional)..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60 cursor-pointer"
              >
                {POST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting || !formData.title}
                className="ml-auto px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12 text-destructive">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && communityPosts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityPosts.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post as Post)}
              className="group/post p-5 rounded-xl bg-gradient-to-br from-background/40 to-background/20 border border-border/40 hover:border-accent/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:bg-background/60 hover:shadow-lg hover:shadow-accent/5 hover:translate-y-[-2px]"
            >
              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/40 text-primary-foreground">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-foreground text-sm md:text-base leading-snug mb-4 line-clamp-2 group-hover/post:text-accent transition-colors duration-300">
                {post.title}
              </h3>

              {/* User Avatars Stack */}
              <div className="flex items-center gap-3 mb-4 py-4 border-t border-b border-border/30">
                <div className="flex -space-x-2">
                  {post.authors.map((author, authorIdx) => (
                    <div
                      key={authorIdx}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/40 via-primary/40 to-secondary/40 border-2 border-card flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform duration-300 hover:z-10"
                      title={author.name}
                    >
                      <span className="text-xs">{author.avatar}</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  +{(idx % 5) + 3} more
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 hover:text-accent transition-colors duration-300 group-hover/post:text-secondary">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-accent transition-colors duration-300 group-hover/post:text-accent">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                </div>
                <span className="text-xs">{post.timeAgo}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-border/30 opacity-0 group-hover/post:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-card/50 border border-border/40 text-muted-foreground hover:border-accent/60 hover:text-accent transition-all duration-300"
                >
                  <Heart className="w-4 h-4" />
                  Like
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (navigator.share) {
                      navigator.share({ title: post.title, text: post.content || post.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-card/50 border border-border/40 text-muted-foreground hover:border-accent/60 hover:text-accent transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* View More CTA */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 text-foreground font-semibold transition-all duration-300 hover:border-primary/60 hover:bg-primary/30">
            Join the Conversation
          </button>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
        />
      )}
    </div>
  );
}
