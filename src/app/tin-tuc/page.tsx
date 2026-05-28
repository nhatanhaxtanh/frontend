import type { Metadata } from 'next'
import type { NewsPost } from '@/lib/types'
import NewsClient from './NewsClient'

const BACKEND = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : 'http://localhost:8080/api'

export const metadata: Metadata = {
  title: 'Tin tức & Sự kiện Volkswagen mới nhất tại TP.HCM',
  description: 'Cập nhật tin tức Volkswagen mới nhất: ra mắt xe mới, sự kiện, khuyến mãi và chương trình ưu đãi tại Volkswagen An Phú TP.HCM.',
  alternates: { canonical: 'https://volkswagenanphu.vn/tin-tuc' },
  openGraph: {
    title: 'Tin tức & Sự kiện | Volkswagen An Phú',
    description: 'Ra mắt xe mới, sự kiện, khuyến mãi và ưu đãi mới nhất từ Volkswagen An Phú TP.HCM.',
    url: 'https://volkswagenanphu.vn/tin-tuc',
  },
}

const FALLBACK: Partial<NewsPost>[] = [
  { id: 1, slug: 'tiguan-facelift-2025', category: 'Xe mới', title: 'Volkswagen Tiguan Facelift 2025 chính thức ra mắt tại Việt Nam', excerpt: 'Phiên bản nâng cấp mang đến thiết kế hiện đại hơn cùng loạt công nghệ an toàn tiên tiến.', imageUrl: '/images/news/news1.jpg', createdAt: '2025-03-15T00:00:00' },
  { id: 2, slug: 'teramont-x-platinum', category: 'Sự kiện', title: 'Ra mắt Teramont X Platinum – Đỉnh cao của dòng SUV 7 chỗ', excerpt: 'Teramont X Platinum nâng cấp nội thất, trang bị thêm màn hình panorama và hệ thống âm thanh Dynaudio cao cấp.', imageUrl: '/images/news/news2.jpg', createdAt: '2025-02-20T00:00:00' },
  { id: 3, slug: 'lai-thu-mien-phi', category: 'Khuyến mãi', title: 'Chương trình lái thử miễn phí tháng 4 – Trải nghiệm trước, quyết định sau', excerpt: 'Đăng ký lái thử toàn bộ dòng xe Volkswagen hoàn toàn miễn phí trong tháng 4/2025 tại showroom An Phú.', imageUrl: '/images/news/news3.jpg', createdAt: '2025-01-10T00:00:00' },
]

async function fetchPosts(): Promise<Partial<NewsPost>[]> {
  try {
    const res = await fetch(`${BACKEND}/news`, { next: { revalidate: 3600 } })
    if (!res.ok) return FALLBACK
    const data = await res.json()
    return data.length > 0 ? data : FALLBACK
  } catch {
    return FALLBACK
  }
}

export default async function NewsPage() {
  const posts = await fetchPosts()
  return <NewsClient posts={posts} />
}
