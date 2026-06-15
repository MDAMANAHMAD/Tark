# 📋 Project Specifications & Quotation Proposal

This document outlines the features built, technology utilized, comparative performance benefits, and the price breakdown for the custom blog and CMS platform.

---

### 1. Built-In Specifications (What is Implemented)

The platform has been built with the following custom feature specifications:

*   **Stationary Sidebar Navigation Layout:** Lock-on-viewport navigation menu sidebar that isolates vertical scrolling to the main dashboard workspace, keeping **"View Website"** and **"Sign Out"** actions statically pinned to the bottom-left on all desktop screens.
*   **Custom Tiptap Video Extension:** Integrates a custom schema extension that maps local uploaded video files (`.mp4`, `.webm`) directly into native HTML5 `<video src="..." controls>` players inside the article body.
*   **Card-Based Comments Moderation Feed:** Replaces wide tables with flexible card layouts featuring auto word-wrapping (`break-words` and `whitespace-pre-wrap`) and instant toggle action buttons to **Approve**, **Reject**, or **Delete** comments.
*   **SVG Views Traffic Analytics Chart:** A custom vector-based 7-day traffic chart that maps visitor statistics coordinates dynamically inside the SVG, featuring aligned benchmark grids, scale labels, and circle node hover tooltips.
*   **High-Contrast Glassmorphism Design:** Core layout style variables configured with soft gray-blue backdrops (`#edf1f6`), semi-opaque white cards (`rgba(255, 255, 255, 0.96)`), and strong borders (`rgba(148, 163, 184, 0.38)`) to maintain visibility on low-contrast screens.
*   **Modal Inquiry Workspace:** A dual-layer inbox that logs submissions from the public contact form and lets the admin click any entry to read full messages, client metadata, and timestamps in focused popup windows.
*   **Dynamic Database Seeder API:** An administrative database initializer route (`/api/init?force=true`) that automatically clears records and seeds **10 mock legal blogs, categories, discussion comments, and contact inquiries** directly into the MongoDB Atlas database.

---

### 2. Technology Stack

*   **Core Framework:** Next.js (Modern React framework for fast page building)
*   **Database:** MongoDB Atlas (Cloud database for secure storage)
*   **Security & Gateways:** NextAuth.js (Secure admin login protection)
*   **Styling Engine:** TailwindCSS & Custom CSS (Pastel mesh gradients & glassmorphism cards)
*   **Content Editor:** Tiptap Editor (Rich-text processing)
*   **Hosting Server:** Vercel (Global cloud hosting platform)

---

### 3. Investment Comparison Matrix (Standard vs. Growth Plan)

The table below compares the two plan options available for the platform setup:

| Investment Type | Option A: Standard Plan (Without Advanced Analytics & SEO) | Option B: Growth Plan (With Advanced Google Analytics & Master SEO) |
| :--- | :--- | :--- |
| **One-Time Setup Cost** | **₹9,999** <br> *(Clean team split of ₹3,333 per person)* | **₹11,499** <br> *(Base ₹9,999 + ₹1,500 Upgrade / Split of ₹3,833 per person)* |
| **Monthly Recurring Cost** | **₹250 / month** <br> *(Cloud maintenance & database backups)* | **₹250 / month** <br> *(Cloud maintenance & database backups)* |
| **Annual Domain Renewal** | **₹1,000 / year** <br> *(GoDaddy standard renewal starting Year 2)* | **₹1,000 / year** <br> *(GoDaddy standard renewal starting Year 2)* |

---

### 4. Setup Cost Breakdown

#### 📦 Option A: Standard Plan (₹9,999)
*   **Custom Frontend Layout & Responsive UI Coding:** ₹6,000
*   **Admin CMS Dashboard (Articles, Comments, Inquiries):** ₹2,000
*   **Serverless Deployment & Database Config:** ₹1,000
*   **Custom Domain Registration (.com for 1 Year):** ₹1,000
*   *Total Setup Investment:* **₹9,999** (Base value of ₹10,000 with discount applied / clean team split of ₹3,333 per person)

#### 🚀 Option B: Growth Plan (₹11,499)
*   **Base Platform Setup (Option A):** ₹9,999
*   **Advanced Google Analytics & SEO Package:** ₹1,500
    *   *Google Analytics 4 (GA4) Integration:* Tracks real-time traffic statistics, live active visitor counts, geolocations, and reading times.
    *   *Google Search Console & Sitemap Submission:* Registers and indexes your blogs on Google search instantly.
    *   *Enhanced Technical SEO:* Customized keyword layouts to boost search visibility.
*   **Total Setup Investment:** **₹11,499** (clean team split of ₹3,833 per person)

#### 🔧 Ongoing Maintenance Details:
*   **Technical Retainer (₹250/month):** Covers continuous serverless network checks on Vercel, monthly MongoDB database backups, image upload pipeline reviews, and automatic SSL security certificate renewals (HTTPS).
*   **Domain Renewal (₹1,000/year):** Standard GoDaddy renewal fee for the custom `.com` address, starting in Year 2.
