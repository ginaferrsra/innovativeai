'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  LogOut, Menu, X, Home, FileText, BarChart3, Zap, BookOpen,
  Settings, Shield, MessageSquare, ClipboardList, Scale,
  ChevronLeft, ChevronRight, Bell, Search, Database,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Cases', icon: Home, description: 'Manage legal cases' },
    { href: '/documents', label: 'Documents', icon: FileText, description: 'Upload & process' },
    { href: '/chat', label: 'AI Chat', icon: MessageSquare, description: 'Multi-agent legal AI' },
    { href: '/forms', label: 'Court Forms', icon: ClipboardList, description: 'Templates & intake' },
    { href: '/workflows', label: 'Workflows', icon: Zap, description: 'Automated pipelines' },
    { href: '/analysis', label: 'Analysis', icon: BarChart3, description: 'Charter & strategy' },
    { href: '/reference', label: 'Reference', icon: BookOpen, description: 'Legal library' },
    ...(user?.role === 'admin' || user?.role === 'lawyer' ? [{ href: '/studio', label: 'CMS Studio', icon: Database, description: 'Content management' }] : []),
    ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: Shield, description: 'System management' }] : []),
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-[68px]' : 'w-64',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 border-b border-sidebar-border transition-all duration-300',
          sidebarCollapsed ? 'p-3 justify-center' : 'px-5 py-4',
        )}>
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="font-bold text-sidebar-foreground text-base leading-tight">LexisAI</h1>
              <p className="text-[11px] text-sidebar-accent-foreground leading-tight">Canadian Legal AI</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          'flex-1 py-3 overflow-y-auto',
          sidebarCollapsed ? 'px-2' : 'px-3',
        )}>
          <div className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg transition-all duration-200 group relative',
                      sidebarCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <Icon className={cn('flex-shrink-0 transition-transform duration-200 group-hover:scale-110', sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.label}</p>
                      </div>
                    )}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-border">
                        {item.label}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-2 hidden lg:block">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-sidebar-accent-foreground hover:bg-sidebar-accent/60 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Section */}
        <div className={cn('border-t border-sidebar-border', sidebarCollapsed ? 'p-2' : 'p-3')}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={cn(
                'w-full flex items-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors',
                sidebarCollapsed ? 'p-2 justify-center' : 'gap-3 p-2.5',
              )}>
                <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground flex-shrink-0">
                  {user?.name.charAt(0)}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-medium truncate">{user?.name}</p>
                    <p className="text-[10px] text-sidebar-accent-foreground capitalize truncate">{user?.role}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer text-sm">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer text-sm">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden h-8 w-8"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div>
                <h2 className="text-base font-semibold text-foreground">{currentPage}</h2>
                <p className="text-[11px] text-muted-foreground leading-none">
                  {user?.jurisdiction?.[0] || 'All Jurisdictions'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-lg px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search cases, documents..."
                  className="bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-48"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-background">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
