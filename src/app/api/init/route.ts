import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/user';
import Category from '@/lib/models/category';
import Post from '@/lib/models/post';
import Comment from '@/lib/models/comment';
import ContactMessage from '@/lib/models/message';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    if (force) {
      // Clear out categories, posts, comments, and messages for a fresh legal student start
      await Category.deleteMany({});
      await Post.deleteMany({});
      await Comment.deleteMany({});
      await ContactMessage.deleteMany({});
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

    // Create default categories for demonstration
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

    // Also fetch all current categories to build category-id map
    const allCategories = await Category.find({});
    const catMap = new Map(allCategories.map(c => [c.name, c._id]));

    // Seed default posts if there are no posts or if force=true
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
        },
        {
          title: "Fiduciary Duties in the Age of ESG: Corporate Governance Demystified",
          slug: "fiduciary-duties-esg-corporate-governance",
          content: `<h2>The Shift to Stakeholder Capitalism</h2><p>Historically, corporate boards were bound almost exclusively to shareholder wealth maximization. However, the rise of Environmental, Social, and Governance (ESG) frameworks has sparked intense legal debates concerning the scope of fiduciary duty.</p><p>Under modern corporate law statutes, boards must evaluate whether long-term sustainability risks fall under the duties of care and loyalty, or if pursuing social objectives violates their duties to capital providers.</p>`,
          category: catMap.get('Corporate Law'),
          tags: ['corporate-law', 'esg', 'fiduciary-duty'],
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 74,
          metaTitle: "Corporate Law: Fiduciary Duties & ESG",
          metaDescription: "Analyze the intersection of corporate governance, fiduciary duties, and environmental sustainability frameworks."
        },
        {
          title: "Refugee Protection and the Modern International Human Rights Framework",
          slug: "refugee-protection-international-human-rights",
          content: `<h2>The 1951 Refugee Convention</h2><p>The foundation of international refugee law lies in the principle of <i>non-refoulement</i>—which forbids countries from returning an asylum seeker to a territory where their life or freedom is threatened.</p><p>As geopolitical boundaries shift and environmental migration increases, international courts are forced to re-evaluate whether current legal definitions adequately protect displaced persons who do not fit classical political refugee criteria.</p>`,
          category: catMap.get('Human Rights'),
          tags: ['human-rights', 'refugee-law', 'international-treaty'],
          image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 188,
          metaTitle: "Human Rights & International Refugee Protection",
          metaDescription: "Understand the core principles of non-refoulement and the modern application of the 1951 Convention."
        },
        {
          title: "The Impact of Generative AI on Intellectual Property and Copyright Law",
          slug: "generative-ai-intellectual-property-copyright-law",
          content: `<h2>Fair Use or Systemic Infringement?</h2><p>Generative Artificial Intelligence has introduced unprecedented legal questions regarding copyright ownership. When an AI model is trained on millions of copyrighted works to generate novel text or imagery, does this qualify as "Fair Use"?</p><p>Courts are currently handling critical litigation where authors and artists claim their works are ingested without licensing, creating products that directly compete with human creators. We breakdown the core defenses and statutory factors.</p>`,
          category: catMap.get('Legal Tech'),
          tags: ['legaltech', 'artificial-intelligence', 'copyright-ip'],
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 255,
          metaTitle: "AI & Copyright Law: The Intellectual Property Impact",
          metaDescription: "An in-depth look at generative AI training, fair use arguments, and copyright infringement litigation."
        },
        {
          title: "How to Master Legal Research: Outlining Briefs for Moot Court Trials",
          slug: "master-legal-research-moot-court-outlines",
          content: `<h2>Developing Your Case Theory</h2><p>For any law student, preparing a brief for Moot Court is the closest simulation to appellate advocacy. A strong brief requires thorough legal research, a structured case outline, and a clear presentation of statutory precedents.</p><p>Start by identifying the binding authorities in your jurisdiction and mapping your facts directly to case ratios. Use secondary sources to reinforce arguments where direct precedents are silent.</p>`,
          category: catMap.get('Law School Tips'),
          tags: ['moot-court', 'legal-research', 'writing-briefs'],
          image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 198,
          metaTitle: "Moot Court: Outlining appellate case briefs",
          metaDescription: "Step-by-step guidance on structuring legal briefs, finding binding authorities, and drafting moot court outlines."
        },
        {
          title: "The Legal Mechanics of Smart Contracts: Blockchain Agreements Defined",
          slug: "legal-mechanics-smart-contracts-blockchain-agreements",
          content: `<h2>Are Algorithms Legally Binding?</h2><p>Smart contracts are self-executing computer programs stored on a blockchain that automatically trigger actions when pre-defined conditions are met.</p><p>However, from a contract law perspective, issues arise concerning offer and acceptance, mutual assent, and the capacity of machines to evaluate qualitative terms like "best efforts" or "reasonableness" which form the bedrock of business litigation.</p>`,
          category: catMap.get('Legal Tech'),
          tags: ['blockchain', 'smart-contracts', 'contract-law'],
          image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 110,
          metaTitle: "Blockchain Agreements & Smart Contracts Law",
          metaDescription: "Explore the contract law challenges surrounding self-executing blockchain protocols and code enforcement."
        },
        {
          title: "Understanding Antitrust: Landmark Decisions Shaping Corporate Mergers",
          slug: "understanding-antitrust-corporate-mergers-decisions",
          content: `<h2>The Sherman and Clayton Acts in Context</h2><p>Antitrust regulations exist to protect market competition and prevent monopolistic behavior. In recent years, the FTC and DOJ have significantly strengthened merger guidelines, scrutinizing vertical integration and tech platform acquisitions.</p><p>This case review analyzes historical horizontal mergers and discusses the current market concentration indexes (HHI) utilized by courts to define unlawful anti-competitive behavior.</p>`,
          category: catMap.get('Corporate Law'),
          tags: ['antitrust', 'mergers', 'corporate-merger'],
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 87,
          metaTitle: "Antitrust Law & Corporate Merger Regulation",
          metaDescription: "Analyze the FTC merger review guidelines, HHI index calculations, and landmark Sherman Act cases."
        },
        {
          title: "The First Amendment in Digital Squares: Content Moderation Controversies",
          slug: "first-amendment-digital-squares-content-moderation",
          content: `<h2>Public Forums vs. Private Platforms</h2><p>The First Amendment restricts the government from censoring speech, but does it apply to private social media giants hosting online discourse?</p><p>With landmark cases entering the judiciary, courts are defining whether online platforms operate as "common carriers" or if platform content moderation is protected under their own editorial freedom. We review the free speech frameworks in digital public squares.</p>`,
          category: catMap.get('Constitutional Law'),
          tags: ['constitutional', 'free-speech', 'first-amendment'],
          image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
          status: 'published',
          author: adminUser?._id,
          views: 221,
          metaTitle: "First Amendment & Social Media Moderation",
          metaDescription: "A constitutional law case brief on social media censorship, common carrier arguments, and digital speech rights."
        }
      ];

      const createdPosts = [];
      for (const p of mockPosts) {
        if (p.category) {
          const post = await Post.create(p);
          createdPosts.push(post);
          seededPostsCount++;
        }
      }

      // Seed mock comments on various posts
      if (createdPosts.length >= 3) {
        const mockComments = [
          {
            postId: createdPosts[2]._id, // 1L Exams Tips
            name: "John Doe",
            email: "john@lawstudent.com",
            content: "This was incredibly helpful! The breakdown of the IRAC method made outlines so much clearer. Will start week 8 outlines immediately.",
            status: "approved"
          },
          {
            postId: createdPosts[1]._id, // Digital Evidence
            name: "Jane Smith",
            email: "janesmith@legal.org",
            content: "Fascinating analysis of the Fourth Amendment! The location tracking precedent is a major grey area that will keep appellate courts busy.",
            status: "approved"
          },
          {
            postId: createdPosts[2]._id, // 1L Exams Tips
            name: "Michael Vance",
            email: "mvance@jd.edu",
            content: "Highly recommend practicing under timed conditions. Outline consolidation is useless without active recall!",
            status: "approved"
          },
          {
            postId: createdPosts[4]._id, // Refugee Protection
            name: "Emily Watson",
            email: "emily@rightsinfo.org",
            content: "Refugee rights are indeed facing major enforcement crises globally. Excellent summary of non-refoulement duties.",
            status: "approved"
          },
          {
            postId: createdPosts[5]._id, // Generative AI
            name: "David Miller",
            email: "dmiller@ipattorney.com",
            content: "Is it possible to claim fair use on AI model training weights? Looking forward to the Supreme Court rulings on these copyright cases.",
            status: "approved"
          }
        ];

        for (const c of mockComments) {
          await Comment.create(c);
        }
      }

      // Seed contact inquiries
      const mockMessages = [
        {
          name: "Prof. Sarah Jenkins",
          email: "s.jenkins@lawschool.edu",
          subject: "Guest Speaker Invitation",
          message: "Hello, I read your landmark case briefs on constitutional privacy and would love to invite you to speak at our upcoming Law & Technology symposium this October."
        },
        {
          name: "Michael Vance",
          email: "mvance@jd.edu",
          subject: "Case Outline Contributions",
          message: "Are you accepting student contributions for legal brief outlines? I have highly consolidated notes on Property Law and Torts that could benefit the 1L community."
        },
        {
          name: "Sophia Patel",
          email: "sophia.p@lawjournal.org",
          subject: "Collaboration with Tark Law Journal",
          message: "Greetings, we are interested in cross-publishing some of your Legal Tech smart contracts reviews in our quarterly law review. Please let us know if you are open to discuss."
        },
        {
          name: "Liam Davies",
          email: "liamdavies@tark.com",
          subject: "Appreciation of legal notes",
          message: "Just wanted to say thank you for the moot court outline guide. It helped me structure my arguments for my appellate mock trial yesterday!"
        }
      ];

      for (const m of mockMessages) {
        await ContactMessage.create(m);
      }
    }

    // Fetch final statistics to confirm
    const finalCategories = await Category.find({});

    return NextResponse.json({
      message: force 
        ? 'Database reset and 10 blogs, comments, and inquiries seeded successfully!' 
        : 'Initial seeding validated successfully!',
      admin: adminUser ? {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      } : null,
      seededCategories: finalCategories.map(c => c.name),
      seededPostsCount,
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database: ' + error.message },
      { status: 500 }
    );
  }
}
