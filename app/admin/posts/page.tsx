'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Loader2,
  MessageSquare,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';

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

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await fetch(`/api/community?id=${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Community Posts</h1>
        <p className="text-muted-foreground">View and moderate community discussions</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Posts Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No posts found</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
              >
                {/* Category */}
                <div className="mb-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary-foreground">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                
                {/* Content Preview */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.content || 'No content'}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <span className="ml-auto text-xs">{post.timeAgo}</span>
                </div>

                {/* Authors */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <div className="flex -space-x-2">
                    {post.authors.slice(0, 3).map((author, idx) => (
                      <div
                        key={author.name}
                        className="w-6 h-6 rounded-full bg-accent/30 border border-card flex items-center justify-center text-xs"
                      >
                        {author.avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {post.authors.map(a => a.name).join(', ')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
