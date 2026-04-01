-- Supabase SQL Schema for Community Empowerment Dashboard
-- Safe to run multiple times (idempotent)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE DEFINITIONS
-- ============================================

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Job', 'Mentorship', 'Training', 'Grant')),
  company VARCHAR(255) NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Mid-Level', 'Senior')),
  location VARCHAR(255),
  salary VARCHAR(100),
  posted VARCHAR(100) DEFAULT 'Just now',
  deadline DATE,
  match INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  category VARCHAR(100) NOT NULL,
  replies INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  authors JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) DEFAULT 'demo-user',
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  label VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial goals table
CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) DEFAULT 'demo-user',
  monthly_goal DECIMAL(12, 2) NOT NULL,
  current_savings DECIMAL(12, 2) DEFAULT 0,
  month VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- Comments/Replies table for community posts
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(100) DEFAULT 'anonymous',
  user_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table for category-based budget tracking
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) DEFAULT 'demo-user',
  category VARCHAR(100) NOT NULL,
  budget_amount DECIMAL(12, 2) NOT NULL,
  spent_amount DECIMAL(12, 2) DEFAULT 0,
  month VARCHAR(20) NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, month, year)
);

-- Saved opportunities table (user bookmarks)
CREATE TABLE IF NOT EXISTS saved_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- ============================================
-- SAMPLE DATA (only inserts if tables are empty)
-- ============================================

-- Insert sample opportunities only if table is empty
INSERT INTO opportunities (title, type, company, description, tags, level, location, salary, posted, deadline, match, is_active)
SELECT * FROM (VALUES
  ('Senior Product Designer', 'Job', 'Safaricom PLC', 'Design innovative mobile money solutions for M-Pesa users across Africa.', ARRAY['Remote', 'Full-time'], 'Senior', 'Nairobi, Kenya', 'KES 250,000 - 350,000', '2 days ago', '2026-04-30'::DATE, 95, true),
  ('Mentorship: Growth Marketing', 'Mentorship', 'Kenya Youth Empowerment Network', 'Learn digital marketing strategies from industry experts.', ARRAY['Mentorship', 'Entry-Level'], 'Beginner', 'Virtual', NULL, '1 day ago', NULL::DATE, 88, true),
  ('Frontend Developer Contract', 'Job', 'Andela Kenya', 'Build modern web applications for global clients.', ARRAY['Remote', 'Contract'], 'Mid-Level', 'Remote', 'KES 180,000 - 250,000', '3 hours ago', NULL::DATE, 82, true),
  ('Youth Entrepreneurship Grant', 'Grant', 'Kenya National Youth Council', 'Funding for youth-led startups in technology and agriculture.', ARRAY['Funding', 'Startup'], 'Beginner', 'Kenya', 'Up to KES 500,000', '1 week ago', '2026-05-15'::DATE, 75, true),
  ('Digital Skills Training Program', 'Training', 'Ajira Digital', 'Free online training in web development, data entry, and virtual assistance.', ARRAY['Free', 'Certificate'], 'Beginner', 'Online', NULL, '5 days ago', NULL::DATE, 90, true)
) AS v(title, type, company, description, tags, level, location, salary, posted, deadline, match, is_active)
WHERE NOT EXISTS (SELECT 1 FROM opportunities LIMIT 1);

-- Insert sample community posts only if table is empty
INSERT INTO community_posts (title, content, category, replies, likes, authors, is_active)
SELECT * FROM (VALUES
  ('How to transition from freelance to full-time opportunities', 'Looking for advice on making the switch from freelancing to a stable job...', 'Career Guidance', 24, 156, '[{"name": "Wanjiku Mwangi", "avatar": "👩"}, {"name": "Brian Ochieng", "avatar": "👨"}, {"name": "Amina Hassan", "avatar": "👩"}]'::jsonb, true),
  ('Best practices for budgeting and financial planning', 'Share your tips on managing finances as a young professional in Kenya...', 'Financial Wellness', 18, 203, '[{"name": "Faith Njeri", "avatar": "👩"}, {"name": "Kevin Otieno", "avatar": "👨"}, {"name": "Grace Wambui", "avatar": "👩"}]'::jsonb, true),
  ('Networking tips: Building meaningful professional relationships', 'How do you network effectively in the Kenyan job market?', 'Community', 42, 287, '[{"name": "Samuel Kiprop", "avatar": "👨"}, {"name": "Mercy Akinyi", "avatar": "👩"}, {"name": "Dennis Mutua", "avatar": "👨"}]'::jsonb, true),
  ('M-Pesa savings tips for young entrepreneurs', 'Discussing how to leverage mobile money for business savings...', 'Financial Wellness', 31, 178, '[{"name": "Peter Kamau", "avatar": "👨"}, {"name": "Lucy Wanjiru", "avatar": "👩"}]'::jsonb, true)
) AS v(title, content, category, replies, likes, authors, is_active)
WHERE NOT EXISTS (SELECT 1 FROM community_posts LIMIT 1);

