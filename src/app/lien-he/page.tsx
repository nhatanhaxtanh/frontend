'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const contactInfo = [
  { icon: MapPin, label: 'Địa chỉ', value: '507C Võ Nguyên Giáp, An Khánh, Thủ Đức, TP.HCM' },
  { icon: Phone, label: 'Điện thoại', value: '098 105 8232', href: 'tel:0981058232' },
  { icon: Mail, label: 'Email', value: 'info@volkswaganphu.vn', href: 'mailto:info@volkswaganphu.vn' },
  { icon: Clock, label: 'Giờ làm việc', value: '8:00 – 18:00, Thứ 2 – Chủ nhật' },
]

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.')
  }

  return (
    <div className="pt-16">
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Liên hệ</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-2">Chúng tôi lắng nghe</h1>
          </motion.div>
        </div>
      </div>

      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-black mb-8">Thông tin liên hệ</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-black font-medium hover:underline">{item.value}</a>
                      ) : (
                        <p className="text-black font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-black mb-8">Gửi tin nhắn</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Họ tên</Label>
                    <Input placeholder="Nguyễn Văn A" className="rounded-none" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Điện thoại</Label>
                    <Input placeholder="0901 234 567" className="rounded-none" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="example@email.com" className="rounded-none" />
                </div>
                <div className="space-y-1.5">
                  <Label>Nội dung</Label>
                  <Textarea placeholder="Nội dung tin nhắn..." className="rounded-none resize-none" rows={5} required />
                </div>
                <Button type="submit" className="w-full rounded-none h-12 uppercase tracking-widest font-semibold text-sm">
                  Gửi tin nhắn
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="w-full h-[450px] border-t border-neutral-200">
        <iframe
          src="https://maps.google.com/maps?q=507C+V%C3%B5+Nguy%C3%AAn+Gi%C3%A1p%2C+An+Kh%C3%A1nh%2C+Th%E1%BB%A7+%C4%90%E1%BB%A9c%2C+TP.HCM&output=embed&hl=vi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Volkswagen An Phú — 507C Võ Nguyên Giáp"
        />
      </div>
    </div>
  )
}
