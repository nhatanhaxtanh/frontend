'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { HandoverPhoto } from '@/lib/types'
import Lightbox from '@/components/Lightbox'
import { ZoomIn } from 'lucide-react'

export default function HandoverGallery({ photos }: { photos: HandoverPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const images = photos.filter(p => p.imageUrl).map(p => p.imageUrl!)

  const open = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)

  if (images.length === 0) {
    return <p className="text-center text-neutral-400 py-20 text-sm">Chưa có hình ảnh nào.</p>
  }

  return (
    <>
      {images.length === 1 ? (
        // Single image — full width
        <GalleryItem src={images[0]} caption={photos[0].caption} onClick={() => open(0)} tall />
      ) : (
        <div className="space-y-3">
          {/* Bento hero: first image large + 2 stacked right */}
          <div className="grid grid-cols-3 gap-3" style={{ gridAutoRows: '240px' }}>
            {/* Featured */}
            <div className="col-span-2 row-span-2">
              <GalleryItem src={images[0]} caption={photos[0].caption} onClick={() => open(0)} fill />
            </div>
            {/* Photos 1–2 on the right */}
            {images[1] && (
              <GalleryItem src={images[1]} caption={photos[1]?.caption} onClick={() => open(1)} fill />
            )}
            {images[2] && (
              <GalleryItem src={images[2]} caption={photos[2]?.caption} onClick={() => open(2)} fill />
            )}
          </div>

          {/* Remaining photos — 3-column grid */}
          {images.length > 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ gridAutoRows: '220px' }}>
              {images.slice(3).map((src, i) => (
                <GalleryItem
                  key={i}
                  src={src}
                  caption={photos[i + 3]?.caption}
                  onClick={() => open(i + 3)}
                  fill
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={close}
            onChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function GalleryItem({
  src,
  caption,
  onClick,
  fill,
  tall,
}: {
  src: string
  caption: string | null | undefined
  onClick: () => void
  fill?: boolean
  tall?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer group bg-neutral-100 border border-neutral-200 ${
        tall ? 'aspect-[16/9]' : fill ? 'h-full' : 'aspect-[4/3]'
      }`}
    >
      <Image
        src={src}
        alt={caption ?? 'Lễ bàn giao xe Volkswagen'}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <ZoomIn
          size={28}
          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow"
        />
      </div>
      {/* Caption on hover */}
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs leading-snug">{caption}</p>
        </div>
      )}
    </div>
  )
}
