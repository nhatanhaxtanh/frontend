'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { handoverApi } from '@/lib/api'
import type { HandoverPhoto } from '@/lib/types'
import { toast } from 'sonner'
import { Plus, Trash2, RefreshCw, ImageIcon, Loader2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

export default function AdminHandoverPage() {
  const [photos, setPhotos] = useState<HandoverPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editPhoto, setEditPhoto] = useState<HandoverPhoto | null>(null)
  const [caption, setCaption] = useState('')
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)
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

  const openEdit = (photo: HandoverPhoto) => {
    setEditPhoto(photo)
    setCaption(photo.caption ?? '')
    setActive(photo.active)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editPhoto) return
    setSaving(true)
    try {
      await handoverApi.update(editPhoto.id, { ...editPhoto, caption, active })
      toast.success('Đã lưu')
      setDialogOpen(false)
      fetch()
    } catch {
      toast.error('Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

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
      if (createdId !== null) await handoverApi.delete(createdId).catch(() => null)
      toast.error('Thêm ảnh thất bại')
    } finally {
      setUploading(false)
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
              className={`flex flex-col border bg-white overflow-hidden ${
                photo.active ? 'border-neutral-200' : 'border-dashed border-neutral-300'
              }`}
            >
              {/* Image */}
              <div className={`relative aspect-square bg-neutral-100 ${!photo.active ? 'opacity-50' : ''}`}>
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
                {!photo.active && (
                  <div className="absolute top-1.5 left-1.5 bg-neutral-700/80 text-white text-[10px] px-1.5 py-0.5">
                    Đã ẩn
                  </div>
                )}
              </div>

              {/* Caption & actions */}
              <div className="px-2 py-2 flex flex-col gap-1.5">
                <p className="text-xs text-neutral-500 truncate min-h-[1rem]">
                  {photo.caption || <span className="italic text-neutral-300">Chưa có chú thích</span>}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(photo)}
                    className="flex-1 flex items-center justify-center gap-1 py-1 text-xs border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-600"
                  >
                    <Pencil size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="flex items-center justify-center px-2 py-1 text-xs border border-red-100 hover:bg-red-50 transition-colors text-red-500"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-400">Ảnh JPG/WEBP, tối đa 2MB.</p>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ảnh</DialogTitle>
          </DialogHeader>

          {editPhoto?.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
              <Image
                src={editPhoto.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          )}

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="caption">Chú thích</Label>
              <Input
                id="caption"
                placeholder="Nhập chú thích ảnh..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={active}
                onClick={() => setActive((v) => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors ${active ? 'bg-black' : 'bg-neutral-300'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-4' : ''}`}
                />
              </button>
              <Label className="cursor-pointer" onClick={() => setActive((v) => !v)}>
                {active ? 'Hiển thị trên website' : 'Đang ẩn'}
              </Label>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                Huỷ
              </Button>
              <Button className="flex-1 rounded-none" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                Lưu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
