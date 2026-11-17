import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${BACKEND_URL}/api/models/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('not found')
    const model = await res.json()
    const title = model.name
    const description = model.shortDescription || `Khám phá ${model.name} tại Volkswagen Flagship. ${model.engine ? `Động cơ ${model.engine}, ${model.power}.` : ''} ${model.priceEstimated ? 'Giá dự kiến' : 'Giá từ'} ${model.priceDisplay} VNĐ.`
    const imageUrl = `${SITE_URL}/images/models/${slug}.jpg`
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Volkswagen Flagship`,
        description,
        url: `${SITE_URL}/models/${slug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        type: 'website',
      },
      alternates: { canonical: `${SITE_URL}/models/${slug}` },
    }
  } catch {
    return {
      title: 'Chi tiết xe',
      description: 'Khám phá dòng xe Volkswagen chính hãng tại Volkswagen Flagship.',
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
