import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { NewsPost } from '@/lib/types'
import NewsDetailClient from './NewsDetailClient'

const BACKEND = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : 'http://localhost:8080/api'

const BASE_URL = 'https://volkswagenanphu.vn'

const FALLBACK_POSTS: NewsPost[] = [
  { id: 1, slug: 'tiguan-facelift-2025', category: 'Xe mới', title: 'Volkswagen Tiguan Facelift 2025 chính thức ra mắt tại Việt Nam', excerpt: 'Phiên bản nâng cấp mang đến thiết kế hiện đại hơn cùng loạt công nghệ an toàn tiên tiến.', imageUrl: '/images/news/news1.jpg', createdAt: '2025-03-15T00:00:00', published: true, content: '<p>Nội dung bài viết...</p>' },
  { id: 2, slug: 'teramont-x-platinum', category: 'Sự kiện', title: 'Ra mắt Teramont X Platinum – Đỉnh cao của dòng SUV 7 chỗ', excerpt: 'Teramont X Platinum nâng cấp nội thất, trang bị thêm màn hình panorama và hệ thống âm thanh Dynaudio cao cấp.', imageUrl: '/images/news/news2.jpg', createdAt: '2025-02-20T00:00:00', published: true, content: '<p>Nội dung bài viết...</p>' },
  { id: 3, slug: 'lai-thu-mien-phi', category: 'Khuyến mãi', title: 'Chương trình lái thử miễn phí tháng 4 – Trải nghiệm trước, quyết định sau', excerpt: 'Đăng ký lái thử toàn bộ dòng xe Volkswagen hoàn toàn miễn phí trong tháng 4/2025 tại showroom An Phú.', imageUrl: '/images/news/news3.jpg', createdAt: '2025-01-10T00:00:00', published: true, content: '<p>Nội dung bài viết...</p>' },
]

async function fetchPost(slug: string): Promise<NewsPost | null> {
  try {
    const res = await fetch(`${BACKEND}/news/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null
    return res.json()
  } catch {
    return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null
  }
}

async function fetchRelated(slug: string): Promise<Partial<NewsPost>[]> {
  try {
    const res = await fetch(`${BACKEND}/news`, { next: { revalidate: 3600 } })
    if (!res.ok) return FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, 3)
    const all: NewsPost[] = await res.json()
    return all.filter((p) => p.slug !== slug).slice(0, 3)
  } catch {
    return FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, 3)
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) return { title: 'Tin tức | Volkswagen An Phú' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${BASE_URL}/tin-tuc/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/tin-tuc/${slug}`,
      publishedTime: post.createdAt,
      ...(post.imageUrl ? { images: [{ url: post.imageUrl.startsWith('http') ? post.imageUrl : `${BASE_URL}${post.imageUrl}`, width: 1200, height: 630, alt: post.title }] } : {}),
    },
  }
}

export default async function NewsDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post, related] = await Promise.all([fetchPost(slug), fetchRelated(slug)])
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl?.startsWith('http') ? post.imageUrl : `${BASE_URL}${post.imageUrl}`,
    datePublished: post.createdAt,
    url: `${BASE_URL}/tin-tuc/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Volkswagen An Phú',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo.png` },
    },
    author: { '@type': 'Organization', name: 'Volkswagen An Phú' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsDetailClient post={post} related={related} />
    </>
  )
}
