import type { Metadata } from 'next'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'
const BASE_URL = 'https://volkswagenanphu.vn'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${BACKEND_URL}/api/models/${slug}`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('not found')
    const model = await res.json()
    const title = model.name
    const description = model.shortDescription || `Khám phá ${model.name} tại Volkswagen An Phú. ${model.engine ? `Động cơ ${model.engine}, ${model.power}.` : ''} Giá từ ${model.priceDisplay} VNĐ.`
    const imageUrl = `${BASE_URL}/images/models/${slug}.jpg`
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Volkswagen An Phú`,
        description,
        url: `${BASE_URL}/models/${slug}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        type: 'website',
      },
      alternates: { canonical: `${BASE_URL}/models/${slug}` },
    }
  } catch {
    return {
      title: 'Chi tiết xe',
      description: 'Khám phá dòng xe Volkswagen chính hãng tại Volkswagen An Phú.',
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
