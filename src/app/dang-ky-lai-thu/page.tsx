'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { carModelApi, testDriveApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2 } from 'lucide-react'

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const FALLBACK_MODELS = [
  { id: 1, name: 'Tiguan 2024' },
  { id: 2, name: 'Teramont 2024' },
  { id: 3, name: 'Teramont X 2024' },
  { id: 4, name: 'Touareg 2024' },
  { id: 5, name: 'Viloran 2024' },
]

interface FormState {
  fullName: string
  phone: string
  email: string
  preferredDate: string
  preferredTime: string
  modelId: string
  notes: string
}

export default function TestDrivePage() {
  const [models, setModels] = useState<{ id: number; name: string }[]>(FALLBACK_MODELS)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [form, setForm] = useState<FormState>({
    fullName: '', phone: '', email: '', preferredDate: '',
    preferredTime: '', modelId: '', notes: '',
  })

  useEffect(() => {
    carModelApi
      .getAll()
      .then((res: { data: Partial<CarModel>[] }) => {
        if (res.data.length > 0) {
          setModels(res.data.map((m) => ({ id: m.id ?? 0, name: m.name ?? '' })))
        }
      })
      .catch(() => {})
  }, [])

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.match(/^[0-9+\s\-]{9,15}$/)) newErrors.phone = 'Số điện thoại không hợp lệ'
    if (!form.preferredDate) newErrors.preferredDate = 'Vui lòng chọn ngày'
    if (!form.preferredTime) newErrors.preferredTime = 'Vui lòng chọn giờ'
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email không hợp lệ'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await testDriveApi.submit(form)
      setSubmitted(true)
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi trực tiếp: 076 4949 837')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle2 size={64} className="mx-auto text-black mb-6" />
          <h2 className="text-3xl font-bold text-black mb-3">Đăng ký thành công!</h2>
          <p className="text-neutral-500 leading-relaxed">
            Chúng tôi đã nhận được yêu cầu lái thử của bạn. Chuyên viên tư vấn sẽ liên hệ xác
            nhận lịch hẹn trong vòng <strong>24 giờ</strong>.
          </p>
          <p className="text-neutral-400 text-sm mt-4">
            Nếu cần hỗ trợ khẩn, vui lòng gọi:{' '}
            <a href="tel:0764949837" className="text-black font-semibold">076 4949 837</a>
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Hoàn toàn miễn phí</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">Đăng ký lái thử</h1>
            <p className="text-neutral-400 text-lg max-w-xl mx-auto">
              Điền thông tin bên dưới, chúng tôi sẽ xác nhận lịch hẹn trong 24 giờ.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Nguyễn Văn A" className="rounded-none" />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input id="phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="0901 234 567" className="rounded-none" />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email (tùy chọn)</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="example@email.com" className="rounded-none" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Dòng xe quan tâm</Label>
              <Select value={form.modelId} onValueChange={(val) => set('modelId', val ?? '')}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Chọn dòng xe (tùy chọn)" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="preferredDate">Ngày lái thử *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={minDateStr}
                  value={form.preferredDate}
                  onChange={(e) => set('preferredDate', e.target.value)}
                  className="rounded-none"
                />
                {errors.preferredDate && <p className="text-red-500 text-xs">{errors.preferredDate}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Giờ mong muốn *</Label>
                <Select value={form.preferredTime} onValueChange={(val) => set('preferredTime', val ?? '')}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.preferredTime && <p className="text-red-500 text-xs">{errors.preferredTime}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Ghi chú thêm</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Yêu cầu đặc biệt, địa điểm lái thử mong muốn..."
                className="rounded-none resize-none"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none h-12 uppercase tracking-widest font-semibold text-sm"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu đăng ký'}
            </Button>

            <p className="text-center text-xs text-neutral-400">
              Hoặc gọi trực tiếp:{' '}
              <a href="tel:0764949837" className="text-black font-semibold">076 4949 837</a>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
