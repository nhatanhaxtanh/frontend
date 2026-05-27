'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Award, Wrench } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'An toàn vượt trội',
    desc: 'Hệ thống an toàn chủ động và bị động tiên tiến, đạt chuẩn đánh giá 5 sao Euro NCAP.',
  },
  {
    icon: Zap,
    title: 'Công nghệ Đức',
    desc: 'Động cơ TSI/TDI tiết kiệm nhiên liệu, hộp số DSG mượt mà, kết hợp hệ thống IQ.DRIVE thông minh.',
  },
  {
    icon: Award,
    title: 'Chính hãng 100%',
    desc: 'Xe nhập khẩu chính hãng, đầy đủ chứng từ, bảo hành chính thức từ Volkswagen Việt Nam.',
  },
  {
    icon: Wrench,
    title: 'Dịch vụ hậu mãi',
    desc: 'Đội ngũ kỹ thuật viên được đào tạo tại Đức, trang thiết bị hiện đại, phụ tùng chính hãng.',
  },
]

export default function WhyVWSection() {
  return (
    <section className="py-24 bg-neutral-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">
            Tại sao chọn chúng tôi
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
            Chất lượng không thỏa hiệp
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-white group-hover:border-white transition-all duration-300">
                <feature.icon
                  size={22}
                  className="text-white group-hover:text-black transition-colors duration-300"
                />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
