'use client';

import { useState } from 'react';
import { 
  Search, 
  Users,
  Mail,
  Calendar,
  Shield,
  User
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinedAt: string;
  lastActive: string;
}

const MOCK_USERS: UserData[] = [
  { id: '1', name: 'Wanjiku Mwangi', email: 'wanjiku@example.com', role: 'user', status: 'active', joinedAt: '2026-01-15', lastActive: '2 hours ago' },
  { id: '2', name: 'Brian Ochieng', email: 'brian@example.com', role: 'user', status: 'active', joinedAt: '2026-02-20', lastActive: '1 day ago' },
  { id: '3', name: 'Admin User', email: 'admin@community.ke', role: 'admin', status: 'active', joinedAt: '2025-12-01', lastActive: 'Just now' },
  { id: '4', name: 'Faith Njeri', email: 'faith@example.com', role: 'user', status: 'active', joinedAt: '2026-03-10', lastActive: '3 days ago' },
  { id: '5', name: 'Kevin Otieno', email: 'kevin@example.com', role: 'user', status: 'inactive', joinedAt: '2026-01-25', lastActive: '2 weeks ago' },
  { id: '6', name: 'Grace Wambui', email: 'grace@example.com', role: 'user', status: 'active', joinedAt: '2026-03-28', lastActive: '5 hours ago' },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: MOCK_USERS.length,
    active: MOCK_USERS.filter(u => u.status === 'active').length,
    admins: MOCK_USERS.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">View and manage registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <User className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
          className="px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-accent"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="font-bold text-accent">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-600' 
                          : 'bg-blue-500/20 text-blue-600'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-600' 
                          : 'bg-gray-500/20 text-gray-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.lastActive}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-muted-foreground text-center">
        Note: User data is fetched from Supabase Auth in production. This is demo data.
      </p>
    </div>
  );
}
