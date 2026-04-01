// Core types for the Community Empowerment Dashboard

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Opportunity {
  id: number;
  title: string;
  type: 'Job' | 'Mentorship' | 'Training' | 'Grant';
  company: string;
  description?: string;
  tags: string[];
  level: 'Beginner' | 'Mid-Level' | 'Senior';
  location?: string;
  salary?: string;
  posted: string;
  deadline?: string;
  match: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  label: string;
  amount: number;
  category: string;
  date: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  monthlyGoal: number;
  currentSavings: number;
  month: string;
  year: number;
}

export interface CommunityPost {
  id: number;
  title: string;
  content?: string;
  category: string;
  replies: number;
  likes: number;
  authors: { name: string; avatar: string }[];
  timeAgo: string;
  createdAt: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
