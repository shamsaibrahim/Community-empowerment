'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalOpportunities: number;
  totalPosts: number;
  totalTransactions: number;
  recentActivity: { type: string; message: string; time: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from various endpoints
        const [oppsRes, postsRes, transRes] = await Promise.all([
          fetch('/api/opportunities'),
          fetch('/api/community'),
          fetch('/api/financial?type=transactions'),
        ]);

        const [oppsData, postsData, transData] = await Promise.all([
          oppsRes.json(),
          postsRes.json(),
          transRes.json(),
        ]);

        setStats({
          totalUsers: 156, // Mock - would come from auth provider
          totalOpportunities: oppsData.data?.length || 0,
          totalPosts: postsData.data?.length || 0,
          totalTransactions: transData.data?.length || 0,
          recentActivity: [
            { type: 'opportunity', message: 'New job posted: Senior Developer', time: '5 min ago' },
            { type: 'user', message: 'New user registered: john@example.com', time: '12 min ago' },
            { type: 'post', message: 'New community post created', time: '25 min ago' },
            { type: 'transaction', message: 'Budget updated for April', time: '1 hour ago' },
          ],
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      up: true
    },
    { 
      label: 'Opportunities', 
      value: stats?.totalOpportunities || 0, 
      icon: Briefcase, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+8%',
      up: true
    },
    { 
      label: 'Community Posts', 
      value: stats?.totalPosts || 0, 
      icon: MessageSquare, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: '+24%',
      up: true
    },
    { 
      label: 'Transactions', 
      value: stats?.totalTransactions || 0, 
      icon: DollarSign, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      change: '-3%',
      up: false
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {stats?.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'opportunity' ? 'bg-green-500' :
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'post' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/opportunities"
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 hover:border-green-500/60 transition-colors text-center"
            >
              <Briefcase className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Add Opportunity</p>
            </a>
            <a
              href="/admin/posts"
              className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-colors text-center"
            >
              <MessageSquare className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Manage Posts</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/60 transition-colors text-center"
            >
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">View Users</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-colors text-center"
            >
              <Activity className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Analytics</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
