'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, Mail, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      } else {
        router.refresh(); // Refresh state
        router.push('/admin');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200 bg-grid-pattern">
      {/* Background colorful glow spots */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 dark:bg-cyan-600/15 blur-[120px] pointer-events-none animate-pulse-slow z-0" style={{ animationDelay: '-6s' }} />
      <div className="absolute top-[30%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-pink-500/5 dark:bg-pink-650/10 blur-[140px] pointer-events-none animate-float z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2.5 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-teal-400 bg-clip-text text-transparent hover:opacity-95 transition-all">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-950/40 border border-blue-500/25 dark:border-blue-800/40 rounded-2xl shadow-inner">
            <Terminal className="w-8 h-8 text-blue-650 dark:text-blue-400" />
          </div>
          Tark Admin
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold pt-1">
          Enter credentials to access the CMS dashboard panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-card py-8 px-4 shadow-[0_20px_50px_rgba(99,102,241,0.08)] rounded-3xl sm:px-10 border-t-4 border-t-indigo-500">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            
            {/* Error Message banner */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 p-4 bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-sm rounded-2xl font-medium animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tark.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-600 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-600 absolute left-3.5 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-none"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:via-indigo-700 hover:to-teal-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
