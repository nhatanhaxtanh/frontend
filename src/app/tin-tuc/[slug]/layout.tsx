import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${BACKEND_URL}/api/news/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('not found')
    const post = await res.json()
    const title = post.title
    const description = post.excerpt || title
    const imageUrl = post.imageUrl?.startsWith('http') ? post.imageUrl : `${SITE_URL}${post.imageUrl}`
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Volkswagen An Phú`,
        description,
        url: `${SITE_URL}/tin-tuc/${slug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        type: 'article',
        publishedTime: post.createdAt,
      },
      alternates: { canonical: `${SITE_URL}/tin-tuc/${slug}` },
    }
  } catch {
    return {
      title: 'Bài viết',
      description: 'Tin tức mới nhất từ Volkswagen An Phú.',
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
