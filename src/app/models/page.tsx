'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { carModelApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { getModelImage } from '@/lib/model-images'

const FALLBACK: Partial<CarModel>[] = [
  { id: 1, name: 'Tiguan 2024', slug: 'tiguan-2024', category: 'SUV', priceDisplay: '1.699.000.000', shortDescription: 'SUV đô thị thông minh', seats: 5 },
  { id: 2, name: 'Teramont 2024', slug: 'teramont-2024', category: 'SUV', priceDisplay: '2.199.000.000', shortDescription: 'SUV 7 chỗ rộng rãi', seats: 7 },
  { id: 3, name: 'Teramont X 2024', slug: 'teramont-x-2024', category: 'SUV', priceDisplay: '2.349.000.000', shortDescription: 'SUV 7 chỗ phiên bản Platinum', seats: 7 },
  { id: 4, name: 'Touareg 2024', slug: 'touareg-2024', category: 'SUV', priceDisplay: '2.999.000.000', shortDescription: 'SUV flagship đỉnh cao', seats: 5 },
  { id: 5, name: 'Viloran 2024', slug: 'viloran-2024', category: 'MPV', priceDisplay: '1.999.000.000', shortDescription: 'MPV sang trọng cho gia đình', seats: 7 },
]

const CATEGORIES = ['Tất cả', 'SUV', 'MPV', 'Sedan']

export default function ModelsPage() {
  const [models, setModels] = useState<Partial<CarModel>[]>(FALLBACK)
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  useEffect(() => {
    carModelApi.getAll().then((res) => { if (res.data.length > 0) setModels(res.data) }).catch(() => {})
  }, [])

  const filtered = activeCategory === 'Tất cả' ? models : models.filter((m) => m.category === activeCategory)

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Dòng xe Volkswagen</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-2">Khám phá bộ sưu tập</h1>
          </motion.div>
        </div>
      </div>

      {/* Filter */}
      <div className="border-b border-neutral-200 bg-white sticky top-16 z-30">
        <div className="container mx-auto px-6 max-w-7xl flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-xs font-semibold tracking-widest uppercase px-5 py-2 transition-all border ${
                activeCategory === cat ? 'bg-black text-white border-black' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={`/models/${model.slug}`} className="group block">
                  <div className="bg-neutral-100 aspect-[16/10] overflow-hidden mb-5 relative">
                    <Image
                      src={getModelImage(model.slug, model.imageUrl)}
                      alt={model.name ?? ''}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="rounded-none text-xs bg-white/90 border-neutral-300">{model.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-black mb-1 group-hover:underline underline-offset-4">{model.name}</h3>
                      <p className="text-neutral-500 text-sm">{model.shortDescription}</p>
                      {model.seats && <p className="text-neutral-400 text-xs mt-1">{model.seats} chỗ ngồi</p>}
                    </div>
                    <ArrowRight size={18} className="text-neutral-300 group-hover:text-black group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-black font-bold">Từ {model.priceDisplay}₫</span>
                    <span className="text-xs text-neutral-400 uppercase tracking-wide">Xem chi tiết</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-neutral-400">
              <p>Không có xe trong danh mục này.</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 bg-neutral-950 p-12 text-center"
          >
            <h3 className="text-white text-2xl font-bold mb-3">Chưa tìm được xe phù hợp?</h3>
            <p className="text-neutral-400 text-sm mb-6">Liên hệ đội ngũ tư vấn để được hỗ trợ chọn xe phù hợp nhất với nhu cầu của bạn.</p>
            <Link href="/lien-he">
              <Button className="rounded-none bg-white text-black hover:bg-neutral-200 uppercase tracking-wide text-xs font-semibold px-8">
                Tư vấn ngay
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
