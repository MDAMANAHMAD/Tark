import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tark | Legal Insights & Law Student Notebook",
    template: "%s | Tark"
  },
  description: "Read comprehensive law school notes, landmark case briefs, study guides, and critical legal reviews.",
  keywords: ["Law School Notes", "Case Briefs", "Constitutional Law", "Legal Study Guides", "Tark Legal Insights", "Law Student Blog"],
  authors: [{ name: "Tark Law Editorial" }],
  openGraph: {
    title: "Tark Legal Insights",
    description: "Read comprehensive law school notes, landmark case briefs, study guides, and critical legal reviews.",
    url: "https://tark-blog.vercel.app",
    siteName: "Tark",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
