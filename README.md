# Community Empowerment Dashboard

A web-based platform empowering Kenyan youth (18-35) with economic opportunities, financial literacy tools, and community support.

## 🎯 Project Overview

This platform bridges the gap between economic opportunities, financial education, and social networking for youth and low-income households in Kenya.

**Core Features:**
- **Opportunity Board** - Job listings, mentorships, grants, and training programs
- **Financial Snapshot** - Budgeting tools, savings tracking, expense management
- **Community Pulse** - Forum discussions and peer mentorship

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **UI Components:** shadcn/ui, Radix UI, Lucide Icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Alibrahm/community-empowerment-dashboard.git
cd community-empowerment-dashboard
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

4. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🗄️ Database Setup (Supabase)

### Option 1: Use Mock Data (No Setup Required)
The app works out of the box with mock data. Just run `pnpm dev`.

### Option 2: Connect to Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `lib/supabase-schema.sql`
4. Go to **Settings > API** and copy your credentials
5. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── opportunities/   # Jobs, mentorships, grants
│   │   ├── community/       # Forum posts
│   │   └── financial/       # Transactions, goals
│   ├── globals.css          # Theme & styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard page
├── components/
│   ├── opportunity-board.tsx
│   ├── financial-snapshot.tsx
│   ├── community-pulse.tsx
│   └── ui/                  # shadcn components
├── hooks/
│   └── use-api.ts           # Data fetching hooks
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── supabase-schema.sql  # Database schema
│   ├── types.ts             # TypeScript types
│   └── data.ts              # Mock data fallback
```

## 🔌 API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/opportunities` | GET, POST | Job/mentorship listings |
| `/api/community` | GET, POST | Forum discussions |
| `/api/financial` | GET, POST, PATCH | Transactions & savings goals |

## 📝 License

This project is part of an academic research initiative at Umma University, Kenya.

## 👤 Author

**Shamsa Ibrahim Abdi** (DICT/2025/53823)  
Umma University, Kajiado, Kenya
