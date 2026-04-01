'use client';

import { Bell, Settings, User, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 md:p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-accent/20 group"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mounted && (
              theme === 'dark' 
                ? <Sun className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                : <Moon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
            )}
          </button>

          {/* Notification Bell */}
          <button className="p-2 md:p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-accent/20 group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
          </button>

          {/* Settings */}
          <button className="p-2 md:p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-accent transition-all duration-300 hover:bg-card hover:shadow-lg hover:shadow-accent/20 group">
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
          </button>

          {/* User Profile / Auth */}
          {mounted && (
            user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-sm border border-accent/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-accent-foreground">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground hidden md:block max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 md:p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border hover:border-destructive/60 transition-all duration-300 hover:bg-destructive/10 group"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors duration-300" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-2 px-4 py-2 md:py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">Sign In</span>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
