'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

      {/* Abstract geometric background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-neutral-950" />
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)',
            backgroundSize: '60px 60px',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[800px] h-[800px] rounded-full border border-white/5" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block text-xs tracking-[0.3em] text-neutral-400 uppercase mb-6">
            Đại lý ủy quyền chính thức
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none mb-6"
        >
          Das Auto.
          <br />
          <span className="text-neutral-300">Trải nghiệm đẳng cấp.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Khám phá bộ sưu tập xe Volkswagen chính hãng tại TP. Hồ Chí Minh. Công nghệ Đức,
          thiết kế tinh tế, an toàn vượt trội.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/models">
            <Button
              size="lg"
              className="rounded-none bg-white text-black hover:bg-neutral-200 font-semibold tracking-wide uppercase text-sm px-10 h-12"
            >
              Khám phá dòng xe
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/dang-ky-lai-thu">
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-white text-white hover:bg-white hover:text-black font-semibold tracking-wide uppercase text-sm px-10 h-12 bg-transparent"
            >
              Đăng ký lái thử
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-white/50" size={28} />
        </motion.div>
      </motion.div>
    </section>
  )
}
