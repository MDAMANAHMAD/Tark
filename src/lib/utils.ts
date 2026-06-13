// Simple utility to merge class names
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

// Convert a string into an SEO-friendly URL slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

// Format a date to a readable format
export function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Calculate reading time of text content based on word count
export function getReadingTime(htmlContent: string): string {
  if (!htmlContent) return '1 min read';
  // Strip HTML tags to get raw text
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 225; // Average adult reading speed
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Truncate long descriptions
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  // Strip HTML tags if any
  const cleanText = text.replace(/<[^>]*>/g, '');
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.slice(0, maxLength).trim() + '...';
}
