'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone } from 'lucide-react'

export default function TestDriveCTA() {
  return (
    <section className="py-24 bg-neutral-950 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 0, transparent 80px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 80px)',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.3em] text-neutral-500 uppercase block mb-4">
              Miễn phí — Không ràng buộc
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Trải nghiệm trước
              <br />
              <span className="text-neutral-400">Quyết định sau</span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Đăng ký lái thử hoàn toàn miễn phí. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong
              vòng 24 giờ.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dang-ky-lai-thu">
                <Button
                  size="lg"
                  className="rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold tracking-wide uppercase text-sm px-12 h-14"
                >
                  Đăng ký lái thử ngay
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <a
                href="tel:0981058232"
                className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors font-medium"
              >
                <Phone size={16} strokeWidth={2.5} />
                098 105 8232
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
