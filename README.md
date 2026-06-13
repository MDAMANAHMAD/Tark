# Tark CMS - Legal Insights & Law Blog Management System

**Tark CMS** is a premium, high-performance Content Management System (CMS) designed specifically for law schools, legal bloggers, case study catalogs, and student briefs. Built on Next.js, it features a visual glassmorphism dashboard, secure administration, and full-featured moderation workflows.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** Next.js (React Server Components, App Router)
*   **Styling & Design System:** TailwindCSS (Custom light-mode pastel mesh gradients, glassmorphism cards, and dark mode support)
*   **Icons:** Lucide React (vector micro-iconography)
*   **Rich Text Editor:** Tiptap Editor (Custom schema integrating headers, lists, code blocks, images, and HTML5 video nodes)
*   **Database:** MongoDB Atlas (NoSQL cloud database)
*   **Database ORM:** Mongoose (object-document mapping)
*   **Authentication:** NextAuth.js (Session security, credentials-based admin validation)
*   **File Uploads:** Local storage upload handlers with fallback integration

---

## 🌟 Implemented Features

### 1. Overview Dashboard
*   **Live Metrics:** Real-time counters showing total articles, total view count, comments log, and category taxonomy.
*   **Interactive SVG Chart:** High-accuracy Views Traffic line-chart representing visitor statistics over the past 7 days, complete with Y-axis/X-axis label alignments and interactive hover tooltips.
*   **Activity Feeds:** Side-by-side previews of recent publications, latest comments awaiting moderation, and recent contact inquiries.
*   **Dashboard Actions:** Centered header bar with matched-height (`h-10`) button controls to refresh metrics or jump into the post editor.

### 2. Articles Catalog & Post Editor
*   **Searchable Index:** Instant-filter catalog showing post titles, categories, views, publishing status (Draft, Published, Scheduled), and created dates.
*   **Tiptap Rich-Text Editor:** A custom editor supporting blocks such as Blockquotes, Lists, Preformatted Code, Images, and embedded media.
*   **Native Video Uploads:** Integrates a Tiptap `VideoExtension` that supports uploading local video files (`video/mp4`, `video/webm`, etc.) and rendering them dynamically within responsive HTML5 `<video>` tags.

### 3. Responsive Comments Moderation
*   **Layout:** Built using a mobile-first, vertical card-based feed layout.
*   **Visibility:** Replaces wide tables with flexible columns and word-wrapping (`break-words` and `whitespace-pre-wrap`) to prevent horizontal/side scrolling.
*   **Actions:** Direct inline actions to Approve, Reject, or Delete comments.

### 4. Categories Management
*   **Taxonomy Controls:** A split-screen layout with a category creation card on the left and a searchable list on the right.
*   **Inline Editing:** Edit category names dynamically with visual saving/cancel states.

### 5. Inquiries Inbox
*   **Client Communication:** Log submissions received from the public Contact page.
*   **Detail Modals:** Clickable rows open modal overlays showing client email metadata, date received, and full message bodies.

### 6. Visual Theme & Contrast Optimization
*   **Pastel Mesh Gradients:** Vibrant, subtle colorful blobs in Indigo, Rose, Teal, and Pink that flow into the background.
*   **High-Contrast Layout:** Soft background color (`#edf1f6`) paired with bright white glass cards (`rgba(255,255,255,0.96)`) and crisp borders (`rgba(148, 163, 184, 0.38)`) to maintain layout structure on all monitors and brightness levels.

---

## ⚙️ Environment Variables Config

Create a `.env.local` file in your root folder and configure the following:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tark?retryWrites=true&w=majority

# NextAuth Authentication Config
NEXTAUTH_SECRET=your-random-generated-secret-key
NEXTAUTH_URL=http://localhost:3000

# Seeding Initial Admin
ADMIN_INITIAL_EMAIL=admin@tark.com
ADMIN_INITIAL_PASSWORD=AdminTark2026!
```

---

## 🚀 Local Setup & Installation

1.  **Clone & Install Dependencies:**
    ```bash
    git clone https://github.com/MDAMANAHMAD/Tark.git
    cd Tark
    npm install
    ```

2.  **Run Dev Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.

3.  **Seed the Database:**
    To seed the database with the default admin account and **10 mock legal blog posts, comments, and inquiries**, open your browser and navigate to:
    ```
    http://localhost:3000/api/init?force=true
    ```

---

## 🌐 Production Deployment

### 1. MongoDB Atlas Setup
1.  Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Enable Network Access from **Anywhere (0.0.0.0/0)**.
3.  Copy your application connection string.

### 2. Vercel Deployment
1.  Import your GitHub repository onto Vercel.
2.  Add your environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`).
3.  Deploy the project.
4.  Once built, navigate to `https://your-domain.vercel.app/api/init?force=true` to initialize the production database.
