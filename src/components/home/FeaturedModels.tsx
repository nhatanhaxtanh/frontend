'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { carModelApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

const FALLBACK_MODELS: Partial<CarModel>[] = [
  {
    id: 1,
    name: 'Tiguan 2024',
    slug: 'tiguan-2024',
    category: 'SUV',
    priceDisplay: '1.699.000.000',
    shortDescription: 'SUV đô thị thông minh với công nghệ tiên tiến',
  },
  {
    id: 2,
    name: 'Teramont 2024',
    slug: 'teramont-2024',
    category: 'SUV',
    priceDisplay: '2.199.000.000',
    shortDescription: 'SUV 7 chỗ rộng rãi, mạnh mẽ và sang trọng',
  },
  {
    id: 3,
    name: 'Touareg 2024',
    slug: 'touareg-2024',
    category: 'SUV',
    priceDisplay: '2.999.000.000',
    shortDescription: 'SUV flagship đỉnh cao của dòng xe Volkswagen',
  },
  {
    id: 4,
    name: 'Viloran 2024',
    slug: 'viloran-2024',
    category: 'MPV',
    priceDisplay: '1.999.000.000',
    shortDescription: 'MPV sang trọng cho gia đình hiện đại',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function FeaturedModels() {
  const [models, setModels] = useState<Partial<CarModel>[]>(FALLBACK_MODELS)

  useEffect(() => {
    carModelApi
      .getFeatured()
      .then((res) => {
        if (res.data.length > 0) setModels(res.data)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Dòng xe</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black mt-2 leading-tight">
              Bộ sưu tập
              <br />
              Volkswagen 2024
            </h2>
          </div>
          <Link
            href="/models"
            className="flex items-center gap-2 text-sm font-semibold text-black hover:gap-3 transition-all uppercase tracking-wide"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {models.map((model) => (
            <motion.div key={model.id} variants={cardVariants}>
              <Link href={`/models/${model.slug}`} className="group block">
                <div className="overflow-hidden bg-neutral-100 aspect-[4/3] mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-neutral-300 text-6xl font-bold tracking-widest">
                      VW
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant="outline"
                      className="text-xs rounded-none border-neutral-300 text-neutral-500"
                    >
                      {model.category}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-black group-hover:underline underline-offset-2 transition-all">
                    {model.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1 line-clamp-2">
                    {model.shortDescription}
                  </p>
                  <p className="text-black font-semibold mt-3 text-sm">
                    Từ {model.priceDisplay}₫
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
