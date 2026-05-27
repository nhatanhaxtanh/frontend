'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { newsApi } from '@/lib/api'
import type { NewsPost } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    newsApi.getBySlug(slug)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="flex items-center gap-2 text-sm underline underline-offset-4">
          <ArrowLeft size={14} /> Quay lại tin tức
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-16">
      {/* Hero image */}
      <div className="relative h-72 md:h-[480px] bg-neutral-900 overflow-hidden">
        <Image
          src={post.imageUrl || '/images/hero.jpg'}
          alt={post.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-8 left-0 right-0 container mx-auto px-6 max-w-4xl">
          <span className="bg-white text-black text-xs px-3 py-1 uppercase tracking-wide font-semibold">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-black mb-8 transition-colors">
              <ArrowLeft size={14} /> Tất cả tin tức
            </Link>

            {post.createdAt && (
              <p className="text-sm text-neutral-400 mb-3">{format(new Date(post.createdAt), 'dd/MM/yyyy')}</p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight mb-6">{post.title}</h1>
            <p className="text-neutral-500 text-lg leading-relaxed border-l-4 border-black pl-5 mb-10">{post.excerpt}</p>

            {post.content ? (
              <div
                className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-neutral-400 italic">Nội dung đang được cập nhật...</p>
            )}
          </motion.div>

          <div className="mt-14 pt-8 border-t border-neutral-200 flex items-center justify-between">
            <Link href="/tin-tuc" className="flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4">
              <ArrowLeft size={14} /> Tin tức khác
            </Link>
            <Link href="/dang-ky-lai-thu">
              <span className="bg-black text-white text-xs px-6 py-3 uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors cursor-pointer">
                Đăng ký lái thử
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
