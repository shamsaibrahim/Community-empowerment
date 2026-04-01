# Community Empowerment Dashboard - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Normal User Guide](#normal-user-guide)
3. [Admin User Guide](#admin-user-guide)

---

## Getting Started

### Accessing the Dashboard
- **Live URL:** [https://community-empowerment-xi.vercel.app](https://community-empowerment-xi.vercel.app)
- **Local Development:** `http://localhost:3000`

### Creating an Account
1. Click **"Sign In"** in the top-right header
2. You'll be redirected to `/auth`
3. Click **"Sign Up"** tab
4. Enter your details:
   - Full Name
   - Email Address
   - Password (min 6 characters)
5. Click **"Create Account"**
6. You're now logged in and redirected to the dashboard

### Signing In
1. Click **"Sign In"** in the header
2. Enter your email and password
3. Click **"Sign In"**

---

## Normal User Guide

### Step 1: View Your Financial Snapshot
**Location:** Dashboard → Financial Snapshot card (top-left)

1. View your **current balance** and **monthly savings goal**
2. See **income vs expenses** breakdown
3. Track **savings progress** with the progress bar

### Step 2: Add a Transaction
**Location:** Financial Snapshot → "Add Transaction" button

1. Click **"Add Transaction"**
2. Fill in the form:
   - **Type:** Select Income or Expense
   - **Label:** Description (e.g., "Freelance Payment")
   - **Amount:** Enter amount in KES
   - **Category:** Select category (Work, Food, Transport, Bills, etc.)
3. Click **"Add Transaction"**
4. Your balance updates automatically

### Step 3: Set Financial Goals
**Location:** Financial Snapshot → Edit icon next to goal

1. Click the **edit icon** (pencil) next to your savings goal
2. Enter your **monthly savings target** in KES
3. Click **"Save"**
4. Track your progress throughout the month

### Step 4: Create and Track Budgets
**Location:** Dashboard → Budget Tracker card

1. Click **"Add Budget"**
2. Fill in:
   - **Category:** Food, Transport, Entertainment, etc.
   - **Budget Amount:** Monthly limit in KES
3. Click **"Create Budget"**
4. As you spend, click **"Update Spent"** to log expenses
5. Monitor the progress bar - it turns red when over budget

### Step 5: Browse Opportunities
**Location:** Dashboard → Opportunity Board card

1. View available **Jobs, Mentorships, Training, and Grants**
2. Use the **search bar** to find specific opportunities
3. Use **filter buttons** to filter by type:
   - All | Jobs | Mentorship | Training | Grants
4. Each opportunity shows:
   - Title and company
   - Location and salary (if applicable)
   - Match percentage
   - Tags (Remote, Full-time, etc.)

### Step 6: Apply to an Opportunity
**Location:** Opportunity Board → "Apply Now" button

1. Find an opportunity you're interested in
2. Click **"Apply Now"**
3. You'll be redirected to the external application page
4. Complete the application on the company's website

### Step 7: Save/Bookmark Opportunities
**Location:** Opportunity Board → Bookmark icon

1. **Must be logged in**
2. Click the **bookmark icon** on any opportunity
3. The icon fills in to show it's saved
4. Access saved opportunities from your profile

### Step 8: View Financial Analytics
**Location:** Dashboard → Financial Analytics card

1. View your financial data in **charts**
2. Toggle between chart types:
   - **Bar Chart:** Income vs Expenses by category
   - **Pie Chart:** Expense breakdown by category
   - **Line Chart:** Daily income/expense trends
3. Summary cards show:
   - Total Income
   - Total Expenses
   - Net Savings

### Step 9: Browse Community Posts
**Location:** Dashboard → Community Pulse card (bottom)

1. View community discussions by category:
   - Career Guidance
   - Financial Wellness
   - Community
2. See post stats: replies, likes, authors
3. Click on a post to view details

### Step 10: Create a Community Post
**Location:** Community Pulse → Post form

1. Enter your **post title**
2. Write your **content/question**
3. Select a **category**
4. Click **"Post"**
5. Your post appears in the feed

### Step 11: Interact with Posts
**Location:** Community Pulse → Post cards

1. **Like a post:** Click the heart icon
2. **Share a post:** Click the share icon (copies link)
3. **View details:** Click on the post card
4. **Add a comment:** In the post detail modal, write your comment and click "Post Comment"

### Step 12: Toggle Dark/Light Mode
**Location:** Header → Sun/Moon icon

1. Click the **sun icon** (in dark mode) or **moon icon** (in light mode)
2. The theme switches instantly
3. Your preference is saved

### Step 13: Sign Out
**Location:** Header → User menu

1. Click on your **profile avatar/name** in the header
2. Click **"Sign Out"**
3. You're logged out and returned to the dashboard

---

## Admin User Guide

### Accessing Admin Panel
**URL:** `/admin`

1. Sign in with an admin email (configured in the system)
2. Navigate to `/admin` or click "Admin" link
3. You'll see the admin sidebar and dashboard

> **Note:** Admin emails are configured in `app/admin/layout.tsx`. Contact the developer to add admin access.

---

### Admin Step 1: View Dashboard Overview
**Location:** `/admin` (Admin Dashboard)

1. View **key statistics:**
   - Total Users
   - Total Opportunities
   - Community Posts
   - Transactions
2. See **percentage changes** (growth indicators)
3. Monitor **Recent Activity** feed
4. Use **Quick Actions** to navigate to management pages

---

### Admin Step 2: Manage Opportunities
**Location:** `/admin/opportunities`

#### View All Opportunities
1. Navigate to **Opportunities** in sidebar
2. See table with all listings:
   - Title, Company, Type, Level, Match %
3. Use **search bar** to find specific opportunities

#### Create New Opportunity
1. Click **"Add Opportunity"** button
2. Fill in the form:
   - **Title:** Job/opportunity title
   - **Company:** Organization name
   - **Type:** Job, Mentorship, Training, or Grant
   - **Level:** Beginner, Mid-Level, or Senior
   - **Location:** City or "Remote"
   - **Salary:** Compensation range (optional)
   - **Tags:** Comma-separated (e.g., "Remote, Full-time")
   - **Description:** Detailed description
3. Click **"Save Opportunity"**

#### Delete an Opportunity
1. Find the opportunity in the table
2. Click the **trash icon** in the Actions column
3. Confirm deletion

---

### Admin Step 3: Moderate Community Posts
**Location:** `/admin/posts`

#### View All Posts
1. Navigate to **Community Posts** in sidebar
2. See grid of all posts with:
   - Title and category
   - Content preview
   - Replies and likes count
   - Authors

#### Search Posts
1. Use the **search bar** at the top
2. Filter by title or category

#### Delete Inappropriate Posts
1. Find the post to remove
2. Click the **trash icon**
3. Confirm deletion
4. Post is removed from the community feed

---

### Admin Step 4: View Users
**Location:** `/admin/users`

#### View User Statistics
1. Navigate to **Users** in sidebar
2. See summary cards:
   - Total Users
   - Active Users
   - Admin count

#### Browse User List
1. View table with all users:
   - Name and email
   - Role (Admin/User)
   - Status (Active/Inactive)
   - Join date
   - Last active

#### Filter Users
1. Use **search bar** to find by name/email
2. Use **role dropdown** to filter:
   - All Roles
   - Admins only
   - Users only

---

### Admin Step 5: Configure Settings
**Location:** `/admin/settings`

#### General Settings
1. Navigate to **Settings** in sidebar
2. Configure:
   - **Site Name:** Dashboard title
   - **Site Description:** Tagline
   - **Default Currency:** KES, USD, EUR
   - **Items Per Page:** Pagination limit

#### Security Settings
1. Toggle options:
   - **Allow User Registration:** Enable/disable signups
   - **Require Email Verification:** Force email confirmation
   - **Moderate Posts Before Publish:** Review posts before they go live

#### Notification Settings
1. Toggle **Email Notifications** on/off

#### Save Changes
1. Click **"Save Settings"** button
2. Confirmation message appears

---

### Admin Step 6: Return to Main Dashboard
**Location:** Admin sidebar → Bottom

1. Click **"← Back to Main Dashboard"**
2. You're returned to the user-facing dashboard
3. You can still access `/admin` anytime

---

## Quick Reference

### User Actions Summary
| Action | Location | Requires Login |
|--------|----------|----------------|
| View opportunities | Dashboard | No |
| Apply to opportunity | Opportunity Board | No |
| Save opportunity | Opportunity Board | **Yes** |
| Add transaction | Financial Snapshot | No |
| Create budget | Budget Tracker | No |
| View analytics | Financial Analytics | No |
| Create post | Community Pulse | No |
| Like/comment on post | Community Pulse | No |
| Toggle theme | Header | No |

### Admin Actions Summary
| Action | Location | Access |
|--------|----------|--------|
| View stats | /admin | Admin only |
| Create opportunity | /admin/opportunities | Admin only |
| Delete opportunity | /admin/opportunities | Admin only |
| Moderate posts | /admin/posts | Admin only |
| Delete posts | /admin/posts | Admin only |
| View users | /admin/users | Admin only |
| Configure settings | /admin/settings | Admin only |

---

## Troubleshooting

### Can't access admin panel?
- Ensure you're logged in
- Your email must be in the admin list
- Contact the system administrator

### Transactions not saving?
- Check your internet connection
- Ensure Supabase is configured correctly
- Try refreshing the page

### Charts not loading?
- Add some transactions first
- Check browser console for errors

### Post not appearing?
- Refresh the page
- Check if moderation is enabled

---

## Support
For technical issues, contact the development team or raise an issue on GitHub.
