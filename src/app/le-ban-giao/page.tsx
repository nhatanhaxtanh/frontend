import type { Metadata } from 'next'
import type { HandoverPhoto } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

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
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Volkswagen An Phú</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2">Lễ Bàn Giao</h1>
          <p className="text-neutral-400 mt-4 max-w-xl leading-relaxed">
            Mỗi chiếc xe Volkswagen được trao đến tay chủ nhân mới trong một lễ bàn giao trang trọng —
            khoảnh khắc khởi đầu của những hành trình đáng nhớ.
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {photos.length === 0 ? (
            <p className="text-center text-neutral-400 py-20 text-sm">Chưa có hình ảnh nào.</p>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid mb-4 overflow-hidden group relative bg-neutral-100 border border-neutral-200"
                >
                  {photo.imageUrl && (
                    <>
                      <Image
                        src={photo.imageUrl}
                        alt={photo.caption ?? 'Lễ bàn giao xe Volkswagen'}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-xs">{photo.caption}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-neutral-200 bg-neutral-50 py-16 px-6 text-center">
        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
          Trải nghiệm lễ bàn giao xe đặc biệt khi sở hữu xe Volkswagen tại An Phú
        </p>
        <Link
          href="/dang-ky-lai-thu"
          className="inline-block bg-black text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-neutral-800 transition-colors duration-200 font-semibold"
        >
          Đăng ký lái thử
        </Link>
      </div>
    </div>
  )
}
