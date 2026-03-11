'use client';

import { BarChart3, Users, Zap, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: 'Dashboard',
    href: '#',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: 'Opportunities',
    href: '#',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    label: 'Financial Tools',
    href: '#',
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Community Forum',
    href: '#',
  },
];

export function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className="w-20 md:w-64 bg-gradient-to-b from-sidebar via-sidebar to-sidebar border-r border-sidebar-border flex flex-col items-start">
      {/* Logo/Brand */}
      <div className="w-full px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="hidden md:block text-lg font-bold text-sidebar-foreground bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            Empower
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full px-2 md:px-4 space-y-2">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <button
              onClick={() => setActiveIndex(index)}
              className={`w-full transition-all duration-300 ease-out group relative py-3 px-2 md:px-4 rounded-lg flex items-center md:gap-3 whitespace-nowrap overflow-hidden ${
                activeIndex === index
                  ? 'bg-gradient-to-r from-accent/30 via-primary/20 to-secondary/20 text-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/40'
              }`}
            >
              {/* Glassmorphism background on hover */}
              <div
                className={`absolute inset-0 backdrop-blur-sm rounded-lg transition-opacity duration-300 ${
                  activeIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                }`}
                style={{
                  background:
                    activeIndex === index
                      ? 'rgba(98, 220, 224, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                }}
              />

              {/* Icon */}
              <span className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>

              {/* Label - hidden on mobile */}
              <span className="hidden md:block relative text-sm font-medium">
                {item.label}
              </span>

              {/* Active indicator */}
              {activeIndex === index && (
                <div className="absolute right-0 w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-l-full" />
              )}
            </button>
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="w-full px-2 md:px-4 py-6 border-t border-sidebar-border">
        <div className="hidden md:block text-xs text-sidebar-foreground/60 text-center">
          Community Empowerment
        </div>
        <div className="flex md:hidden justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">CE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
