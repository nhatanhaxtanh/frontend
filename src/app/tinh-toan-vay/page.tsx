'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { carModelApi } from '@/lib/api'

const FALLBACK_MODELS = [
  { id: 1,  name: 'Tiguan Facelift',      price: 1699000000 },
  { id: 2,  name: 'Teramont USA Base',    price: 1999000000 },
  { id: 3,  name: 'Teramont USA Limited', price: 2299000000 },
  { id: 4,  name: 'Teramont President',   price: 2499000000 },
  { id: 5,  name: 'Teramont X Platinum',  price: 2349000000 },
  { id: 6,  name: 'Viloran Premium',      price: 1799000000 },
  { id: 7,  name: 'Viloran Luxury',       price: 2099000000 },
  { id: 8,  name: 'Golf 1.5 eTSI',        price: 797000000  },
  { id: 9,  name: 'Golf 2.0',             price: 1898000000 },
  { id: 10, name: 'Touareg Elegance',     price: 2899000000 },
  { id: 11, name: 'Touareg R-Line',       price: 2999000000 },
  { id: 12, name: 'Touareg Highline',     price: 3499000000 },
]

const TERMS = [12, 24, 36, 48, 60, 72, 84]

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n))
}

export default function LoanCalculatorPage() {
  const [models, setModels] = useState(FALLBACK_MODELS)
  const [modelId, setModelId] = useState('1')
  const [loanPct, setLoanPct] = useState(70)
  const [term, setTerm] = useState(48)
  const [rate, setRate] = useState('8.5')

  useEffect(() => {
    carModelApi.getAll()
      .then((res) => {
        const data = res.data
          .filter((m) => m.price && m.price > 0)
          .map((m) => ({ id: m.id ?? 0, name: m.name ?? '', price: m.price ?? 0 }))
        if (data.length > 0) setModels(data)
      })
      .catch(() => {})
  }, [])

  const selected = models.find((m) => String(m.id) === modelId) ?? models[0]
  const carPrice = selected?.price ?? 0
  const loanAmount = Math.round(carPrice * loanPct / 100)
  const downPayment = carPrice - loanAmount
  const annualRate = parseFloat(rate) || 0

  const { monthly, total, interest } = useMemo(() => {
    if (!loanAmount || !term || annualRate < 0) return { monthly: 0, total: 0, interest: 0 }
    const r = annualRate / 100 / 12
    const monthly = r === 0
      ? loanAmount / term
      : loanAmount * r * Math.pow(1 + r, term) / (Math.pow(1 + r, term) - 1)
    const total = monthly * term
    return { monthly, total, interest: total - loanAmount }
  }, [loanAmount, term, annualRate])

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-neutral-950 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-8 transition-colors w-fit">
            <ArrowLeft size={14} /> Trang chủ
          </Link>
          <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Hỗ trợ tài chính</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-3 flex items-center gap-4">
            <Calculator size={36} className="text-neutral-500" />
            Tính toán khoản vay
          </h1>
          <p className="text-neutral-400 text-base max-w-xl">
            Ước tính khoản trả góp hàng tháng cho dòng xe bạn quan tâm. Kết quả chỉ mang tính tham khảo — lãi suất thực tế do ngân hàng quyết định.
          </p>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* ── Inputs ── */}
            <div className="lg:col-span-3 space-y-8">

              {/* Dòng xe */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-widest text-neutral-500">Dòng xe</Label>
                <Select value={modelId} onValueChange={(v) => { if (v) setModelId(v) }}>
                  <SelectTrigger className="rounded-none h-12 text-base">
                    <span>{selected?.name ?? 'Chọn dòng xe'}</span>
                  </SelectTrigger>
                  <SelectContent className="min-w-[380px]">
                    {models.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name} — {fmt(m.price)}₫
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-neutral-400">Giá xe: <span className="font-semibold text-black">{fmt(carPrice)}₫</span></p>
              </div>

              {/* % vay */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <Label className="text-sm font-semibold uppercase tracking-widest text-neutral-500">Tỷ lệ vay</Label>
                  <span className="text-2xl font-bold text-black">{loanPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={loanPct}
                  onChange={(e) => setLoanPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-none accent-black cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>0%</span>
                  <span>80%</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-neutral-50 border border-neutral-200 px-4 py-3">
                    <p className="text-xs text-neutral-400 mb-1">Số tiền vay</p>
                    <p className="font-bold text-black">{fmt(loanAmount)}₫</p>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 px-4 py-3">
                    <p className="text-xs text-neutral-400 mb-1">Trả trước ({100 - loanPct}%)</p>
                    <p className="font-bold text-black">{fmt(downPayment)}₫</p>
                  </div>
                </div>
              </div>

              {/* Thời hạn */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold uppercase tracking-widest text-neutral-500">Thời hạn vay</Label>
                <div className="grid grid-cols-7 gap-1.5">
                  {TERMS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTerm(t)}
                      className={`h-11 text-sm font-semibold border transition-all ${
                        term === t
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-black'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-neutral-400">{term} tháng ({(term / 12).toFixed(1).replace('.0', '')} năm)</p>
              </div>

              {/* Lãi suất */}
              <div className="space-y-2">
                <Label htmlFor="rate" className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                  Lãi suất / năm (%)
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="rate"
                    type="number"
                    min={0}
                    max={30}
                    step={0.1}
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="rounded-none h-12 text-base w-36"
                  />
                  <span className="text-neutral-500 text-sm">% / năm</span>
                </div>
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  <Info size={11} /> Lãi suất trung bình thị trường 2024 dao động 7 – 10% / năm
                </p>
              </div>
            </div>

            {/* ── Result card ── */}
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <div className="bg-neutral-950 text-white p-8">
                <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-1">Kết quả ước tính</p>
                <h2 className="text-lg font-bold mb-6">{selected?.name}</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                    <span className="text-neutral-400 text-sm">Trả góp hàng tháng</span>
                    <span className="text-3xl font-bold text-white">
                      {monthly > 0 ? `${fmt(monthly)}₫` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Số tiền vay</span>
                    <span className="text-white font-medium">{fmt(loanAmount)}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Trả trước</span>
                    <span className="text-white font-medium">{fmt(downPayment)}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Thời hạn</span>
                    <span className="text-white font-medium">{term} tháng</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Lãi suất</span>
                    <span className="text-white font-medium">{rate || 0}% / năm</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-4">
                    <span className="text-neutral-400">Tổng tiền lãi</span>
                    <span className="text-white font-medium">{interest > 0 ? `${fmt(interest)}₫` : '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Tổng thanh toán</span>
                    <span className="text-white font-medium">{total > 0 ? `${fmt(total)}₫` : '—'}</span>
                  </div>
                </div>

                <Link href="/dang-ky-lai-thu">
                  <Button className="w-full rounded-none h-12 bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs font-bold mb-3">
                    Đăng ký lái thử
                  </Button>
                </Link>
                <Link href="/lien-he">
                  <Button variant="outline" className="w-full rounded-none h-11 border-white/20 text-white hover:bg-white/10 uppercase tracking-widest text-xs bg-transparent">
                    Tư vấn tài chính
                  </Button>
                </Link>

                <p className="text-neutral-600 text-xs mt-5 leading-relaxed">
                  * Kết quả chỉ mang tính tham khảo. Lãi suất và điều kiện vay thực tế phụ thuộc vào ngân hàng và hồ sơ tín dụng của khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
