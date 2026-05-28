'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    video: '/images/vid3.mp4',
    label: 'Volkswagen Touareg 2024',
    heading: 'Flagship SUV.',
    sub: 'Đỉnh cao sang trọng.',
    desc: 'Sức mạnh, công nghệ và thiết kế hội tụ trên một mẫu xe duy nhất.',
  },
  {
    image: '/images/hero.jpg',
    label: 'Đại lý ủy quyền chính thức',
    heading: 'Das Auto.',
    sub: 'Trải nghiệm đẳng cấp.',
    desc: 'Khám phá bộ sưu tập xe Volkswagen chính hãng tại TP. Hồ Chí Minh.',
  },
  {
    image: '/images/hero5.jpg',
    label: 'Volkswagen Tiguan 2024',
    heading: 'Urban Explorer.',
    sub: 'Chinh phục mọi hành trình.',
    desc: 'SUV đô thị thông minh, trang bị công nghệ an toàn tiên tiến.',
  },
  {
    image: '/images/hero6.jpg',
    label: 'Volkswagen Teramont 2024',
    heading: 'Family King.',
    sub: 'Không gian, sức mạnh, đẳng cấp.',
    desc: 'SUV 7 chỗ rộng rãi, hoàn hảo cho gia đình hiện đại.',
  },
]

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

export default function HeroSection() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setIndex(next)
  }, [])

  const prev = () => go((index - 1 + slides.length) % slides.length, -1)
  const next = () => go((index + 1) % slides.length, 1)

  useEffect(() => {
    const id = setInterval(() => go((index + 1) % slides.length, 1), 5000)
    return () => clearInterval(id)
  }, [index, go])

  const slide = slides[index]

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {'video' in slide ? (
            <video
              key={slide.video}
              src={slide.video}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <Image
              src={slide.image}
              alt={slide.heading}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/75 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 max-w-7xl text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <span className="inline-block text-xs tracking-[0.3em] text-neutral-400 uppercase mb-5">
              {slide.label}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none mb-4">
              {slide.heading}
              <br />
              <span className="text-neutral-300">{slide.sub}</span>
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/models">
            <Button size="lg" className="rounded-none bg-white text-black hover:bg-neutral-200 font-semibold tracking-wide uppercase text-sm px-10 h-12">
              Khám phá dòng xe <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/dang-ky-lai-thu">
            <Button size="lg" variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black font-semibold tracking-wide uppercase text-sm px-10 h-12 bg-transparent">
              Đăng ký lái thử
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center border border-white/30 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center border border-white/30 text-white hover:bg-white/20 transition-colors"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > index ? 1 : -1)}
            className="relative h-[3px] transition-all duration-300"
            style={{ width: i === index ? 32 : 16 }}
            aria-label={`Slide ${i + 1}`}
          >
            <span className="absolute inset-0 bg-white/30 rounded-full" />
            {i === index && (
              <motion.span
                layoutId="dot-active"
                className="absolute inset-0 bg-white rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="text-white/40" size={24} />
        </motion.div>
      </motion.div>
    </section>
  )
}
