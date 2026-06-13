import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden bg-grid-pattern">
      {/* Cosmic Neon Aura Backdrop Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 dark:bg-cyan-600/15 blur-[120px] pointer-events-none animate-pulse-slow z-0" style={{ animationDelay: '-6s' }} />
      <div className="absolute top-[30%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-pink-500/5 dark:bg-pink-600/10 blur-[140px] pointer-events-none animate-float z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Suspense fallback={<div className="h-16 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/85 dark:bg-slate-950/85" />}>
          <Navbar />
        </Suspense>
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
