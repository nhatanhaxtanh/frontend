import type { Metadata } from 'next'
import type { HandoverPhoto } from '@/lib/types'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Nghi Lễ Bàn Giao Xe | Volkswagen An Phú',
  description: 'Những khoảnh khắc đáng nhớ trong nghi lễ bàn giao xe Volkswagen tại đại lý An Phú.',
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
    <main className="min-h-screen bg-neutral-950 pt-16">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center border-b border-neutral-800">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">Volkswagen An Phú</p>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
          Nghi Lễ Bàn Giao Xe
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto text-sm leading-relaxed">
          Mỗi chiếc xe Volkswagen được trao đến tay chủ nhân mới trong một nghi lễ trang trọng —
          khoảnh khắc khởi đầu của những hành trình đáng nhớ.
        </p>
        <div className="mt-8 w-px h-12 bg-gradient-to-b from-neutral-600 to-transparent mx-auto" />
      </section>

      {/* Gallery */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        {photos.length === 0 ? (
          <p className="text-center text-neutral-600 py-20 text-sm">Chưa có hình ảnh nào.</p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid relative overflow-hidden group bg-neutral-900"
              >
                {photo.imageUrl && (
                  <div className="relative">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption ?? 'Nghi lễ bàn giao xe Volkswagen'}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-800 py-20 px-6 text-center">
        <p className="text-neutral-400 text-sm mb-6">
          Trải nghiệm nghi lễ bàn giao đặc biệt khi sở hữu xe Volkswagen tại An Phú
        </p>
        <a
          href="/dang-ky-lai-thu"
          className="inline-block border border-white text-white text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-white hover:text-black transition-colors duration-200"
        >
          Đăng ký lái thử
        </a>
      </section>
    </main>
  )
}
