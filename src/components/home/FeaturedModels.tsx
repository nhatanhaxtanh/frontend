'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { carModelApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { getModelImage } from '@/lib/model-images'
import { pricePrefix } from '@/lib/price'

const FALLBACK_MODELS: Partial<CarModel>[] = [
  { id: 1, name: 'Tiguan Facelift', slug: 'tiguan-facelift', category: 'SUV', priceDisplay: '1.699.000.000', shortDescription: 'SUV đô thị thông minh với công nghệ tiên tiến' },
  { id: 2, name: 'Teramont USA Limited', slug: 'teramont-usa-limited', category: 'SUV', priceDisplay: '2.299.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Limited cao cấp' },
  { id: 3, name: 'Teramont X Platinum', slug: 'teramont-x-platinum', category: 'SUV', priceDisplay: '2.349.000.000', shortDescription: 'SUV 7 chỗ phiên bản Platinum đỉnh cao' },
  { id: 4, name: 'Touareg Highline', slug: 'touareg-highline', category: 'SUV', priceDisplay: '3.499.000.000', shortDescription: 'SUV flagship tích hợp mọi công nghệ đỉnh cao nhất' },
  { id: 5, name: 'Viloran Luxury', slug: 'viloran-luxury', category: 'MPV', priceDisplay: '2.099.000.000', shortDescription: 'MPV executive sang trọng cho gia đình' },
  { id: 6, name: 'Golf 1.5 eTSI', slug: 'golf-15-etsi', category: 'Hatchback', priceDisplay: '797.000.000', shortDescription: 'Hatchback thể thao, tiết kiệm nhiên liệu' },
]

export default function FeaturedModels() {
  const [models, setModels] = useState<Partial<CarModel>[]>(FALLBACK_MODELS)
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const [perView, setPerView] = useState(3)

  useEffect(() => {
    carModelApi.getFeatured().then((res) => {
      if (res.data.length > 0) setModels(res.data)
    }).catch(() => {})
  }, [])

  // Responsive: số card hiển thị cùng lúc
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1)
      else if (window.innerWidth < 1024) setPerView(2)
      else setPerView(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, models.length - perView)

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex])

  const cardWidthPct = 100 / perView

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Dòng xe</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black mt-2 leading-tight">
              Bộ sưu tập
              <br />
              Volkswagen
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Prev / Next */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={index === 0}
                className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                disabled={index >= maxIndex}
                className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              href="/models"
              className="flex items-center gap-2 text-sm font-semibold text-black hover:gap-3 transition-all uppercase tracking-wide"
            >
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Slider track */}
        <div className="overflow-hidden" ref={trackRef}>
          <motion.div
            className="flex"
            animate={{ x: `-${index * cardWidthPct}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {models.map((model) => (
              <div
                key={model.id}
                className="shrink-0 pr-6"
                style={{ width: `${cardWidthPct}%` }}
              >
                <Link href={`/models/${model.slug}`} className="group block">
                  <div className="overflow-hidden aspect-[4/3] mb-4 relative bg-neutral-100">
                    <Image
                      src={getModelImage(model.slug, model.imageUrl)}
                      alt={model.name ?? ''}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                  <Badge variant="outline" className="text-xs rounded-lg border-neutral-300 text-neutral-500 mb-1">
                    {model.category}
                  </Badge>
                  <h3 className="font-bold text-lg text-black group-hover:underline underline-offset-2">
                    {model.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1 line-clamp-2">{model.shortDescription}</p>
                  <p className="text-black font-semibold mt-3 text-sm">
                    {pricePrefix(model.priceEstimated)} {model.priceDisplay}₫
                  </p>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-1.5 mt-8 justify-center">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="relative h-[3px] transition-all duration-300"
              style={{ width: i === index ? 28 : 12 }}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className="absolute inset-0 bg-neutral-200 rounded-full" />
              {i === index && (
                <motion.span
                  layoutId="model-dot"
                  className="absolute inset-0 bg-black rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
