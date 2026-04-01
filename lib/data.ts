// Mock data store for MVP demo
import { Opportunity, CommunityPost, Transaction, FinancialGoal } from './types';

// Opportunities data
export const opportunities: Opportunity[] = [
  {
    id: 1,
    title: 'Senior Product Designer',
    type: 'Job',
    company: 'Safaricom PLC',
    description: 'Design innovative mobile money solutions for M-Pesa users across Africa.',
    tags: ['Remote', 'Full-time'],
    level: 'Senior',
    location: 'Nairobi, Kenya',
    salary: 'KES 250,000 - 350,000',
    posted: '2 days ago',
    deadline: '2026-04-30',
    match: 95,
    isActive: true,
  },
  {
    id: 2,
    title: 'Mentorship: Growth Marketing',
    type: 'Mentorship',
    company: 'Kenya Youth Empowerment Network',
    description: 'Learn digital marketing strategies from industry experts.',
    tags: ['Mentorship', 'Entry-Level'],
    level: 'Beginner',
    location: 'Virtual',
    posted: '1 day ago',
    match: 88,
    isActive: true,
  },
  {
    id: 3,
    title: 'Frontend Developer Contract',
    type: 'Job',
    company: 'Andela Kenya',
    description: 'Build modern web applications for global clients.',
    tags: ['Remote', 'Contract'],
    level: 'Mid-Level',
    location: 'Remote',
    salary: 'KES 180,000 - 250,000',
    posted: '3 hours ago',
    match: 82,
    isActive: true,
  },
  {
    id: 4,
    title: 'Youth Entrepreneurship Grant',
    type: 'Grant',
    company: 'Kenya National Youth Council',
    description: 'Funding for youth-led startups in technology and agriculture.',
    tags: ['Funding', 'Startup'],
    level: 'Beginner',
    location: 'Kenya',
    salary: 'Up to KES 500,000',
    posted: '1 week ago',
    deadline: '2026-05-15',
    match: 75,
    isActive: true,
  },
  {
    id: 5,
    title: 'Digital Skills Training Program',
    type: 'Training',
    company: 'Ajira Digital',
    description: 'Free online training in web development, data entry, and virtual assistance.',
    tags: ['Free', 'Certificate'],
    level: 'Beginner',
    location: 'Online',
    posted: '5 days ago',
    match: 90,
    isActive: true,
  },
];

// Community posts data
export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    title: 'How to transition from freelance to full-time opportunities',
    content: 'Looking for advice on making the switch from freelancing to a stable job...',
    category: 'Career Guidance',
    replies: 24,
    likes: 156,
    authors: [
      { name: 'Wanjiku Mwangi', avatar: '👩' },
      { name: 'Brian Ochieng', avatar: '👨' },
      { name: 'Amina Hassan', avatar: '👩' },
    ],
    timeAgo: '2 hours ago',
    createdAt: '2026-04-01T09:00:00Z',
    isActive: true,
  },
  {
    id: 2,
    title: 'Best practices for budgeting and financial planning',
    content: 'Share your tips on managing finances as a young professional in Kenya...',
    category: 'Financial Wellness',
    replies: 18,
    likes: 203,
    authors: [
      { name: 'Faith Njeri', avatar: '👩' },
      { name: 'Kevin Otieno', avatar: '👨' },
      { name: 'Grace Wambui', avatar: '👩' },
    ],
    timeAgo: '4 hours ago',
    createdAt: '2026-04-01T07:00:00Z',
    isActive: true,
  },
  {
    id: 3,
    title: 'Networking tips: Building meaningful professional relationships',
    content: 'How do you network effectively in the Kenyan job market?',
    category: 'Community',
    replies: 42,
    likes: 287,
    authors: [
      { name: 'Samuel Kiprop', avatar: '👨' },
      { name: 'Mercy Akinyi', avatar: '👩' },
      { name: 'Dennis Mutua', avatar: '👨' },
    ],
    timeAgo: '1 day ago',
    createdAt: '2026-03-31T10:00:00Z',
    isActive: true,
  },
  {
    id: 4,
    title: 'M-Pesa savings tips for young entrepreneurs',
    content: 'Discussing how to leverage mobile money for business savings...',
    category: 'Financial Wellness',
    replies: 31,
    likes: 178,
    authors: [
      { name: 'Peter Kamau', avatar: '👨' },
      { name: 'Lucy Wanjiru', avatar: '👩' },
    ],
    timeAgo: '2 days ago',
    createdAt: '2026-03-30T14:00:00Z',
    isActive: true,
  },
];

// Financial data
export const transactions: Transaction[] = [
  { id: '1', type: 'income', label: 'Freelance Project', amount: 25000, category: 'Work', date: '2026-04-01' },
  { id: '2', type: 'expense', label: 'Utilities', amount: 8500, category: 'Bills', date: '2026-03-30' },
  { id: '3', type: 'income', label: 'Part-time Teaching', amount: 15000, category: 'Work', date: '2026-03-28' },
  { id: '4', type: 'expense', label: 'Transport', amount: 3500, category: 'Transport', date: '2026-03-27' },
  { id: '5', type: 'expense', label: 'Groceries', amount: 6000, category: 'Food', date: '2026-03-25' },
  { id: '6', type: 'income', label: 'Online Sales', amount: 12000, category: 'Business', date: '2026-03-24' },
];

export const financialGoals: FinancialGoal[] = [
  {
    id: '1',
    userId: 'demo-user',
    monthlyGoal: 50000,
    currentSavings: 34000,
    month: 'April',
    year: 2026,
  },
];

// Helper functions to simulate database operations
let nextOpportunityId = opportunities.length + 1;
let nextPostId = communityPosts.length + 1;
let nextTransactionId = transactions.length + 1;

export function addOpportunity(opp: Omit<Opportunity, 'id'>): Opportunity {
  const newOpp = { ...opp, id: nextOpportunityId++ };
  opportunities.push(newOpp);
  return newOpp;
}

export function addCommunityPost(post: Omit<CommunityPost, 'id'>): CommunityPost {
  const newPost = { ...post, id: nextPostId++ };
  communityPosts.push(newPost);
  return newPost;
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  const newTransaction = { ...transaction, id: String(nextTransactionId++) };
  transactions.push(newTransaction);
  return newTransaction;
}

export function updateFinancialGoal(goalId: string, updates: Partial<FinancialGoal>): FinancialGoal | null {
  const index = financialGoals.findIndex(g => g.id === goalId);
  if (index === -1) return null;
  financialGoals[index] = { ...financialGoals[index], ...updates };
  return financialGoals[index];
}
