'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { NewsPost } from '@/lib/types'
import { ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = ['Tất cả', 'Xe mới', 'Sự kiện', 'Khuyến mãi', 'Tin tức']

export default function NewsClient({ posts }: { posts: Partial<NewsPost>[] }) {
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const filtered = activeCategory === 'Tất cả' ? posts : posts.filter((p) => p.category === activeCategory)

  return (
    <div className="pt-16">
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Cập nhật</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-2">Tin tức &amp; Sự kiện</h1>
          </motion.div>
        </div>
      </div>

      <div className="border-b border-neutral-200 bg-white sticky top-16 z-30">
        <div className="container mx-auto px-6 max-w-7xl flex items-center gap-2 overflow-x-auto py-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-xs font-semibold tracking-widest uppercase px-5 py-2 border transition-all ${
                activeCategory === cat ? 'bg-black text-white border-black' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {filtered[0] && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
              <Link href={`/tin-tuc/${filtered[0].slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-100">
                  <Image src={filtered[0].imageUrl || '/images/hero.jpg'} alt={filtered[0].title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-xs px-3 py-1 uppercase tracking-wide font-medium">{filtered[0].category}</span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <p className="text-xs text-neutral-400 mb-3">{filtered[0].createdAt && format(new Date(filtered[0].createdAt), 'dd/MM/yyyy')}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight mb-4 group-hover:underline underline-offset-4">{filtered[0].title}</h2>
                  <p className="text-neutral-500 leading-relaxed mb-6">{filtered[0].excerpt}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">Đọc tiếp <ArrowRight size={14} /></div>
                </div>
              </Link>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.slice(1).map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Link href={`/tin-tuc/${post.slug}`} className="group block border border-neutral-200 hover:shadow-md transition-shadow">
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    <Image src={post.imageUrl || '/images/hero.jpg'} alt={post.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-black text-white text-xs px-2.5 py-1 uppercase tracking-wide">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-neutral-400 mb-2">{post.createdAt && format(new Date(post.createdAt), 'dd/MM/yyyy')}</p>
                    <h2 className="font-bold text-black leading-snug mb-2 line-clamp-2 group-hover:underline underline-offset-2">{post.title}</h2>
                    <p className="text-neutral-500 text-sm line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wide text-black">Đọc tiếp <ArrowRight size={12} /></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-neutral-400">Không có bài viết nào.</div>
          )}
        </div>
      </div>
    </div>
  )
}
