'use client';

import { Bell, Settings, User } from 'lucide-react';

export function DashboardHeader() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
        ? 'Good afternoon'
        : 'Good evening';

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 md:px-8 py-6">
        {/* Left section - Greeting */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {greeting}
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Welcome back! Here's your community empowerment dashboard.
          </p>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-6">
          {/* Notification Bell */}
          <button className="p-2 md:p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-accent/20 group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
          </button>

          {/* Settings */}
          <button className="p-2 md:p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-accent/20 group">
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
          </button>

          {/* User Profile */}
          <button className="hidden sm:flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-sm border border-accent/30 hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground hidden md:block">
              Profile
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
