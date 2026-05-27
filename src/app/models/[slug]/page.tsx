'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { carModelApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Fuel, Users, Zap, Settings2 } from 'lucide-react'
import { getModelImage } from '@/lib/model-images'

export default function ModelDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [model, setModel] = useState<CarModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    carModelApi
      .getBySlug(slug)
      .then((res) => setModel(res.data))
      .catch(() => setModel(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!model) {
    return (
      <div className="pt-16 min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Không tìm thấy xe</h1>
        <Link href="/models">
          <Button variant="outline" className="rounded-none">
            <ArrowLeft size={16} className="mr-2" /> Quay lại
          </Button>
        </Link>
      </div>
    )
  }

  const specs = [
    { icon: Zap, label: 'Công suất', value: model.power || 'N/A' },
    { icon: Settings2, label: 'Động cơ', value: model.engine || 'N/A' },
    { icon: Users, label: 'Số chỗ', value: model.seats ? `${model.seats} chỗ` : 'N/A' },
    { icon: Fuel, label: 'Nhiên liệu', value: model.fuelType || 'N/A' },
  ]

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-neutral-950 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <Link href="/models" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Tất cả dòng xe
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <Badge variant="outline" className="rounded-none border-neutral-600 text-neutral-400 mb-4">{model.category}</Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{model.name}</h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">{model.shortDescription}</p>
              <p className="text-3xl font-bold text-white mb-8">Từ {model.priceDisplay}₫</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dang-ky-lai-thu">
                  <Button className="rounded-none bg-white text-black hover:bg-neutral-200 uppercase tracking-wide text-xs font-semibold px-8 h-12">
                    Đăng ký lái thử
                  </Button>
                </Link>
                <Link href="/lien-he">
                  <Button variant="outline" className="rounded-none border-neutral-600 text-white hover:bg-white hover:text-black uppercase tracking-wide text-xs font-semibold px-8 h-12 bg-transparent">
                    Nhận báo giá
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-[16/10] overflow-hidden bg-neutral-900"
            >
              <Image
                src={getModelImage(model.slug, model.imageUrl)}
                alt={model.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-width image banner */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-neutral-900">
        <Image
          src={getModelImage(model.slug, model.imageUrl)}
          alt={`${model.name} exterior`}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute bottom-6 left-8 md:left-16">
          <p className="text-white/60 text-xs tracking-widest uppercase">Volkswagen {model.category}</p>
          <p className="text-white text-2xl font-bold">{model.name}</p>
        </div>
      </div>

      {/* Specs */}
      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 mb-16">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-white px-8 py-10 text-center">
                <spec.icon size={24} className="mx-auto mb-3 text-neutral-400" />
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">{spec.label}</p>
                <p className="text-black font-bold text-lg">{spec.value}</p>
              </div>
            ))}
          </div>

          <Separator className="mb-16" />

          {model.description && (
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-black mb-6">Giới thiệu</h2>
              <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{model.description}</div>
            </div>
          )}

          {/* Transmission & Torque */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {model.transmission && (
              <div className="border border-neutral-200 p-8">
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Hộp số</p>
                <p className="text-xl font-bold text-black">{model.transmission}</p>
              </div>
            )}
            {model.torque && (
              <div className="border border-neutral-200 p-8">
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Mô-men xoắn</p>
                <p className="text-xl font-bold text-black">{model.torque}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-neutral-950 py-20 px-6 text-center">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-3xl font-bold text-white mb-3">Quan tâm đến {model.name}?</h3>
          <p className="text-neutral-400 mb-8">Đặt lịch lái thử miễn phí hoặc liên hệ chuyên viên tư vấn ngay hôm nay.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dang-ky-lai-thu">
              <Button className="rounded-none bg-white text-black hover:bg-neutral-200 uppercase tracking-wide text-xs font-semibold px-10 h-12">
                Lái thử miễn phí
              </Button>
            </Link>
            <a href="tel:0764949837">
              <Button variant="outline" className="rounded-none border-neutral-600 text-white hover:bg-white hover:text-black uppercase tracking-wide text-xs font-semibold px-10 h-12 bg-transparent">
                Gọi ngay: 076 4949 837
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
