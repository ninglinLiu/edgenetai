'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Send,
  ListTodo,
  Network,
  Server,
  Receipt,
  Settings,
  Trophy,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Submit', href: '/submit', icon: Send },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  {
    name: 'Explorer',
    icon: Network,
    children: [
      { name: 'Overview', href: '/explorer' },
      { name: 'Nodes', href: '/explorer/nodes' },
      { name: 'Receipts', href: '/explorer/receipts' },
      { name: 'Leaderboard', href: '/leaderboard' },
    ],
  },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <div className="w-64 bg-slate-900/50 border-r border-slate-800 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EdgeNet.AI
          </span>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));
            const Icon = item.icon;

            if (item.children) {
              const isExpanded = expanded === item.name;
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : item.name)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <span className={cn('transition-transform', isExpanded && 'rotate-90')}>›</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 rounded-lg text-sm transition-all',
                              isChildActive
                                ? 'text-blue-400 bg-blue-500/10'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                            )}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
