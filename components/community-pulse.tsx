'use client';

import { MessageCircle, Heart, Share2, Users } from 'lucide-react';
import Image from 'next/image';

interface CommunityPost {
  id: number;
  title: string;
  category: string;
  replies: number;
  likes: number;
  authors: { name: string; avatar: string }[];
  timeAgo: string;
}

const communityPosts: CommunityPost[] = [
  {
    id: 1,
    title: 'How to transition from freelance to full-time opportunities',
    category: 'Career Guidance',
    replies: 24,
    likes: 156,
    authors: [
      { name: 'Alex Chen', avatar: '👤' },
      { name: 'Sarah Mitchell', avatar: '👩' },
      { name: 'James Park', avatar: '👨' },
    ],
    timeAgo: '2 hours ago',
  },
  {
    id: 2,
    title: 'Best practices for budgeting and financial planning',
    category: 'Financial Wellness',
    replies: 18,
    likes: 203,
    authors: [
      { name: 'Maria Garcia', avatar: '👩' },
      { name: 'David Lee', avatar: '👨' },
      { name: 'Emma Wilson', avatar: '👩' },
    ],
    timeAgo: '4 hours ago',
  },
  {
    id: 3,
    title: 'Networking tips: Building meaningful professional relationships',
    category: 'Community',
    replies: 42,
    likes: 287,
    authors: [
      { name: 'Jordan Blake', avatar: '👤' },
      { name: 'Nina Sharma', avatar: '👩' },
      { name: 'Carlos Rodriguez', avatar: '👨' },
    ],
    timeAgo: '1 day ago',
  },
];

export function CommunityPulse() {
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
          <button className="px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 hover:border-accent/60 transition-all duration-300 text-xs font-semibold text-accent">
            View Forum
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityPosts.map((post, idx) => (
            <div
              key={post.id}
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
                  +{Math.floor(Math.random() * 5) + 2} more
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
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-card/50 border border-border/40 text-muted-foreground hover:border-accent/60 hover:text-accent transition-all duration-300">
                  <Heart className="w-4 h-4" />
                  Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-card/50 border border-border/40 text-muted-foreground hover:border-accent/60 hover:text-accent transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More CTA */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 text-foreground font-semibold transition-all duration-300 hover:border-primary/60 hover:bg-primary/30">
            Join the Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
