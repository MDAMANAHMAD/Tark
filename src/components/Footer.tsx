import Link from 'next/link';
import { Terminal, Rss } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-slate-200/40 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md text-slate-600 dark:text-slate-400 transition-colors duration-200 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="group flex items-center gap-2.5 text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-teal-500 bg-clip-text text-transparent w-max">
              <div className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:scale-105 duration-200 transition-transform">
                <Terminal className="w-4.5 h-4.5 text-blue-600 dark:text-blue-500" />
              </div>
              Tark
            </Link>
            <p className="text-sm max-w-sm leading-relaxed text-slate-500 dark:text-slate-400 font-semibold">
              A curated academic portal sharing law school study guides, case summaries, landmark judicial notes, and insights into constitutional and criminal justice law.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-200/50 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-0.5 duration-200">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-200/50 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-0.5 duration-200">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-200/50 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-0.5 duration-200">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="/feed.xml" className="p-2 bg-slate-200/50 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-y-0.5 duration-200">
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home Feed
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Explore Topics
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=constitutional-law" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Constitutional Law
                </Link>
              </li>
              <li>
                <Link href="/?category=criminal-justice" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Criminal Justice
                </Link>
              </li>
              <li>
                <Link href="/?category=corporate-law" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Corporate Law
                </Link>
              </li>
              <li>
                <Link href="/?category=law-school-tips" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Law School Tips
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} Tark Blog. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
