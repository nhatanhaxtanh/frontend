'use client'

import { useEffect, useState } from 'react'
import { carModelApi, testDriveApi } from '@/lib/api'
import { Car, ClipboardList, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ models: 0, pending: 0, confirmed: 0, total: 0 })

  useEffect(() => {
    Promise.allSettled([carModelApi.getAll(), testDriveApi.getAll()]).then(([modelsRes, drivesRes]) => {
      const models = modelsRes.status === 'fulfilled' ? modelsRes.value.data.length : 0
      const drives = drivesRes.status === 'fulfilled' ? drivesRes.value.data : []
      setStats({
        models,
        pending: drives.filter((d) => d.status === 'PENDING').length,
        confirmed: drives.filter((d) => d.status === 'CONFIRMED').length,
        total: drives.length,
      })
    })
  }, [])

  const cards = [
    { label: 'Dòng xe', value: stats.models, icon: Car, href: '/admin/models', color: 'bg-black' },
    { label: 'Chờ xác nhận', value: stats.pending, icon: Clock, href: '/admin/test-drives', color: 'bg-orange-500' },
    { label: 'Đã xác nhận', value: stats.confirmed, icon: CheckCircle2, href: '/admin/test-drives', color: 'bg-green-600' },
    { label: 'Tổng đăng ký', value: stats.total, icon: ClipboardList, href: '/admin/test-drives', color: 'bg-neutral-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Tổng quan</h1>
        <p className="text-neutral-500 text-sm mt-1">Xin chào! Đây là tóm tắt hoạt động hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white border border-neutral-200 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-black">{card.value}</p>
              </div>
              <div className={`w-10 h-10 ${card.color} flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-bold text-black mb-4">Truy cập nhanh</h3>
          <div className="space-y-3">
            <Link href="/admin/models" className="flex items-center gap-3 text-sm text-neutral-600 hover:text-black p-3 border border-neutral-100 hover:border-black transition-all">
              <Car size={16} /> Quản lý dòng xe
            </Link>
            <Link href="/admin/test-drives" className="flex items-center gap-3 text-sm text-neutral-600 hover:text-black p-3 border border-neutral-100 hover:border-black transition-all">
              <ClipboardList size={16} /> Xem đăng ký lái thử
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 text-sm text-neutral-600 hover:text-black p-3 border border-neutral-100 hover:border-black transition-all">
              <Clock size={16} /> Cài đặt email
            </Link>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-bold text-black mb-4">Trạng thái hệ thống</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>API Backend</span>
              <span className="text-green-600 font-medium">● Hoạt động</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Database</span>
              <span className="text-green-600 font-medium">● Hoạt động</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Email Service</span>
              <span className="text-green-600 font-medium">● Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
