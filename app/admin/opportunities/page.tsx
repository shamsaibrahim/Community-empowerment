'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  X,
  Check,
  Briefcase
} from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  type: string;
  company: string;
  level: string;
  location: string;
  salary: string;
  match: number;
  is_active: boolean;
}

const TYPES = ['Job', 'Mentorship', 'Training', 'Grant'];
const LEVELS = ['Beginner', 'Mid-Level', 'Senior'];

export default function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Job',
    company: '',
    level: 'Mid-Level',
    location: '',
    salary: '',
    description: '',
    tags: '',
    match: 80,
  });

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchOpportunities();
      }
    } catch (err) {
      console.error('Failed to create opportunity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      await fetch(`/api/opportunities?id=${id}`, { method: 'DELETE' });
      fetchOpportunities();
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Job',
      company: '',
      level: 'Mid-Level',
      location: '',
      salary: '',
      description: '',
      tags: '',
      match: 80,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Opportunities</h1>
          <p className="text-muted-foreground">Create and manage job listings, mentorships, and grants</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            showForm 
              ? 'bg-muted text-foreground' 
              : 'bg-accent text-accent-foreground hover:bg-accent/90'
          }`}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Opportunity'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-border space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {editingId ? 'Edit Opportunity' : 'New Opportunity'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Product Designer"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Safaricom PLC"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Nairobi, Kenya or Remote"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Salary</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. KES 150,000 - 200,000"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Remote, Full-time, Contract"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the opportunity..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {submitting ? 'Saving...' : 'Save Opportunity'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Opportunities Table */}
      {!loading && (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Level</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Match</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOpportunities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No opportunities found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{opp.title}</p>
                        <p className="text-xs text-muted-foreground">{opp.location || 'No location'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{opp.company}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          opp.type === 'Job' ? 'bg-green-500/20 text-green-600' :
                          opp.type === 'Mentorship' ? 'bg-blue-500/20 text-blue-600' :
                          opp.type === 'Training' ? 'bg-purple-500/20 text-purple-600' :
                          'bg-amber-500/20 text-amber-600'
                        }`}>
                          {opp.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{opp.level}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{opp.match}%</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(opp.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