-- Insert sample transactions only if table is empty
INSERT INTO transactions (user_id, type, label, amount, category, date)
SELECT * FROM (VALUES
  ('demo-user', 'income', 'Freelance Project', 25000::DECIMAL, 'Work', '2026-04-01'::DATE),
  ('demo-user', 'expense', 'Utilities', 8500::DECIMAL, 'Bills', '2026-03-30'::DATE),
  ('demo-user', 'income', 'Part-time Teaching', 15000::DECIMAL, 'Work', '2026-03-28'::DATE),
  ('demo-user', 'expense', 'Transport', 3500::DECIMAL, 'Transport', '2026-03-27'::DATE),
  ('demo-user', 'expense', 'Groceries', 6000::DECIMAL, 'Food', '2026-03-25'::DATE),
  ('demo-user', 'income', 'Online Sales', 12000::DECIMAL, 'Business', '2026-03-24'::DATE)
) AS v(user_id, type, label, amount, category, date)
WHERE NOT EXISTS (SELECT 1 FROM transactions LIMIT 1);

-- Insert sample financial goal
INSERT INTO financial_goals (user_id, monthly_goal, current_savings, month, year)
VALUES ('demo-user', 50000, 34000, 'April', 2026)
ON CONFLICT (user_id, month, year) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES (using DROP IF EXISTS pattern)
-- ============================================

-- Opportunities policies
DROP POLICY IF EXISTS "Allow public read access on opportunities" ON opportunities;
DROP POLICY IF EXISTS "Allow public insert on opportunities" ON opportunities;
CREATE POLICY "Allow public read access on opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public insert on opportunities" ON opportunities FOR INSERT WITH CHECK (true);

-- Community posts policies
DROP POLICY IF EXISTS "Allow public read access on community_posts" ON community_posts;
DROP POLICY IF EXISTS "Allow public insert on community_posts" ON community_posts;
CREATE POLICY "Allow public read access on community_posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on community_posts" ON community_posts FOR INSERT WITH CHECK (true);

-- Transactions policies
DROP POLICY IF EXISTS "Allow public read access on transactions" ON transactions;
DROP POLICY IF EXISTS "Allow public insert on transactions" ON transactions;
CREATE POLICY "Allow public read access on transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on transactions" ON transactions FOR INSERT WITH CHECK (true);

-- Financial goals policies
DROP POLICY IF EXISTS "Allow public read access on financial_goals" ON financial_goals;
DROP POLICY IF EXISTS "Allow public insert on financial_goals" ON financial_goals;
DROP POLICY IF EXISTS "Allow public update on financial_goals" ON financial_goals;
CREATE POLICY "Allow public read access on financial_goals" ON financial_goals FOR SELECT USING (true);
CREATE POLICY "Allow public insert on financial_goals" ON financial_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on financial_goals" ON financial_goals FOR UPDATE USING (true);

-- Comments policies
DROP POLICY IF EXISTS "Allow public read on comments" ON comments;
DROP POLICY IF EXISTS "Allow public insert on comments" ON comments;
CREATE POLICY "Allow public read on comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);

-- Budgets policies
DROP POLICY IF EXISTS "Allow public read on budgets" ON budgets;
DROP POLICY IF EXISTS "Allow public insert on budgets" ON budgets;
DROP POLICY IF EXISTS "Allow public update on budgets" ON budgets;
CREATE POLICY "Allow public read on budgets" ON budgets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on budgets" ON budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on budgets" ON budgets FOR UPDATE USING (true);

-- Saved opportunities policies
DROP POLICY IF EXISTS "Allow public read on saved_opportunities" ON saved_opportunities;
DROP POLICY IF EXISTS "Allow public insert on saved_opportunities" ON saved_opportunities;
DROP POLICY IF EXISTS "Allow public delete on saved_opportunities" ON saved_opportunities;
CREATE POLICY "Allow public read on saved_opportunities" ON saved_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public insert on saved_opportunities" ON saved_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on saved_opportunities" ON saved_opportunities FOR DELETE USING (true);
