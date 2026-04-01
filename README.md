# Community Empowerment Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://community-empowerment-xi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/shamsaibrahim/Community-empowerment)

A web-based platform empowering Kenyan youth (18-35) with economic opportunities, financial literacy tools, and community support.

## � Live Demo

**🔗 [https://community-empowerment-xi.vercel.app](https://community-empowerment-xi.vercel.app)**

## �🎯 Project Overview

This platform bridges the gap between economic opportunities, financial education, and social networking for youth and low-income households in Kenya.

### Core Features

**👤 User Features:**
- **Opportunity Board** - Browse jobs, mentorships, grants, and training programs
- **Financial Snapshot** - Track income, expenses, and savings goals
- **Budget Tracker** - Create and monitor category-based budgets
- **Financial Analytics** - Visualize finances with bar, pie, and line charts
- **Community Pulse** - Forum discussions, posts, likes, comments
- **Dark/Light Mode** - Theme toggle for accessibility
- **Authentication** - Sign up/sign in with Supabase Auth

**🛡️ Admin Features:**
- **Admin Dashboard** - Overview stats and recent activity
- **Manage Opportunities** - Create, view, delete job listings
- **Moderate Posts** - Review and remove community content
- **User Management** - View registered users and roles
- **Settings** - Configure site options and security

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
git clone https://github.com/shamsaibrahim/Community-empowerment.git
cd Community-empowerment
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
│   ├── admin/               # Admin dashboard pages
│   │   ├── layout.tsx       # Admin layout with sidebar
│   │   ├── page.tsx         # Admin overview
│   │   ├── opportunities/   # Manage opportunities
│   │   ├── posts/           # Moderate posts
│   │   ├── users/           # User management
│   │   └── settings/        # Site settings
│   ├── api/                 # API routes
│   │   ├── opportunities/   # Jobs, mentorships, grants
│   │   ├── community/       # Forum posts
│   │   ├── financial/       # Transactions, goals
│   │   ├── budgets/         # Budget tracking
│   │   ├── comments/        # Post comments
│   │   └── saved-opportunities/  # Bookmarks
│   ├── auth/                # Authentication page
│   ├── globals.css          # Theme & styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard
├── components/
│   ├── opportunity-board.tsx
│   ├── financial-snapshot.tsx
│   ├── financial-analytics.tsx
│   ├── budget-tracker.tsx
│   ├── community-pulse.tsx
│   ├── post-detail.tsx
│   ├── dashboard-header.tsx
│   └── ui/                  # shadcn components
├── contexts/
│   └── auth-context.tsx     # Authentication context
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
| `/api/opportunities` | GET, POST, DELETE | Job/mentorship listings |
| `/api/community` | GET, POST, PATCH, DELETE | Forum discussions |
| `/api/financial` | GET, POST, PATCH | Transactions & savings goals |
| `/api/budgets` | GET, POST, PATCH, DELETE | Budget tracking |
| `/api/comments` | GET, POST | Post comments |
| `/api/saved-opportunities` | GET, POST, DELETE | User bookmarks |

## 👥 User Roles

| Role | Access |
|------|--------|
| **Guest** | View opportunities, posts, add transactions |
| **User** | All guest features + save opportunities, profile |
| **Admin** | All features + `/admin` panel for management |

## 📖 Documentation

See [USER_GUIDE.md](./USER_GUIDE.md) for detailed step-by-step instructions.

## 📝 License

This project is part of an academic research initiative at Umma University, Kenya.

## 👤 Author

**Shamsa Ibrahim Abdi** (DICT/2025/53823)  
Umma University, Kajiado, Kenya
