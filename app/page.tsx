import { DashboardLayout } from '@/components/dashboard-layout';
import { DashboardHeader } from '@/components/dashboard-header';
import { FinancialSnapshot } from '@/components/financial-snapshot';
import { OpportunityBoard } from '@/components/opportunity-board';
import { CommunityPulse } from '@/components/community-pulse';
import { BudgetTracker } from '@/components/budget-tracker';
import { FinancialAnalytics } from '@/components/financial-analytics';

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 md:py-10">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {/* Financial Snapshot - takes 1 column */}
            <div className="md:col-span-1">
              <FinancialSnapshot />
            </div>

            {/* Budget Tracker - takes 1 column */}
            <div className="md:col-span-1">
              <BudgetTracker />
            </div>

            {/* Opportunity Board - takes 1 column on lg */}
            <div className="md:col-span-2 lg:col-span-1">
              <OpportunityBoard />
            </div>

            {/* Financial Analytics - takes 2 columns */}
            <div className="md:col-span-2 lg:col-span-2">
              <FinancialAnalytics />
            </div>

            {/* Community Pulse - takes full width */}
            <div className="md:col-span-2 lg:col-span-3">
              <CommunityPulse />
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
