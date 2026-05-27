'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Nguyễn Văn Minh',
    role: 'Doanh nhân — TP.HCM',
    text: 'Dịch vụ tư vấn rất chuyên nghiệp, không hề gây áp lực. Tôi đã mua Touareg và rất hài lòng với chất lượng xe cũng như dịch vụ hậu mãi.',
  },
  {
    name: 'Trần Thị Lan',
    role: 'Giám đốc Marketing',
    text: 'Tiguan 2024 vượt kỳ vọng của tôi về cả thiết kế lẫn vận hành. Showroom sạch sẽ, nhân viên nhiệt tình và am hiểu sản phẩm.',
  },
  {
    name: 'Phạm Đức Thành',
    role: 'Kiến trúc sư',
    text: 'Teramont X rộng rãi, trang bị đầy đủ cho gia đình 5 thành viên. Quá trình mua xe từ tư vấn đến nhận xe rất trơn tru.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">
            Khách hàng nói gì
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mt-2">
            Sự tin tưởng của bạn
            <br />
            là động lực của chúng tôi
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-8 border border-neutral-200"
            >
              <Quote size={32} className="text-neutral-200 mb-4" />
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">{item.text}</p>
              <div>
                <p className="font-bold text-black text-sm">{item.name}</p>
                <p className="text-neutral-400 text-xs mt-0.5">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
