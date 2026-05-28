'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Car, CreditCard, Truck, HeadphonesIcon } from 'lucide-react'

const services = [
  {
    icon: Car,
    title: 'Lái thử miễn phí',
    desc: 'Đặt lịch lái thử tại showroom hoặc giao xe đến tận nơi bạn mong muốn.',
    href: '/dang-ky-lai-thu',
    cta: 'Đăng ký ngay',
  },
  {
    icon: CreditCard,
    title: 'Hỗ trợ tài chính',
    desc: 'Vay trả góp đến 85% giá trị xe, lãi suất ưu đãi, thủ tục đơn giản nhanh chóng.',
    href: '/tinh-toan-vay',
    cta: 'Tính toán ngay',
  },
  {
    icon: Truck,
    title: 'Giao xe tận nhà',
    desc: 'Dịch vụ giao xe tận nơi trong nội thành TP.HCM, đảm bảo xe được bảo vệ tuyệt đối.',
    href: '/lien-he',
    cta: 'Liên hệ',
  },
  {
    icon: HeadphonesIcon,
    title: 'Tư vấn chuyên nghiệp',
    desc: 'Đội ngũ tư vấn bán hàng được đào tạo bài bản, sẵn sàng hỗ trợ 7 ngày/tuần.',
    href: '/lien-he',
    cta: 'Liên hệ tư vấn',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Dịch vụ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mt-2">
            Trải nghiệm toàn diện
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 group hover:bg-neutral-950 transition-all duration-300"
            >
              <service.icon
                size={28}
                className="text-black group-hover:text-white transition-colors duration-300 mb-6"
              />
              <h3 className="font-bold text-lg text-black group-hover:text-white transition-colors duration-300 mb-3">
                {service.title}
              </h3>
              <p className="text-neutral-500 group-hover:text-neutral-400 text-sm leading-relaxed mb-6 transition-colors duration-300">
                {service.desc}
              </p>
              <Link
                href={service.href}
                className="text-xs font-semibold tracking-widest uppercase text-black group-hover:text-white border-b border-black group-hover:border-white transition-all duration-300 pb-0.5"
              >
                {service.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
