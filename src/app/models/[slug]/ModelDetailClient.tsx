'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { CarModel, CarPromotion, DescriptionImage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Fuel, Users, Zap, Settings2, Gauge, GitMerge, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import Lightbox from '@/components/Lightbox'
import { getModelImage } from '@/lib/model-images'
import { getModelGallery } from '@/lib/model-gallery'
import { getModelHighlights } from '@/lib/model-highlights'
import { ESTIMATED_PRICE_NOTE, pricePrefix } from '@/lib/price'
import { cn } from '@/lib/utils'

function DescriptionFigure({ image }: { image: DescriptionImage }) {
  return (
    <figure>
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        <Image
          src={image.imageUrl}
          alt={image.caption || ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {image.caption && (
        <figcaption className="text-neutral-400 text-sm mt-2 text-center">{image.caption}</figcaption>
      )}
    </figure>
  )
}

interface Props {
  model: CarModel
  promotion: CarPromotion | null
}

export default function ModelDetailClient({ model, promotion }: Props) {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [sticky, setSticky] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Scroll listener for sticky bar — attached via ref callback to avoid SSR issues
  const attachScroll = (el: HTMLDivElement | null) => {
    if (!el) return
    ;(heroRef as React.MutableRefObject<HTMLDivElement>).current = el
    const onScroll = () => setSticky(window.scrollY > el.offsetHeight - 80)
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  const mainImage = getModelImage(model.slug, model.imageUrl)
  const gallery: string[] = model.images?.length
    ? model.images
    : getModelGallery(model.slug, mainImage)

  const highlights = getModelHighlights(model.slug, model.highlights)

  const paragraphs = (model.description ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const descriptionImages = (model.descriptionImages ?? []).filter((img) => img?.imageUrl)

  const specs = [
    { icon: Zap, label: 'Công suất', value: model.power || '—' },
    { icon: Gauge, label: 'Mô-men xoắn', value: model.torque || '—' },
    { icon: Settings2, label: 'Động cơ', value: model.engine || '—' },
    { icon: GitMerge, label: 'Hộp số', value: model.transmission || '—' },
    { icon: Users, label: 'Số chỗ', value: model.seats ? `${model.seats} chỗ` : '—' },
    { icon: Fuel, label: 'Nhiên liệu', value: model.fuelType || '—' },
  ]

  return (
    <div className="pt-16">
      {/* Sticky bar */}
      <AnimatePresence>
        {sticky && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-neutral-200 shadow-sm"
          >
            <div className="container mx-auto px-6 max-w-7xl h-14 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/models" className="text-neutral-400 hover:text-black transition-colors">
                  <ArrowLeft size={16} />
                </Link>
                <span className="font-bold text-black">{model.name}</span>
                <span className="text-neutral-400 text-sm hidden md:block">{pricePrefix(model.priceEstimated)} {model.priceDisplay}₫</span>
              </div>
              <div className="flex gap-3">
                <Link href="/lien-he">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs uppercase tracking-wide hidden md:flex">Nhận báo giá</Button>
                </Link>
                <Link href="/dang-ky-lai-thu">
                  <Button size="sm" className="rounded-lg text-xs uppercase tracking-wide">Lái thử</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div ref={attachScroll} className="bg-neutral-950 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <Link href="/models" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-10 transition-colors">
            <ArrowLeft size={14} /> Tất cả dòng xe
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">{model.category}</span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">{model.name}</h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">{model.shortDescription}</p>
              <div className="mb-8">
                {model.priceEstimated && (
                  <span className="inline-block mb-2 px-2.5 py-1 border border-amber-400/40 bg-amber-400/10 text-amber-300 text-[11px] uppercase tracking-widest font-semibold">
                    Giá dự kiến
                  </span>
                )}
                <p className="text-2xl font-bold text-white">
                  {pricePrefix(model.priceEstimated)} <span className="text-3xl">{model.priceDisplay}</span>₫
                </p>
                {model.priceEstimated && (
                  <p className="text-neutral-500 text-xs mt-2 max-w-md leading-relaxed">{ESTIMATED_PRICE_NOTE}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dang-ky-lai-thu">
                  <Button className="rounded-lg bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs font-semibold px-8 h-12 w-full sm:w-auto">
                    Đăng ký lái thử
                  </Button>
                </Link>
                <Link href="/lien-he">
                  <Button variant="outline" className="rounded-lg border-neutral-700 text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs font-semibold px-8 h-12 bg-transparent w-full sm:w-auto">
                    Nhận báo giá
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer group"
              onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}
            >
              <Image src={mainImage} alt={model.name} fill priority className="object-cover object-center group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-white px-4 py-2">Xem ảnh</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick specs bar */}
      <div className="bg-black">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-neutral-800">
            {specs.map((s) => (
              <div key={s.label} className="px-6 py-5 text-center">
                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-white font-bold text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-neutral-100 py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-black">Hình ảnh <span className="text-neutral-400 font-normal text-base">({galleryIndex + 1}/{gallery.length})</span></h2>
            <div className="flex gap-2">
              <button onClick={() => setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length)} className="w-9 h-9 border border-neutral-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setGalleryIndex((i) => (i + 1) % gallery.length)} className="w-9 h-9 border border-neutral-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden cursor-pointer group bg-neutral-200 mb-3" onClick={() => { setLightboxIndex(galleryIndex); setLightboxOpen(true) }}>
            <Image key={gallery[galleryIndex]} src={gallery[galleryIndex]} alt={`${model.name} ${galleryIndex + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="100vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <span className="text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-white px-4 py-2">Xem lớn</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.map((img, i) => (
              <button key={i} onClick={() => setGalleryIndex(i)} className={cn('relative shrink-0 w-20 h-14 overflow-hidden transition-all', galleryIndex === i ? 'ring-2 ring-black' : 'opacity-50 hover:opacity-100')}>
                <Image src={img} alt={`${model.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Điểm nổi bật</span>
              <h2 className="text-4xl font-bold text-black mt-2 mb-10">Tại sao chọn<br />{model.name}?</h2>
              <div className="space-y-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0 text-xs font-bold">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <p className="font-bold text-black mb-1">{h.title}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              <Image src={mainImage} alt={model.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full specs table */}
      <div className="bg-neutral-50 py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-black mb-10">Thông số kỹ thuật</h2>
            <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
              {[
                { label: 'Động cơ', value: model.engine },
                { label: 'Công suất tối đa', value: model.power },
                { label: 'Mô-men xoắn', value: model.torque },
                { label: 'Hộp số', value: model.transmission },
                { label: 'Nhiên liệu', value: model.fuelType },
                { label: 'Số chỗ ngồi', value: model.seats ? `${model.seats} chỗ` : null },
                { label: 'Phân khúc', value: model.category },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="grid grid-cols-2 px-6 py-4">
                  <span className="text-neutral-500 text-sm">{row.label}</span>
                  <span className="text-black font-medium text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Description — ảnh chèn xen giữa các đoạn văn, ảnh dư dồn xuống cuối */}
      {(model.description || descriptionImages.length > 0) && (
        <div className="bg-white py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-black mb-6">Giới thiệu</h2>
            <div className="text-neutral-600 leading-relaxed text-base space-y-6">
              {paragraphs.map((paragraph, i) => (
                <div key={i} className="space-y-6">
                  <p className="whitespace-pre-wrap">{paragraph}</p>
                  {descriptionImages[i] && <DescriptionFigure image={descriptionImages[i]} />}
                </div>
              ))}
              {descriptionImages.slice(paragraphs.length).map((image, i) => (
                <DescriptionFigure key={`extra-${i}`} image={image} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Promotion */}
      {promotion && (
        <div className="relative bg-neutral-950 py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.04)_0%,_transparent_60%)]" />
          <div className="relative container mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs text-white/80 uppercase tracking-[0.2em] font-medium">Ưu đãi có hạn</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{promotion.title}</h2>
                {promotion.description && (
                  <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">{promotion.description}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {promotion.items?.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex items-start gap-3 bg-white/5 border border-white/10 px-4 py-3.5 hover:bg-white/10 transition-colors">
                      <CheckCircle2 size={17} className="text-white shrink-0 mt-0.5" />
                      <span className="text-neutral-200 text-sm leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
                {promotion.validUntil && (
                  <div className="flex items-center gap-2 mt-6 text-neutral-500 text-xs">
                    <Clock size={13} />
                    <span>Chương trình có hiệu lực đến <strong className="text-neutral-300">{promotion.validUntil}</strong></span>
                  </div>
                )}
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white p-8">
                  <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-1">Nhận ưu đãi ngay</p>
                  <h3 className="text-xl font-bold text-black mb-2">Đăng ký lái thử miễn phí</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                    Chuyên viên sẽ liên hệ xác nhận trong <strong className="text-black">24 giờ</strong>. Hoàn toàn miễn phí, không ràng buộc.
                  </p>
                  <div className="space-y-2 mb-6 pb-6 border-b border-neutral-100">
                    {(promotion.items ?? []).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-black shrink-0 mt-0.5" />
                        <span className="text-neutral-600 text-xs leading-relaxed">{item}</span>
                      </div>
                    ))}
                    {(promotion.items?.length ?? 0) > 3 && (
                      <p className="text-xs text-neutral-400 pl-5">+{(promotion.items?.length ?? 0) - 3} ưu đãi khác</p>
                    )}
                  </div>
                  <Link href="/dang-ky-lai-thu" className="block">
                    <Button className="w-full rounded-lg h-12 bg-black text-white hover:bg-neutral-800 uppercase tracking-widest text-xs font-bold">
                      Đăng ký nhận ưu đãi →
                    </Button>
                  </Link>
                  <div className="mt-4 text-center">
                    <p className="text-neutral-400 text-xs mb-2">Hoặc gọi trực tiếp</p>
                    <a href="tel:0983338527" className="text-black font-bold text-lg tracking-wide hover:text-neutral-700 transition-colors">
                      098 3338 527
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Video */}
      {model.videoUrl && (
        <div className="bg-black py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-white mb-8">Video</h2>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${model.videoUrl}`}
                title={model.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Bước tiếp theo</span>
              <h3 className="text-4xl font-bold text-white mt-2 mb-4">Quan tâm đến<br />{model.name}?</h3>
              <p className="text-neutral-400 leading-relaxed">Đặt lịch lái thử miễn phí hoặc liên hệ chuyên viên tư vấn để nhận báo giá tốt nhất và các chương trình ưu đãi hiện hành.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link href="/dang-ky-lai-thu">
                <Button className="rounded-lg bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs font-semibold px-10 h-12 w-full sm:w-auto">
                  Lái thử miễn phí
                </Button>
              </Link>
              <a href="tel:0983338527" className="w-full sm:w-auto">
                <Button variant="outline" className="rounded-lg border-neutral-700 text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs font-semibold px-10 h-12 bg-transparent w-full">
                  <span className="mr-2">Gọi ngay</span> 098 3338 527
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={gallery}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
