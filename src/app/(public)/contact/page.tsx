'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
          Get in touch with us
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Have an inquiry, feedback, or a topic you would like us to cover? Drop us a message, and our editorial team will get back to you shortly.
        </p>
      </header>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl shadow-lg space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">Email Editorial</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">editorial@tark.com</p>
                </div>
              </div>
 
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">Call Support</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">+1 (555) 019-2834</p>
                </div>
              </div>
 
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 border border-purple-500/25 text-purple-650 dark:text-purple-400 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">Office Location</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">
                    100 Tech Plaza, Suite 400<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/20 shadow-xl text-white space-y-3">
            <h4 className="font-bold text-teal-300">Are you a writer?</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              We are always on the lookup for guest writers and technical authors. Drop us a resume or pitch with your tech experience!
            </p>
          </div>
        </div>
 
        {/* Form panel */}
        <div className="lg:col-span-7 glass-card p-8 rounded-3xl shadow-lg">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Message Sent!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you! Your message has been successfully logged. Our administrative team has been notified and will reply shortly.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] text-white font-bold rounded-xl text-sm transition-all"
                >
                  Return Home
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Send a message
              </h3>
 
              {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-955/20 border border-rose-250 dark:border-rose-800 text-rose-600 dark:text-rose-450 text-sm rounded-xl font-bold">
                  {errorMsg}
                </div>
              )}
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-teal-500/50 focus:border-transparent transition-all shadow-inner"
                  />
                </div>
 
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-teal-500/50 focus:border-transparent transition-all shadow-inner"
                  />
                </div>
              </div>
 
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-teal-500/50 focus:border-transparent transition-all shadow-inner"
                />
              </div>
 
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Message Details
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-teal-500/50 focus:border-transparent transition-all resize-none shadow-inner"
                />
              </div>
 
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:scale-[1.01] active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
