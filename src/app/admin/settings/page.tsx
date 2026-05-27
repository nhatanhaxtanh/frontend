'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Info } from 'lucide-react'

export default function AdminSettingsPage() {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirmPass) { toast.error('Mật khẩu mới không khớp'); return }
    if (newPass.length < 8) { toast.error('Mật khẩu phải ít nhất 8 ký tự'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      })
      if (!res.ok) throw new Error()
      toast.success('Đổi mật khẩu thành công')
      setOldPass(''); setNewPass(''); setConfirmPass('')
    } catch {
      toast.error('Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Cài đặt</h1>
        <p className="text-neutral-500 text-sm mt-1">Quản lý tài khoản và cấu hình hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-bold text-black mb-5">Đổi mật khẩu</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Mật khẩu hiện tại</Label>
              <Input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="rounded-none" required />
            </div>
            <div className="space-y-1.5">
              <Label>Mật khẩu mới</Label>
              <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="rounded-none" required />
            </div>
            <div className="space-y-1.5">
              <Label>Xác nhận mật khẩu mới</Label>
              <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="rounded-none" required />
            </div>
            <Button type="submit" disabled={loading} className="rounded-none w-full">
              {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </Button>
          </form>
        </div>

        {/* Email Config Info */}
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-bold text-black mb-5">Cấu hình Email</h3>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 flex gap-3 mb-5">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-blue-800 text-sm">
              Cấu hình email được thiết lập trong file{' '}
              <code className="bg-blue-100 px-1 rounded text-xs">application.properties</code>{' '}
              trên server. Để thay đổi email nhận thông báo hoặc thông tin Gmail, cần chỉnh sửa
              file cấu hình và khởi động lại backend.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">SMTP Host</span>
              <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5">smtp.gmail.com</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">SMTP Port</span>
              <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5">587</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-neutral-500">File cấu hình</span>
              <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5">application.properties</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
