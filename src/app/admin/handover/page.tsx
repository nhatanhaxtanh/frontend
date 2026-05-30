'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { handoverApi } from '@/lib/api'
import type { HandoverPhoto } from '@/lib/types'
import { toast } from 'sonner'
import { Plus, Trash2, RefreshCw, ImageIcon, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function AdminHandoverPage() {
  const [photos, setPhotos] = useState<HandoverPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await handoverApi.adminGetAll()
      setPhotos(res.data)
    } catch {
      toast.error('Không tải được danh sách ảnh')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!fileInputRef.current) return
    fileInputRef.current.value = ''
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'webp'].includes(ext ?? '')) {
      toast.error('Chỉ chấp nhận file JPG, JPEG, WEBP')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File vượt quá 2MB')
      return
    }

    setUploading(true)
    let createdId: number | null = null
    try {
      const created = await handoverApi.create({ sortOrder: photos.length, active: true })
      createdId = created.data.id
      await handoverApi.uploadImage(createdId, file)
      toast.success('Thêm ảnh thành công')
      fetch()
    } catch {
      if (createdId !== null) {
        await handoverApi.delete(createdId).catch(() => null)
      }
      toast.error('Thêm ảnh thất bại')
    } finally {
      setUploading(false)
    }
  }

  const handleToggleActive = async (photo: HandoverPhoto) => {
    try {
      await handoverApi.update(photo.id, { ...photo, active: !photo.active })
      toast.success(photo.active ? 'Đã ẩn ảnh' : 'Đã hiện ảnh')
      fetch()
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá ảnh này?')) return
    try {
      await handoverApi.delete(id)
      toast.success('Đã xoá')
      fetch()
    } catch {
      toast.error('Xoá thất bại')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Nghi lễ bàn giao</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Quản lý ảnh nghi lễ bàn giao xe</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetch} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button
            size="sm"
            className="rounded-none"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Thêm ảnh
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.webp"
            className="hidden"
            onChange={handleAddPhoto}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-neutral-400" />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
          <ImageIcon size={40} strokeWidth={1} />
          <p className="text-sm">Chưa có ảnh nào. Nhấn &quot;Thêm ảnh&quot; để bắt đầu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative aspect-square bg-neutral-100 overflow-hidden border ${
                photo.active ? 'border-neutral-200' : 'border-dashed border-neutral-300 opacity-60'
              }`}
            >
              {photo.imageUrl ? (
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                  <ImageIcon size={24} strokeWidth={1} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleToggleActive(photo)}
                  title={photo.active ? 'Ẩn' : 'Hiện'}
                  className="w-8 h-8 bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                >
                  {photo.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  title="Xoá"
                  className="w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {!photo.active && (
                <div className="absolute top-1.5 left-1.5 bg-neutral-700/80 text-white text-[10px] px-1.5 py-0.5">
                  Đã ẩn
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-neutral-400">Ảnh JPG/WEBP, tối đa 2MB. Hover vào ảnh để ẩn/hiện hoặc xoá.</p>
    </div>
  )
}
