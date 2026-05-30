'use client'

import { useEffect, useRef, useState } from 'react'
import { handoverApi } from '@/lib/api'
import type { HandoverPhoto } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, RefreshCw, Pencil, Trash2, ImageIcon, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'

const emptyForm = (sortOrder = 0): Partial<HandoverPhoto> => ({
  caption: '', sortOrder, active: true,
})

export default function AdminHandoverPage() {
  const [photos, setPhotos] = useState<HandoverPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Partial<HandoverPhoto>>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await handoverApi.adminGetAll()
      setPhotos(res.data)
    } catch {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const sorted = [...photos].sort((a, b) => a.sortOrder - b.sortOrder)

  const openCreate = () => {
    setForm(emptyForm(photos.length))
    setEditId(null)
    setPendingFile(null)
    setDialogOpen(true)
  }

  const openEdit = (p: HandoverPhoto) => {
    setForm({ ...p })
    setEditId(p.id)
    setPendingFile(null)
    setDialogOpen(true)
  }

  const set = (key: keyof HandoverPhoto, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validateFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'webp'].includes(ext ?? '')) {
      toast.error('Chỉ chấp nhận file JPG, JPEG, WEBP')
      return false
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File vượt quá 2MB')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!editId && !pendingFile) { toast.error('Vui lòng chọn ảnh'); return }
    setSaving(true)
    let createdId: number | null = null
    try {
      if (editId) {
        await handoverApi.update(editId, form)
        if (pendingFile) await handoverApi.uploadImage(editId, pendingFile)
        toast.success('Cập nhật thành công')
      } else {
        const res = await handoverApi.create(form)
        createdId = res.data.id
        await handoverApi.uploadImage(createdId, pendingFile!)
        toast.success('Thêm ảnh thành công')
      }
      setDialogOpen(false)
      fetch()
    } catch {
      if (createdId) await handoverApi.delete(createdId).catch(() => null)
      toast.error('Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa ảnh này?')) return
    try {
      await handoverApi.delete(id)
      setPhotos((prev) => prev.filter((p) => p.id !== id))
      toast.success('Đã xóa')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  const handleToggleActive = async (photo: HandoverPhoto) => {
    try {
      await handoverApi.update(photo.id, { ...photo, active: !photo.active })
      setPhotos((prev) => prev.map((p) => p.id === photo.id ? { ...p, active: !p.active } : p))
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const handleReorder = async (photo: HandoverPhoto, dir: -1 | 1) => {
    const idx = sorted.findIndex((p) => p.id === photo.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const other = sorted[swapIdx]
    try {
      await Promise.all([
        handoverApi.update(photo.id, { ...photo, sortOrder: other.sortOrder }),
        handoverApi.update(other.id, { ...other, sortOrder: photo.sortOrder }),
      ])
      fetch()
    } catch {
      toast.error('Sắp xếp thất bại')
    }
  }

  const handleReplaceImage = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !validateFile(file)) return
    setUploadingId(id)
    try {
      const res = await handoverApi.uploadImage(id, file)
      setPhotos((prev) => prev.map((p) => p.id === id ? res.data : p))
      toast.success('Đổi ảnh thành công')
    } catch {
      toast.error('Upload thất bại')
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Lễ bàn giao</h1>
          <p className="text-neutral-500 text-sm mt-1">{photos.length} ảnh</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetch} variant="outline" size="sm" className="rounded-lg">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={openCreate} size="sm" className="rounded-lg gap-2">
            <Plus size={14} /> Thêm ảnh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-400">Đang tải...</div>
      ) : (
        <div className="space-y-4">
          {sorted.map((photo, i) => (
            <div
              key={photo.id}
              className={`bg-white border p-5 ${photo.active ? 'border-neutral-200' : 'border-neutral-100 opacity-60'}`}
            >
              <div className="flex gap-5">
                {/* Preview */}
                <div className="shrink-0 w-32 h-20 bg-neutral-100 overflow-hidden relative">
                  {photo.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-black text-sm">
                        {photo.caption || <span className="text-neutral-400 italic font-normal">Chưa có chú thích</span>}
                      </p>
                      <p className="text-neutral-400 text-xs mt-1">#{photo.id}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleReorder(photo, -1)} disabled={i === 0}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30">
                        <ChevronUp size={13} />
                      </button>
                      <button onClick={() => handleReorder(photo, 1)} disabled={i === sorted.length - 1}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30">
                        <ChevronDown size={13} />
                      </button>
                      <button onClick={() => handleToggleActive(photo)}
                        className={`w-7 h-7 flex items-center justify-center border transition-colors ${photo.active ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-neutral-200 text-neutral-400 hover:bg-neutral-50'}`}
                        title={photo.active ? 'Đang hiển thị' : 'Đang ẩn'}>
                        {photo.active ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button onClick={() => openEdit(photo)}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(photo.id)}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 text-red-500 hover:bg-red-50 hover:border-red-200">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Replace image */}
                  <div className="mt-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.webp"
                        className="hidden"
                        ref={photo.id === uploadingId ? replaceInputRef : undefined}
                        onChange={(e) => handleReplaceImage(photo.id, e)}
                        disabled={uploadingId === photo.id}
                      />
                      <Button size="sm" variant="outline" className="rounded-lg gap-1.5 text-xs h-7 px-3 pointer-events-none"
                        disabled={uploadingId === photo.id}>
                        {uploadingId === photo.id
                          ? <Loader2 size={11} className="animate-spin" />
                          : <ImageIcon size={11} />}
                        Đổi ảnh
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="p-12 text-center text-neutral-400 bg-white border border-neutral-200">
              Chưa có ảnh nào.
            </div>
          )}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>{editId ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* File picker (create) or current image (edit) */}
            {editId && form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt="" className="w-full h-40 object-cover bg-neutral-100" />
            ) : null}

            <div className="space-y-1.5">
              <Label>{editId ? 'Đổi ảnh (tuỳ chọn)' : 'Chọn ảnh *'}</Label>
              <label className="cursor-pointer block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && validateFile(file)) setPendingFile(file)
                    else setPendingFile(null)
                  }}
                />
                <Button type="button" variant="outline" size="sm" className="rounded-lg gap-2 pointer-events-none w-full justify-center"
                  onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon size={13} />
                  {pendingFile ? pendingFile.name : 'Chọn file JPG / WEBP (tối đa 2MB)'}
                </Button>
              </label>
            </div>

            <div className="space-y-1.5">
              <Label>Chú thích</Label>
              <Input
                value={form.caption ?? ''}
                onChange={(e) => set('caption', e.target.value)}
                placeholder="Mô tả ngắn về bức ảnh..."
                className="rounded-lg"
              />
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.active}
                onChange={(e) => set('active', e.target.checked)}
                className="w-4 h-4"
              />
              Hiển thị trên website
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg">Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-lg">
              {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm ảnh'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
