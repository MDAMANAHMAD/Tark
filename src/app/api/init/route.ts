import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/user';
import Category from '@/lib/models/category';
import Post from '@/lib/models/post';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      // Clear out categories and posts for a fresh legal student start
      await Category.deleteMany({});
      await Post.deleteMany({});
    }

    // Check if an admin account already exists
    let adminExists = await User.findOne({ role: 'admin' });
    const email = process.env.ADMIN_INITIAL_EMAIL || 'admin@tark.com';
    const password = process.env.ADMIN_INITIAL_PASSWORD || 'AdminTark2026!';
    
    let adminUser = adminExists;

    if (!adminExists) {
      // Hash the password and create the default admin user
      const hashedPassword = await bcrypt.hash(password, 12);
      adminUser = await User.create({
        name: 'Admin User',
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
      });
    }

    // Create default categories for demonstration (always seeded if missing)
    const defaultCategories = ['Constitutional Law', 'Criminal Justice', 'Corporate Law', 'Human Rights', 'Legal Tech', 'Law School Tips'];
    const seededCategories = [];
    
    for (const cat of defaultCategories) {
      const slug = cat.toLowerCase().replace(/\s+/g, '-');
      const existing = await Category.findOne({ slug });
      if (!existing) {
        const newCat = await Category.create({ name: cat, slug });
        seededCategories.push(newCat.name);
      }
    }

    // Also fetch all current categories to build category-id map for post association
    const allCategories = await Category.find({});
    const catMap = new Map(allCategories.map(c => [c.name, c._id]));

    // Seed default posts if there are no posts in the database or if force=true
    const postCount = await Post.countDocuments({});
    let seededPostsCount = 0;
    if (postCount === 0 || force) {
      const mockPosts = [
        {
          title: "Landmark Case Study: Analyzing the Foundations of Constitutional Privacy",
          slug: "constitutional-privacy-landmark-case-study",
          content: `<h2>The Right to Privacy in Judicial History</h2><p>The concept of constitutional privacy has evolved significantly from early common law principles to landmark supreme court decisions. Unlike other rights, privacy is not explicitly mentioned in the text of the Constitution, but is implied through the "penumbras" of the Bill of Rights.</p><blockquote>"The right to be let alone is the most comprehensive of rights and the right most valued by civilized men." — Justice Louis Brandeis</blockquote><p>In this analytical breakdown, we examine how the Fourth Amendment protection against unreasonable searches, the Fourteenth Amendment Due Process clause, and individual liberty interests intersect to form the modern framework of privacy law.</p>`,
          category: catMap.get('Constitutional Law'),
          tags: ['constitutional', 'privacy-rights', 'court-brief'],
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 142,
          metaTitle: "Landmark Case Study: Constitutional Privacy",
          metaDescription: "An analytical breakdown of constitutional privacy rights, Supreme Court precedents, and liberty interests."
        },
        {
          title: "The Evolution of Digital Evidence in Modern Criminal Justice",
          slug: "digital-evidence-criminal-justice-evolution",
          content: `<h2>Forensics and the Digital Frontier</h2><p>In the 21st century, criminal investigators increasingly rely on electronic footprints rather than physical evidence. Cell phone tower logs, location metadata, social media posts, and encrypted messaging platforms have transformed the collection of proof in felony trials.</p><p>However, this transition presents complex legal challenges regarding surveillance, search warrants, and the Fourth Amendment expectations of privacy in one's digital life.</p>`,
          category: catMap.get('Criminal Justice'),
          tags: ['criminal-law', 'digital-evidence', 'forensics'],
          image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 95,
          metaTitle: "Digital Evidence in Criminal Justice",
          metaDescription: "Explore how location metadata, encrypted texts, and digital footprints are used in modern criminal trials."
        },
        {
          title: "10 Essential Study Strategies for Aceing Your 1L Exams",
          slug: "1l-exams-essential-study-strategies",
          content: `<h2>Mastering the IRAC Method</h2><p>Entering law school is a massive shift in academic rigor. To succeed in your first-year (1L) final exams, you need to change how you read, outline, and analyze cases. The most critical tool in your academic arsenal is the IRAC methodology: Issue, Rule, Application, and Conclusion.</p><p>Here are key strategies to maximize your outline effectiveness:</p><ul><li>Start outline consolidation by Week 8.</li><li>Take at least 4 practice exams under timed conditions.</li><li>Form small, focused study groups to argue gray-area scenarios.</li></ul>`,
          category: catMap.get('Law School Tips'),
          tags: ['1l-exams', 'law-school', 'study-brief'],
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 312,
          metaTitle: "1L Law School Exam Study Strategies",
          metaDescription: "A comprehensive guide on outline consolidation, IRAC methods, and study schedules for first-year law students."
        }
      ];

      for (const p of mockPosts) {
        if (p.category) {
          await Post.create(p);
          seededPostsCount++;
        }
      }
    }

    // Also fetch all current categories to display
    const finalCategories = await Category.find({});

    return NextResponse.json({
      message: force 
        ? 'Database reset and legal categories seeded successfully!' 
        : 'Initial seeding validated successfully!',
      admin: adminUser ? {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      } : null,
      seededCategories,
      allCategories: allCategories.map(c => c.name),
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database: ' + error.message },
      { status: 500 }
    );
  }
}
