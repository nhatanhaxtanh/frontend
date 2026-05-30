'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      {/* ── Mobile: 2-column uniform grid ── */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        {images.map((src, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
            <GalleryItem
              src={src}
              caption={photos[i]?.caption}
              onClick={() => open(i)}
              className="aspect-[4/3]"
            />
          </motion.div>
        ))}
      </div>

      {/* ── Desktop: bento layout ── */}
      <div className="hidden sm:block space-y-3">
        {images.length === 1 ? (
          <GalleryItem
            src={images[0]}
            caption={photos[0].caption}
            onClick={() => open(0)}
            className="aspect-[16/9]"
          />
        ) : (
          <>
            {/* Hero row: first image large + 2 stacked right */}
            <div className="grid grid-cols-3 gap-3" style={{ gridAutoRows: '240px' }}>
              <motion.div className="col-span-2 row-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <GalleryItem
                  src={images[0]}
                  caption={photos[0].caption}
                  onClick={() => open(0)}
                  className="h-full"
                />
              </motion.div>
              {images[1] && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <GalleryItem
                    src={images[1]}
                    caption={photos[1]?.caption}
                    onClick={() => open(1)}
                    className="h-full"
                  />
                </motion.div>
              )}
              {images[2] && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <GalleryItem
                    src={images[2]}
                    caption={photos[2]?.caption}
                    onClick={() => open(2)}
                    className="h-full"
                  />
                </motion.div>
              )}
            </div>

            {/* Remaining photos: 3-col grid */}
            {images.length > 3 && (
              <div className="grid grid-cols-3 gap-3" style={{ gridAutoRows: '220px' }}>
                {images.slice(3).map((src, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                    <GalleryItem
                      src={src}
                      caption={photos[i + 3]?.caption}
                      onClick={() => open(i + 3)}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
  className,
}: {
  src: string
  caption: string | null | undefined
  onClick: () => void
  className: string
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer group bg-neutral-100 border border-neutral-200 rounded-3xl ${className}`}
    >
      <Image
        src={src}
        alt={caption ?? 'Lễ bàn giao xe Volkswagen'}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" />
      </div>
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs leading-snug line-clamp-2">{caption}</p>
        </div>
      )}
    </div>
  )
}
