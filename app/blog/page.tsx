import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, seoConfigs } from '@/lib/seo';
import { StructuredData, createBlogSchema } from '@/components/structured-data';
import { BlogPageClient } from './page-client';

export const metadata: Metadata = generateSEOMetadata(seoConfigs.blog);

export default function BlogListPage() {
  return (
    <>
      <StructuredData data={createBlogSchema()} />
      <BlogPageClient />
    </>
  );
}
