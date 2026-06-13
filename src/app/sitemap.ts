import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://tark-blog.vercel.app';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    await dbConnect();
    // Fetch all published posts to map them dynamically
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt');

    const postEntries = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    sitemapEntries.push(...postEntries);
  } catch (error) {
    console.error('Sitemap aggregation error:', error);
  }

  return sitemapEntries;
}
