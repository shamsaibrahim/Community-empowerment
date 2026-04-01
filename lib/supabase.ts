import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching our schema
export interface DbOpportunity {
  id: number;
  title: string;
  type: 'Job' | 'Mentorship' | 'Training' | 'Grant';
  company: string;
  description: string | null;
  tags: string[];
  level: 'Beginner' | 'Mid-Level' | 'Senior';
  location: string | null;
  salary: string | null;
  posted: string;
  deadline: string | null;
  match: number;
  is_active: boolean;
  created_at: string;
}

export interface DbCommunityPost {
  id: number;
  title: string;
  content: string | null;
  category: string;
  replies: number;
  likes: number;
  authors: { name: string; avatar: string }[];
  is_active: boolean;
  created_at: string;
}

export interface DbTransaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  label: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

export interface DbFinancialGoal {
  id: string;
  user_id: string;
  monthly_goal: number;
  current_savings: number;
  month: string;
  year: number;
  created_at: string;
}
