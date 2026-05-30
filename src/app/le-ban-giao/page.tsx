import type { Metadata } from 'next'
import type { HandoverPhoto } from '@/lib/types'
import Link from 'next/link'
import HandoverGallery from './HandoverGallery'
import HandoverHero from './HandoverHero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lễ Bàn Giao Xe | Volkswagen An Phú',
  description: 'Những khoảnh khắc đáng nhớ trong lễ bàn giao xe Volkswagen tại đại lý An Phú TP.HCM.',
  alternates: { canonical: 'https://volkswagenanphu.vn/le-ban-giao' },
  openGraph: {
    title: 'Lễ Bàn Giao Xe | Volkswagen An Phú',
    description: 'Những khoảnh khắc đáng nhớ trong lễ bàn giao xe Volkswagen tại đại lý An Phú.',
    url: 'https://volkswagenanphu.vn/le-ban-giao',
  },
}

const BACKEND = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : 'http://localhost:8080/api'

async function fetchPhotos(): Promise<HandoverPhoto[]> {
  try {
    const res = await fetch(`${BACKEND}/handover-photos`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function HandoverPage() {
  const photos = await fetchPhotos()

  return (
    <div className="pt-16">
      {/* Hero */}
      <HandoverHero />

      {/* Gallery */}
      <div className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <HandoverGallery photos={photos} />
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-neutral-200 bg-neutral-50 py-16 px-6 text-center">
        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
          Trải nghiệm lễ bàn giao xe đặc biệt khi sở hữu xe Volkswagen tại An Phú
        </p>
        <Link
          href="/dang-ky-lai-thu"
          className="inline-block bg-black text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-neutral-800 transition-colors duration-200 font-semibold rounded-lg"
        >
          Đăng ký lái thử
        </Link>
      </div>
    </div>
  )
}
