'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import axios from 'axios'

const contactInfo = [
  { icon: MapPin, label: 'Địa chỉ', value: '5 Đường Số 2, An Khánh, Thủ Đức, TP.HCM' },
  { icon: Phone, label: 'Điện thoại', value: '098 3338 527', href: 'tel:0983338527' },
  { icon: Mail, label: 'Email', value: 'qui.maiphu@vwanphu.vn', href: 'mailto:qui.maiphu@vwanphu.vn' },
  { icon: Clock, label: 'Giờ làm việc', value: '8:00 – 20:00, Thứ 2 – Chủ nhật' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/contact', form)
      toast.success('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.')
      setForm({ fullName: '', phone: '', email: '', message: '' })
    } catch {
      toast.error('Gửi tin nhắn thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp qua điện thoại.')
    } finally {
      setLoading(false)
    }
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
                    <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Văn A" className="rounded-lg" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Điện thoại</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0901 234 567" className="rounded-lg" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" className="rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label>Nội dung</Label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Nội dung tin nhắn..." className="rounded-lg resize-none" rows={5} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-lg h-12 uppercase tracking-widest font-semibold text-sm">
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="w-full h-[450px] border-t border-neutral-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981!2d106.7526711!3d10.8088033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527956ba0b2ab%3A0x5ff339e4ae3e781a!2sVolkswagen%20An%20Ph%C3%BA%20(Flagship)!5e0!3m2!1svi!2svn!4v1749520000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Volkswagen An Phú — 5 Đường Số 2, An Khánh"
        />
      </div>
    </div>
  )
}
