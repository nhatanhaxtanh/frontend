'use client'

import { useEffect, useState } from 'react'
import { heroApi } from '@/lib/api'
import type { HeroSlide } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, RefreshCw, Pencil, Trash2, ImageIcon, Video, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'

const emptySlide = (): Partial<HeroSlide> => ({
  label: '', heading: '', sub: '', description: '', imageUrl: '', videoUrl: '', sortOrder: 0, active: true,
})

// Cùng tiêu chí với backend (sortOrder ASC, id ASC) để thứ tự hiển thị luôn ổn định
const sortSlides = (list: HeroSlide[]) =>
  [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Partial<HeroSlide>>(emptySlide())
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await heroApi.adminGetAll()
      setSlides(res.data)
    } catch {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    const maxOrder = slides.reduce((max, s) => Math.max(max, s.sortOrder), -1)
    setForm({ ...emptySlide(), sortOrder: maxOrder + 1 })
    setEditId(null)
    setDialogOpen(true)
  }

  const openEdit = (s: HeroSlide) => {
    setForm({ ...s })
    setEditId(s.id)
    setDialogOpen(true)
  }

  const set = (key: keyof HeroSlide, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.heading?.trim()) { toast.error('Tiêu đề không được trống'); return }
    setSaving(true)
    try {
      if (editId) {
        await heroApi.update(editId, form)
        toast.success('Cập nhật thành công')
      } else {
        await heroApi.create(form)
        toast.success('Thêm slide thành công')
      }
      setDialogOpen(false)
      fetch()
    } catch {
      toast.error('Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa slide này?')) return
    try {
      await heroApi.delete(id)
      setSlides((prev) => prev.filter((s) => s.id !== id))
      toast.success('Đã xóa')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      await heroApi.update(slide.id, { ...slide, active: !slide.active })
      setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, active: !s.active } : s))
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const handleReorder = async (slide: HeroSlide, dir: -1 | 1) => {
    const current = sortSlides(slides)
    const idx = current.findIndex((s) => s.id === slide.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= current.length) return

    const next = [...current]
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]

    // Đánh lại sortOrder cho cả danh sách: nếu chỉ hoán đổi giá trị giữa 2 slide
    // thì các slide trùng sortOrder sẽ ghi đè cùng một số và thứ tự không đổi.
    const reindexed = next.map((s, i) => ({ ...s, sortOrder: i }))
    const previous = slides
    const changed = reindexed.filter(
      (s) => current.find((c) => c.id === s.id)?.sortOrder !== s.sortOrder,
    )
    setSlides(reindexed)
    try {
      await Promise.all(changed.map((s) => heroApi.update(s.id, s)))
      fetch()
    } catch {
      setSlides(previous)
      toast.error('Sắp xếp thất bại')
    }
  }

  const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 5 * 1024 * 1024) { toast.error('Ảnh phải nhỏ hơn 5MB'); return }
    setUploadingImage(id)
    try {
      const res = await heroApi.uploadImage(id, file)
      setSlides((prev) => prev.map((s) => s.id === id ? res.data : s))
      toast.success('Upload ảnh thành công')
    } catch {
      toast.error('Upload ảnh thất bại')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleVideoUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 50 * 1024 * 1024) { toast.error('Video phải nhỏ hơn 50MB'); return }
    setUploadingVideo(id)
    try {
      const res = await heroApi.uploadVideo(id, file)
      setSlides((prev) => prev.map((s) => s.id === id ? res.data : s))
      toast.success('Upload video thành công')
    } catch {
      toast.error('Upload video thất bại')
    } finally {
      setUploadingVideo(null)
    }
  }

  const sorted = sortSlides(slides)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Quản lý Hero</h1>
          <p className="text-neutral-500 text-sm mt-1">{slides.length} slide</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetch} variant="outline" size="sm" className="rounded-lg">
            <RefreshCw size={14} />
          </Button>
          <Button onClick={openCreate} size="sm" className="rounded-lg gap-2">
            <Plus size={14} /> Thêm slide
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-400">Đang tải...</div>
      ) : (
        <div className="space-y-4">
          {sorted.map((slide, i) => (
            <div key={slide.id} className={`bg-white border ${slide.active ? 'border-neutral-200' : 'border-neutral-100 opacity-60'} p-5`}>
              <div className="flex gap-5">
                {/* Preview */}
                <div className="shrink-0 w-32 h-20 bg-neutral-100 overflow-hidden relative">
                  {slide.videoUrl ? (
                    <video src={slide.videoUrl} muted className="w-full h-full object-cover" />
                  ) : slide.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  {slide.videoUrl && (
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">Video</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest truncate">{slide.label}</p>
                      <p className="font-bold text-black text-lg leading-tight">{slide.heading}</p>
                      <p className="text-neutral-500 text-sm">{slide.sub}</p>
                      <p className="text-neutral-400 text-xs mt-1 line-clamp-1">{slide.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder */}
                      <button
                        onClick={() => handleReorder(slide, -1)}
                        disabled={i === 0}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={() => handleReorder(slide, 1)}
                        disabled={i === sorted.length - 1}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30"
                      >
                        <ChevronDown size={13} />
                      </button>

                      {/* Toggle active */}
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`w-7 h-7 flex items-center justify-center border transition-colors ${slide.active ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-neutral-200 text-neutral-400 hover:bg-neutral-50'}`}
                        title={slide.active ? 'Đang hiển thị' : 'Đang ẩn'}
                      >
                        {slide.active ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEdit(slide)}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:bg-neutral-50"
                      >
                        <Pencil size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="w-7 h-7 flex items-center justify-center border border-neutral-200 text-red-500 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Upload buttons */}
                  <div className="flex gap-2 mt-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(slide.id, e)}
                        disabled={uploadingImage === slide.id}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg gap-1.5 text-xs h-7 px-3 pointer-events-none"
                        disabled={uploadingImage === slide.id}
                      >
                        {uploadingImage === slide.id
                          ? <Loader2 size={11} className="animate-spin" />
                          : <ImageIcon size={11} />}
                        Upload ảnh
                      </Button>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={(e) => handleVideoUpload(slide.id, e)}
                        disabled={uploadingVideo === slide.id}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg gap-1.5 text-xs h-7 px-3 pointer-events-none"
                        disabled={uploadingVideo === slide.id}
                      >
                        {uploadingVideo === slide.id
                          ? <Loader2 size={11} className="animate-spin" />
                          : <Video size={11} />}
                        Upload video
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
            <div className="p-12 text-center text-neutral-400 bg-white border border-neutral-200">
              Chưa có slide nào.
            </div>
          )}
        </div>
      )}

      {/* Edit / Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Chỉnh sửa slide' : 'Thêm slide mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Label (dòng nhỏ phía trên tiêu đề)</Label>
              <Input
                value={form.label || ''}
                onChange={(e) => set('label', e.target.value)}
                placeholder="VD: Volkswagen Touareg"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tiêu đề chính *</Label>
              <Input
                value={form.heading || ''}
                onChange={(e) => set('heading', e.target.value)}
                placeholder="VD: Flagship SUV."
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tiêu đề phụ</Label>
              <Input
                value={form.sub || ''}
                onChange={(e) => set('sub', e.target.value)}
                placeholder="VD: Đỉnh cao sang trọng."
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả</Label>
              <Textarea
                value={form.description || ''}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Mô tả ngắn hiển thị dưới tiêu đề..."
                className="rounded-lg resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL ảnh (hoặc upload sau)</Label>
              <Input
                value={form.imageUrl || ''}
                onChange={(e) => set('imageUrl', e.target.value)}
                placeholder="/images/hero.jpg hoặc https://..."
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL video (hoặc upload sau)</Label>
              <Input
                value={form.videoUrl || ''}
                onChange={(e) => set('videoUrl', e.target.value)}
                placeholder="/images/vid3.mp4 hoặc https://..."
                className="rounded-lg"
              />
              <p className="text-xs text-neutral-400">Nếu có cả ảnh và video, video sẽ được ưu tiên hiển thị.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <Label>Thứ tự</Label>
                <Input
                  type="number"
                  value={form.sortOrder ?? 0}
                  onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)}
                  className="rounded-lg"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={!!form.active}
                  onChange={(e) => set('active', e.target.checked)}
                  className="w-4 h-4"
                />
                Hiển thị
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg">Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-lg">
              {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm slide'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
