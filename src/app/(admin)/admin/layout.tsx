'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  LayoutDashboard, FileText, FolderTree, MessageSquare, 
  Mail, Settings, LogOut, Terminal, Menu, X, ArrowLeft 
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If we are on the login page, bypass rendering the sidebar/header layout decorations
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Blog Posts', href: '/admin/posts', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
    { name: 'Inquiries', href: '/admin/messages', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200 bg-grid-pattern relative overflow-hidden">
      {/* Background blobs for fancy student style */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 dark:bg-indigo-600/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-500/5 dark:bg-pink-650/10 blur-[100px] pointer-events-none z-0" />
      
      {/* Mobile Top Bar */}
      <header className="relative z-10 md:hidden flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2 text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          Tark CMS
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        relative z-20 fixed inset-y-0 left-0 z-40 w-64 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between transform transition-transform duration-300 md:relative md:transform-none md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2 text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-500 animate-pulse" />
            Tark CMS
          </div>

          {/* User info */}
          {session?.user && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Logged in as</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-1">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
            </div>
          )}

          {/* Links list */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          >
            <ArrowLeft className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Administrative Workspace */}
      <main className="relative z-10 flex-grow p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
