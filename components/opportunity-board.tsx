'use client';

import { Briefcase, MapPin, Clock, ExternalLink } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  type: string;
  company: string;
  tags: string[];
  level: string;
  posted: string;
  match: number;
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: 'Senior Product Designer',
    type: 'Job',
    company: 'TechVenture Co',
    tags: ['Remote', 'Full-time'],
    level: 'Senior',
    posted: '2 days ago',
    match: 95,
  },
  {
    id: 2,
    title: 'Mentorship: Growth Marketing',
    type: 'Mentorship',
    company: 'Marketing Pro Network',
    tags: ['Mentorship', 'Entry-Level'],
    level: 'Beginner',
    posted: '1 day ago',
    match: 88,
  },
  {
    id: 3,
    title: 'Frontend Developer Contract',
    type: 'Job',
    company: 'Digital Innovation Labs',
    tags: ['Remote', 'Contract'],
    level: 'Mid-Level',
    posted: '3 hours ago',
    match: 82,
  },
];

export function OpportunityBoard() {
  return (
    <div className="group relative h-full min-h-[400px]">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all duration-300 group-hover:border-border group-hover:shadow-2xl group-hover:shadow-accent/10" />

      {/* Content */}
      <div className="relative p-6 md:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Opportunity Board
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              3 new matches for you
            </p>
          </div>
          <button className="px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 hover:border-accent/60 transition-all duration-300 text-xs font-semibold text-accent">
            View All
          </button>
        </div>

        {/* Opportunities List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {opportunities.map((opp, idx) => (
            <div
              key={opp.id}
              className="group/item p-4 rounded-xl bg-gradient-to-r from-card/50 via-card/40 to-card/20 border border-border/40 hover:border-accent/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:bg-card/60 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover/item:text-accent transition-colors duration-300">
                    {opp.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {opp.company}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-accent/30 to-primary/30 border border-accent/40">
                    <span className="text-xs font-bold text-accent">
                      {opp.match}% match
                    </span>
                  </div>
                  <button className="p-2 rounded-lg bg-card/50 border border-border/40 hover:border-accent/60 text-muted-foreground hover:text-accent transition-all duration-300 opacity-0 group-hover/item:opacity-100">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {opp.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-secondary/30 to-primary/30 border border-secondary/40 text-secondary-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between pt-3 border-t border-border/30 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="inline-block">{opp.level}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {opp.posted}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-accent via-primary to-secondary text-accent-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]">
          Explore More Opportunities
        </button>
      </div>
    </div>
  );
}
