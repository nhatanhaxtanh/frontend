'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { carModelApi, testDriveApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, X } from 'lucide-react'

const DELAY_MS = 2000
const RESHOW_MS = 30000

const FALLBACK_MODELS = [
  { id: 1,  name: 'Tiguan Facelift' },
  { id: 2,  name: 'Teramont USA Base' },
  { id: 3,  name: 'Teramont USA Limited' },
  { id: 4,  name: 'Teramont President' },
  { id: 5,  name: 'Teramont X Platinum' },
  { id: 6,  name: 'Viloran Premium' },
  { id: 7,  name: 'Viloran Luxury' },
  { id: 8,  name: 'Golf 1.5 eTSI' },
  { id: 9,  name: 'Golf 2.0' },
  { id: 10, name: 'Touareg Elegance' },
  { id: 11, name: 'Touareg R-Line' },
  { id: 12, name: 'Touareg Highline' },
]

export default function TestDrivePopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState(FALLBACK_MODELS)
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', modelId: '', modelName: '' })
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({})
  const reshowTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleStarted = useRef(false)

  // Chỉ trigger lần đầu khi vào trang home, bỏ qua nếu đã từng đăng ký
  useEffect(() => {
    if (pathname !== '/') return
    if (cycleStarted.current) return
    if (localStorage.getItem('td_submitted')) return
    const t = setTimeout(() => {
      setOpen(true)
      cycleStarted.current = true
    }, DELAY_MS)
    return () => clearTimeout(t)
  }, [pathname])

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (reshowTimer.current) clearTimeout(reshowTimer.current)
    }
  }, [])

  useEffect(() => {
    carModelApi
      .getAll()
      .then((res: { data: Partial<CarModel>[] }) => {
        if (res.data.length > 0)
          setModels(res.data.map((m) => ({ id: m.id ?? 0, name: m.name ?? '' })))
      })
      .catch(() => {})
  }, [])

  const dismiss = (reshow = true) => {
    setOpen(false)
    if (reshow) {
      reshowTimer.current = setTimeout(() => setOpen(true), RESHOW_MS)
    }
  }

  const set = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.match(/^[0-9+\s\-]{9,15}$/)) e.phone = 'Số điện thoại không hợp lệ'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await testDriveApi.submit({
        ...form,
        preferredDate: '',
        preferredTime: '',
        notes: '',
      })
      localStorage.setItem('td_submitted', '1')
      if (reshowTimer.current) clearTimeout(reshowTimer.current)
      setSubmitted(true)
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng gọi trực tiếp: 098 105 8232')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) dismiss(true) }}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] sm:max-w-xl p-0 overflow-hidden rounded-2xl gap-0 max-h-[92dvh] overflow-y-auto duration-300 ease-out data-open:slide-in-from-bottom-6 data-closed:slide-out-to-bottom-6"
      >
        {/* Header */}
        <div className="bg-neutral-950 px-8 pt-10 pb-8 relative">
          <button
            onClick={() => dismiss()}
            className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>
          <span className="text-xs tracking-[0.2em] text-neutral-500 uppercase">Hoàn toàn miễn phí</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-2">Đăng ký lái thử</h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Trải nghiệm cảm giác lái xe Volkswagen thực sự. Chuyên viên sẽ liên hệ xác nhận lịch hẹn trong{' '}
            <strong className="text-neutral-200">24 giờ</strong>.
          </p>
        </div>

        {/* Body */}
        <div className="bg-white px-8 py-8">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 size={56} className="mx-auto text-black mb-5" />
              <p className="font-bold text-black text-xl">Đăng ký thành công!</p>
              <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                Chúng tôi đã nhận được yêu cầu lái thử của bạn.<br />
                Chuyên viên sẽ liên hệ xác nhận sớm nhất.
              </p>
              <Button onClick={() => dismiss(false)} className="mt-6 w-full rounded-lg h-12 text-sm uppercase tracking-widest">
                Đóng
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="popup-name" className="text-sm font-medium">Họ và tên *</Label>
                  <Input
                    id="popup-name"
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="rounded-lg h-12 text-base"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popup-phone" className="text-sm font-medium">Số điện thoại *</Label>
                  <Input
                    id="popup-phone"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="0901 234 567"
                    className="rounded-lg h-12 text-base"
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="popup-email" className="text-sm font-medium">
                  Email <span className="text-neutral-400 font-normal">(để nhận xác nhận)</span>
                </Label>
                <Input
                  id="popup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="example@gmail.com"
                  className="rounded-lg h-12 text-base"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Dòng xe quan tâm</Label>
                <Select
                  value={form.modelId}
                  onValueChange={(val) => {
                    const id = val ?? ''
                    const name = models.find((m) => String(m.id) === id)?.name ?? ''
                    setForm((prev) => ({ ...prev, modelId: id, modelName: name }))
                  }}
                >
                  <SelectTrigger className="rounded-lg h-12 text-base">
                    <SelectValue placeholder="Chọn dòng xe (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg h-12 uppercase tracking-widest font-semibold text-sm mt-1"
              >
                {loading ? 'Đang gửi...' : 'Đăng ký ngay'}
              </Button>

              <button
                type="button"
                onClick={() => dismiss()}
                className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Không, cảm ơn
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
