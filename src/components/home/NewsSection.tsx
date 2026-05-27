'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { newsApi } from '@/lib/api'
import type { NewsPost } from '@/lib/types'
import { format } from 'date-fns'

const FALLBACK: Partial<NewsPost>[] = [
  { id: 1, slug: 'tiguan-facelift-2025', category: 'Xe mới', title: 'Volkswagen Tiguan Facelift 2025 chính thức ra mắt tại Việt Nam', excerpt: 'Phiên bản nâng cấp mang đến thiết kế hiện đại hơn cùng loạt công nghệ an toàn tiên tiến.', imageUrl: '/images/news/news1.jpg', createdAt: '2025-03-15T00:00:00' },
  { id: 2, slug: 'teramont-x-platinum', category: 'Sự kiện', title: 'Ra mắt Teramont X Platinum – Đỉnh cao của dòng SUV 7 chỗ', excerpt: 'Teramont X Platinum nâng cấp nội thất, trang bị thêm màn hình panorama và hệ thống âm thanh Dynaudio cao cấp.', imageUrl: '/images/news/news2.jpg', createdAt: '2025-02-20T00:00:00' },
  { id: 3, slug: 'lai-thu-mien-phi', category: 'Khuyến mãi', title: 'Chương trình lái thử miễn phí tháng 4 – Trải nghiệm trước, quyết định sau', excerpt: 'Đăng ký lái thử toàn bộ dòng xe Volkswagen hoàn toàn miễn phí trong tháng 4/2025 tại showroom Sài Gòn.', imageUrl: '/images/news/news3.jpg', createdAt: '2025-01-10T00:00:00' },
]

export default function NewsSection() {
  const [posts, setPosts] = useState<Partial<NewsPost>[]>(FALLBACK)

  useEffect(() => {
    newsApi.getAll().then((res) => { if (res.data.length > 0) setPosts(res.data.slice(0, 3)) }).catch(() => {})
  }, [])

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Cập nhật</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black mt-2 leading-tight">
              Tin tức &amp;
              <br />
              Sự kiện
            </h2>
          </div>
          <Link href="/tin-tuc" className="flex items-center gap-2 text-sm font-semibold text-black hover:gap-3 transition-all uppercase tracking-wide">
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/tin-tuc/${post.slug}`} className="group block bg-white border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <Image
                    src={post.imageUrl || '/images/hero.jpg'}
                    alt={post.title ?? ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black text-white text-xs px-2.5 py-1 uppercase tracking-wide font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  {post.createdAt && (
                    <p className="text-xs text-neutral-400 mb-2">
                      {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                    </p>
                  )}
                  <h3 className="font-bold text-black text-base leading-snug mb-2 line-clamp-2 group-hover:underline underline-offset-2">
                    {post.title}
                  </h3>
                  <p className="text-neutral-500 text-sm line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-black uppercase tracking-wide">
                    Đọc tiếp <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
