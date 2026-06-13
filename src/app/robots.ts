import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Retrieve public host URL or default to fallback
  const siteUrl = process.env.NEXTAUTH_URL || 'https://tark-blog.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
