'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { NewsPost } from '@/lib/types'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

interface Props {
  post: NewsPost
  related: Partial<NewsPost>[]
}

export default function NewsDetailClient({ post, related }: Props) {
  const readTime = estimateReadTime(post.content || '')

  return (
    <div className="pt-16">
      <div className="relative h-72 md:h-[500px] bg-neutral-900 overflow-hidden">
        <Image src={post.imageUrl || '/images/hero.jpg'} alt={post.title} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white text-black text-xs px-3 py-1 uppercase tracking-widest font-semibold mb-4">{post.category}</span>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">{post.title}</h1>
              <div className="flex items-center gap-5 mt-4 text-neutral-300 text-sm">
                {post.createdAt && (
                  <span className="flex items-center gap-1.5"><Calendar size={13} />{format(new Date(post.createdAt), 'dd/MM/yyyy')}</span>
                )}
                <span className="flex items-center gap-1.5"><Clock size={13} />{readTime} phút đọc</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-white py-14 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={14} /> Tất cả tin tức
              </Link>

              <p className="text-lg text-neutral-600 leading-relaxed border-l-4 border-black pl-5 mb-10 font-medium">{post.excerpt}</p>

              {post.content ? (
                <div
                  className="prose prose-neutral max-w-none
                    prose-headings:font-bold prose-headings:text-black prose-headings:mt-10 prose-headings:mb-4
                    prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-5
                    prose-li:text-neutral-600 prose-li:leading-relaxed
                    prose-strong:text-black
                    prose-a:text-black prose-a:underline prose-a:underline-offset-4
                    prose-ul:my-5 prose-ul:space-y-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-neutral-400 italic">Nội dung đang được cập nhật...</p>
              )}

              <div className="mt-14 pt-8 border-t border-neutral-200 flex items-center justify-between">
                <Link href="/tin-tuc" className="flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4">
                  <ArrowLeft size={14} /> Tin tức khác
                </Link>
                <Link href="/dang-ky-lai-thu">
                  <span className="bg-black text-white text-xs px-6 py-3 uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors cursor-pointer inline-block">
                    Đăng ký lái thử
                  </span>
                </Link>
              </div>
            </motion.article>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-neutral-950 p-6 mb-8">
                  <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase mb-2">Tư vấn miễn phí</p>
                  <p className="text-white font-bold text-lg mb-1">Volkswagen An Phú</p>
                  <a href="tel:0983338527" className="text-neutral-300 text-sm hover:text-white transition-colors block mb-4">098 3338 527</a>
                  <Link href="/dang-ky-lai-thu" className="block w-full bg-white text-black text-xs font-semibold uppercase tracking-widest text-center py-3 hover:bg-neutral-200 transition-colors">
                    Lái thử ngay
                  </Link>
                </div>

                {related.length > 0 && (
                  <div>
                    <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-4">Bài viết liên quan</p>
                    <div className="space-y-5">
                      {related.map((r) => (
                        <Link key={r.id} href={`/tin-tuc/${r.slug}`} className="group flex gap-3">
                          <div className="relative w-20 h-16 shrink-0 overflow-hidden bg-neutral-100">
                            <Image src={r.imageUrl || '/images/hero.jpg'} alt={r.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-400 mb-1">{r.category}</p>
                            <p className="text-sm font-medium text-black line-clamp-2 group-hover:underline underline-offset-2 leading-snug">{r.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link href="/tin-tuc" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-black mt-6 hover:gap-2 transition-all">
                      Xem tất cả <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="lg:hidden bg-neutral-50 py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-6">Bài viết liên quan</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/tin-tuc/${r.slug}`} className="group flex sm:flex-col gap-3">
                  <div className="relative w-20 sm:w-full aspect-video shrink-0 overflow-hidden bg-neutral-200">
                    <Image src={r.imageUrl || '/images/hero.jpg'} alt={r.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 80px, 33vw" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">{r.category}</p>
                    <p className="text-sm font-medium text-black line-clamp-2 group-hover:underline underline-offset-2">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
