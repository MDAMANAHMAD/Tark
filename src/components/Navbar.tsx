'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, X, Search, Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener to toggle navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
    setIsOpen(false);
  };

  return (
    <header className={`sticky z-40 transition-all duration-350 ${
      isScrolled 
        ? 'top-0 mt-0 w-full border-b border-slate-200/60 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/98 backdrop-blur-md shadow-md rounded-none' 
        : 'top-4 mt-4 max-w-7xl mx-auto w-[calc(100%-2rem)] md:w-full border border-slate-200/60 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]'
    }`}>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2.5 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-550 via-purple-500 to-teal-400 bg-clip-text text-transparent hover:opacity-95 transition-all">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-blue-500/25 dark:border-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-110 group-hover:rotate-3 duration-300 transition-all">
                <Terminal className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-teal-400 transition-colors" />
              </div>
              Tark
            </Link>
          </div>
 
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2 text-sm font-semibold">
            <Link href="/" className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-teal-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 transition-all">
              Home
            </Link>
            <Link href="/contact" className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-teal-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 transition-all">
              Contact
            </Link>
            {session ? (
              <Link href="/admin" className="px-3.5 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 text-blue-650 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 transition-all border border-blue-100/30 dark:border-blue-900/20">
                Dashboard
              </Link>
            ) : (
              <Link href="/admin/login" className="px-3 py-1.5 rounded-xl text-slate-605 dark:text-slate-305 hover:text-blue-600 dark:hover:text-teal-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 transition-all">
                Admin
              </Link>
            )}
          </nav>
 
          {/* Search, Theme Toggle, Profile */}
          <div className="hidden md:flex items-center space-x-3.5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-48 lg:w-60 pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-teal-500/50 focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-450 dark:text-slate-500 absolute left-3 top-2.5" />
            </form>
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <ThemeToggle />
          </div>
 
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
          </form>
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <Link href="/" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </Link>
            {session ? (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-450 hover:opacity-90">
                Admin Dashboard
              </Link>
            ) : (
              <Link href="/admin/login" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
