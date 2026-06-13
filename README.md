# Welcome to Tark CMS! ⚖️

**Tark CMS** is a simple, beautiful, and modern blogging tool designed for legal writers, law students, case study archives, and legal journals. It provides a clean dashboard to write articles, organize topics, and manage messages from your readers.

---

## 🌟 What Can You Do with Tark?

### 📈 The Main Dashboard
*   **Quick Statistics:** Instantly see your total article count, view count, comments, and topics.
*   **Views Graph:** A clean visual chart showing how many people visited your site over the past 7 days.
*   **Activity Previews:** See your latest published articles, new comments, and customer messages right on the home page.

### ✍️ Write & Edit Blog Posts
*   **Easy Writer:** A text editor that works like Microsoft Word or Google Docs. You can easily add headers, bold text, bullet points, and quotes.
*   **Media Uploads:** Add images and upload **video files directly from your computer** into your posts. Videos will play in a responsive, modern video player.

### 💬 Manage Comments (Approve or Reject)
*   **A Clean Feed:** Read comments left by visitors in a neat vertical list. The text wraps automatically, making it easy to read on mobile phones and laptops without side-scrolling.
*   **One-Click Moderation:** Approve comments to show them on your website, reject them, or delete them permanently.

### 📁 Organize with Categories
*   **Topic Folders:** Organize your blogs into topics (like *Constitutional Law*, *Law School Tips*, or *Corporate Law*).
*   **Easy Editing:** Add new categories or rename existing ones with simple inputs.

### ✉️ Read Customer Inquiries
*   **Inbox:** View messages submitted by visitors on your public Contact page.
*   **Message Details:** Click on any message to open a pop-up window showing who sent it, their email address, the date, and the full message.

### 🎨 Clean & Readable Design
*   **High Contrast:** The website uses a soft gray-blue background with crisp white boxes and outlines. This makes text and controls highly visible and easy on the eyes, even on bright screens.
*   **Visual Flair:** Soft pastel color gradients and grid lines give the site a professional, premium feel.

---

## 🚀 How to Run the Website Locally (For Testing)

1.  **Download and Install:**
    Download the project files, open your terminal/command prompt inside the folder, and install the program:
    ```bash
    npm install
    ```

2.  **Start the Server:**
    Run this command to start the website on your computer:
    ```bash
    npm run dev
    ```
    Now, open your web browser and go to: **[http://localhost:3000](http://localhost:3000)**.

3.  **Add 10 Sample Blogs & Comments:**
    To automatically fill the database with a default admin account and **10 sample legal blogs, comments, and messages**, visit this link in your browser:
    ```
    http://localhost:3000/api/init?force=true
    ```

---

## 🌐 Deploying the Website Live

### Step 1: Set Up Your Database
1.  Sign up for a free cloud database on [MongoDB Atlas](https://www.mongodb.com).
2.  Create a cluster and copy your database connection link (URI).

### Step 2: Publish to Vercel
1.  Connect your GitHub repository to a free [Vercel](https://vercel.com) account.
2.  Add your database connection link and admin passwords under **Environment Variables** in Vercel.
3.  Deploy the project.
4.  Once live, visit `https://your-website.vercel.app/api/init?force=true` in your browser to seed your live database.
