'use client'

import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Nguyễn Văn Minh',
    role: 'Doanh nhân — TP.HCM',
    initials: 'NM',
    text: 'Dịch vụ tư vấn rất chuyên nghiệp, không hề gây áp lực. Tôi đã mua Touareg và rất hài lòng với chất lượng xe cũng như dịch vụ hậu mãi.',
  },
  {
    name: 'Trần Thị Lan',
    role: 'Giám đốc Marketing',
    initials: 'TL',
    text: 'Tiguan 2024 vượt kỳ vọng của tôi về cả thiết kế lẫn vận hành. Showroom sạch sẽ, nhân viên nhiệt tình và am hiểu sản phẩm.',
  },
  {
    name: 'Phạm Đức Thành',
    role: 'Kiến trúc sư',
    initials: 'PT',
    text: 'Teramont X rộng rãi, trang bị đầy đủ cho gia đình 5 thành viên. Quá trình mua xe từ tư vấn đến nhận xe rất trơn tru.',
  },
  {
    name: 'Lê Hoàng Nam',
    role: 'Giám đốc điều hành',
    initials: 'LN',
    text: 'Viloran là lựa chọn hoàn hảo cho những chuyến công tác dài. Nội thất sang trọng, êm ái và đội ngũ chăm sóc sau bán hàng rất tận tâm.',
  },
  {
    name: 'Vũ Thị Hồng',
    role: 'Bác sĩ — Quận 1',
    initials: 'VH',
    text: 'Tôi rất ấn tượng với sự chuyên nghiệp của nhân viên. Xe Tiguan giao đúng hẹn, đầy đủ phụ kiện và được hướng dẫn sử dụng rất chi tiết.',
  },
  {
    name: 'Đỗ Quốc Hùng',
    role: 'Luật sư',
    initials: 'ĐH',
    text: 'Touareg là chiếc xe tôi luôn mơ ước. Showroom Volkswagen An Phú đã giúp tôi hiện thực hóa điều đó với mức giá và dịch vụ tốt nhất.',
  },
  {
    name: 'Nguyễn Thị Mai',
    role: 'Chuyên gia tài chính',
    initials: 'NM',
    text: 'Mua xe lần đầu mà cảm thấy rất thoải mái. Nhân viên giải thích rõ ràng từng gói bảo hiểm và hỗ trợ tài chính, không bị ép mua thêm gì.',
  },
  {
    name: 'Hoàng Minh Tuấn',
    role: 'Kỹ sư — Bình Dương',
    initials: 'HT',
    text: 'Teramont chạy êm và tiết kiệm nhiên liệu hơn tôi nghĩ. Dịch vụ bảo dưỡng tại đây cũng rất nhanh, đặt lịch online tiện lợi.',
  },
  {
    name: 'Bùi Thanh Hà',
    role: 'Nhà thiết kế nội thất',
    initials: 'BH',
    text: 'Một thương hiệu đẳng cấp Đức với dịch vụ đẳng cấp tương xứng. Tôi đặc biệt ấn tượng với không gian showroom sang trọng và đội ngũ am hiểu xe.',
  },
]

const firstCol = testimonials.slice(0, 3)
const secondCol = testimonials.slice(3, 6)
const thirdCol = testimonials.slice(6, 9)

function TestimonialsColumn({
  items,
  duration = 15,
  className,
}: {
  items: typeof testimonials
  duration?: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-4"
      >
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {items.map((t, i) => (
              <div
                key={i}
                className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col gap-4"
              >
                <p className="text-neutral-300 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-neutral-800">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="text-black text-xs font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-neutral-950 py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Khách hàng nói gì</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 leading-tight">
            Sự tin tưởng của bạn
            <br />
            là động lực của chúng tôi
          </h2>
        </motion.div>

        <div className="flex gap-4 h-[560px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
          <TestimonialsColumn items={firstCol} duration={18} className="flex-1" />
          <TestimonialsColumn items={secondCol} duration={14} className="flex-1 hidden md:block" />
          <TestimonialsColumn items={thirdCol} duration={20} className="flex-1 hidden lg:block" />
        </div>
      </div>
    </section>
  )
}
