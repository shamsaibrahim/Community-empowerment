'use client';

import { useState, useMemo, useEffect } from 'react';
import { Briefcase, Clock, ExternalLink, Loader2, Search, Filter, Bookmark, BookmarkCheck } from 'lucide-react';
import { useOpportunities } from '@/hooks/use-api';
import { useAuth } from '@/contexts/auth-context';

const OPPORTUNITY_TYPES = ['All', 'Job', 'Mentorship', 'Training', 'Grant'];
const OPPORTUNITY_LEVELS = ['All', 'Beginner', 'Mid-Level', 'Senior'];

export function OpportunityBoard() {
  const { data: opportunities, loading, error } = useOpportunities();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingId, setSavingId] = useState<number | null>(null);

  // Fetch saved opportunities when user logs in
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/saved-opportunities?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setSavedIds(new Set(data.data.map((s: { opportunity_id: number }) => s.opportunity_id)));
          }
        })
        .catch(console.error);
    } else {
      setSavedIds(new Set());
    }
  }, [user?.id]);

  const toggleSave = async (oppId: number) => {
    if (!user?.id) return;
    
    setSavingId(oppId);
    const isSaved = savedIds.has(oppId);
    
    try {
      if (isSaved) {
        await fetch(`/api/saved-opportunities?userId=${user.id}&opportunityId=${oppId}`, {
          method: 'DELETE',
        });
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(oppId);
          return next;
        });
      } else {
        await fetch('/api/saved-opportunities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, opportunityId: oppId }),
        });
        setSavedIds(prev => new Set(prev).add(oppId));
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSavingId(null);
    }
  };

  // Filter opportunities based on search and filters
  const filteredOpportunities = useMemo(() => {
    if (!opportunities) return [];
    
    return opportunities.filter((opp) => {
      const matchesSearch = searchQuery === '' || 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || opp.type === selectedType;
      const matchesLevel = selectedLevel === 'All' || opp.level === selectedLevel;
      
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [opportunities, searchQuery, selectedType, selectedLevel]);

  return (
    <div className="group relative h-full min-h-[400px]">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl shadow-black/20 transition-all duration-300 group-hover:border-border group-hover:shadow-2xl group-hover:shadow-accent/10" />

      {/* Content */}
      <div className="relative p-6 md:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Opportunity Board
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {filteredOpportunities.length} opportunities found
            </p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1 rounded-full border transition-all duration-300 text-xs font-semibold flex items-center gap-1 ${
              showFilters 
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 hover:border-accent/60 text-accent'
            }`}
          >
            <Filter className="w-3 h-3" />
            Filters
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 mb-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60 transition-colors cursor-pointer"
              >
                {OPPORTUNITY_TYPES.map((type) => (
                  <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-accent/60 transition-colors cursor-pointer"
              >
                {OPPORTUNITY_LEVELS.map((level) => (
                  <option key={level} value={level}>{level === 'All' ? 'All Levels' : level}</option>
                ))}
              </select>
              {(selectedType !== 'All' || selectedLevel !== 'All' || searchQuery) && (
                <button
                  onClick={() => { setSelectedType('All'); setSelectedLevel('All'); setSearchQuery(''); }}
                  className="px-3 py-2 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive text-sm hover:bg-destructive/30 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center text-destructive">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Opportunities List */}
        {!loading && !error && filteredOpportunities.length > 0 && (
        <div className="flex-1 space-y-3 overflow-y-auto">
          {filteredOpportunities.map((opp) => (
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
                  {user && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSave(opp.id); }}
                      disabled={savingId === opp.id}
                      className={`p-2 rounded-lg border transition-all duration-300 ${
                        savedIds.has(opp.id)
                          ? 'bg-accent/20 border-accent/60 text-accent'
                          : 'bg-card/50 border-border/40 hover:border-accent/60 text-muted-foreground hover:text-accent opacity-0 group-hover/item:opacity-100'
                      }`}
                      title={savedIds.has(opp.id) ? 'Remove from saved' : 'Save opportunity'}
                    >
                      {savingId === opp.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : savedIds.has(opp.id) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  )}
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
                  <span className="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary-foreground font-medium">{opp.type}</span>
                  <span className="inline-block">{opp.level}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {opp.posted}
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`#apply-${opp.id}`, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-colors flex items-center gap-1"
                >
                  Apply Now
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOpportunities.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-8">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No opportunities found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA Button */}
        <button className="mt-6 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-accent via-primary to-secondary text-accent-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]">
          Explore More Opportunities
        </button>
      </div>
    </div>
  );
}
