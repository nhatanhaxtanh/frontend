'use client'

import { useEffect, useState } from 'react'
import { carModelApi } from '@/lib/api'
import type { CarModel, CarPromotion } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, RefreshCw, ImageIcon, Loader2, MoreVertical, Images, Tag } from 'lucide-react'
import { getModelImage } from '@/lib/model-images'

const DEFAULT_PROMOS: Record<string, Partial<CarPromotion>> = {
  'tiguan-facelift': { title: 'Ưu đãi đặc biệt — Tiguan Facelift', description: 'Cơ hội sở hữu Tiguan Facelift với ưu đãi hấp dẫn. Liên hệ ngay để nhận tư vấn chi tiết.', items: ['Giảm ngay 30 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ 1 năm trị giá 15 triệu', 'Gói phụ kiện chính hãng 10 triệu', 'Hỗ trợ vay 0% lãi suất 12 tháng đầu'], validUntil: '30/06/2026', active: true },
  'teramont-usa-base': { title: 'Ưu đãi — Teramont USA Base', description: 'Sở hữu SUV 7 chỗ nhập Mỹ với chính sách ưu đãi tốt nhất trong năm.', items: ['Giảm 50 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ 1 năm', 'Camera hành trình cao cấp', 'Hỗ trợ vay lãi suất ưu đãi'], validUntil: '30/06/2026', active: true },
  'teramont-usa-limited': { title: 'Ưu đãi — Teramont USA Limited', description: 'Phiên bản Limited cao cấp với gói ưu đãi đặc biệt dành cho khách hàng thành viên.', items: ['Giảm 60 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ + nội thất 1 năm', 'Phủ nano thân xe miễn phí', 'Ưu đãi lãi suất 0% tối đa 18 tháng'], validUntil: '30/06/2026', active: true },
  'teramont-president': { title: 'Ưu đãi — Teramont President', description: 'Phiên bản đỉnh cao của Teramont với gói ưu đãi sang trọng đặc biệt.', items: ['Giảm 80 triệu tiền mặt', 'Tặng bảo hiểm toàn diện 1 năm', 'Phủ nano & dán PPF miễn phí', 'Tặng thẻ bảo dưỡng 3 năm'], validUntil: '30/06/2026', active: true },
  'teramont-x-platinum': { title: 'Ưu đãi — Teramont X Platinum', description: 'Phiên bản Platinum độc quyền với chương trình ưu đãi đặc biệt giới hạn.', items: ['Giảm 70 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ + nội thất 1 năm', 'Dán PPF toàn thân miễn phí', 'Gói chăm sóc xe VIP 2 năm'], validUntil: '30/06/2026', active: true },
  'viloran-premium': { title: 'Ưu đãi — Viloran Premium', description: 'MPV 7 chỗ sang trọng với ưu đãi hấp dẫn cho gia đình hiện đại.', items: ['Giảm 40 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ 1 năm', 'Gói phụ kiện gia đình 8 triệu', 'Hỗ trợ vay 0% lãi suất 12 tháng'], validUntil: '30/06/2026', active: true },
  'viloran-luxury': { title: 'Ưu đãi — Viloran Luxury', description: 'Trải nghiệm MPV hạng nhất với gói ưu đãi chăm sóc toàn diện.', items: ['Giảm 60 triệu tiền mặt', 'Tặng bảo hiểm toàn diện 1 năm', 'Dán PPF kính + nóc xe', 'Gói VIP: bảo dưỡng 3 năm miễn phí'], validUntil: '30/06/2026', active: true },
  'golf-15-etsi': { title: 'Ưu đãi — Golf 1.5 eTSI', description: 'Hatchback hybrid tiết kiệm với ưu đãi dành cho khách hàng trẻ năng động.', items: ['Giảm 20 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ 1 năm', 'Gói phụ kiện thể thao 5 triệu', 'Hỗ trợ vay lãi suất 0% 6 tháng'], validUntil: '30/06/2026', active: true },
  'golf-20': { title: 'Ưu đãi — Golf 2.0 TSI', description: 'Hatchback hiệu suất cao với ưu đãi đặc biệt cho người yêu xe thể thao.', items: ['Giảm 30 triệu tiền mặt', 'Tặng bảo hiểm thân vỏ 1 năm', 'Phủ nano thân xe miễn phí', 'Hỗ trợ vay lãi suất ưu đãi'], validUntil: '30/06/2026', active: true },
  'touareg-elegance': { title: 'Ưu đãi — Touareg Elegance', description: 'SUV flagship đẳng cấp với chương trình ưu đãi dành riêng cho khách hàng VIP.', items: ['Giảm 100 triệu tiền mặt', 'Tặng bảo hiểm toàn diện 2 năm', 'Dán PPF toàn thân cao cấp', 'Gói bảo dưỡng VIP 3 năm miễn phí'], validUntil: '30/06/2026', active: true },
  'touareg-rline': { title: 'Ưu đãi — Touareg R-Line', description: 'Phiên bản thể thao của Touareg với ưu đãi hấp dẫn cho người yêu tốc độ.', items: ['Giảm 100 triệu tiền mặt', 'Tặng bảo hiểm toàn diện 1 năm', 'Dán PPF + phủ nano toàn thân', 'Ưu đãi đặc biệt khi mua trực tiếp showroom'], validUntil: '30/06/2026', active: true },
  'touareg-highline': { title: 'Ưu đãi — Touareg Highline', description: 'Đỉnh cao của Touareg với gói ưu đãi chăm sóc VIP toàn diện nhất.', items: ['Giảm 120 triệu tiền mặt', 'Tặng bảo hiểm toàn diện 2 năm', 'Dán PPF toàn thân + phủ nano', 'Thẻ VIP chăm sóc xe 3 năm miễn phí', 'Tặng camera 360° chính hãng'], validUntil: '30/06/2026', active: true },
}

const LOCAL_GALLERY: Record<string, string> = {
  'tiguan-facelift': '/images/models/tiguanfacelit.jpg',
  'teramont-usa-base': '/images/models/usa.jpeg',
  'teramont-usa-limited': '/images/models/limited.PNG',
  'teramont-president': '/images/models/teramontpresident.jpg',
  'teramont-x-platinum': '/images/models/teramontxplatinum.jpg',
  'viloran-premium': '/images/models/viloranpremium.jpg',
  'viloran-luxury': '/images/models/viloranluxury.jpg',
  'golf-15-etsi': '/images/models/golf15.jpg',
  'golf-20': '/images/models/Golf20.jpg',
  'touareg-elegance': '/images/models/TouaregElegance.jpg',
  'touareg-rline': '/images/models/TouaregRline.jpeg',
  'touareg-highline': '/images/models/TouaregHighline.jpg',
}

const emptyForm = (): Partial<CarModel> => ({
  name: '', slug: '', category: 'SUV', price: 0, priceDisplay: '',
  shortDescription: '', description: '', engine: '', power: '', torque: '',
  seats: 5, fuelType: 'Xăng', transmission: '', imageUrl: '', featured: false, active: true,
})

export default function AdminModelsPage() {
  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Partial<CarModel>>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const [galleryModel, setGalleryModel] = useState<CarModel | null>(null)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [promoModel, setPromoModel] = useState<CarModel | null>(null)
  const [promo, setPromo] = useState<Partial<CarPromotion> | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoSaving, setPromoSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await carModelApi.getAll()
      setModels(res.data)
    } catch {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm(emptyForm()); setEditId(null); setDialogOpen(true) }
  const openEdit = (m: CarModel) => { setForm({ ...m }); setEditId(m.id); setDialogOpen(true) }

  const set = (key: keyof CarModel, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }))

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSave = async () => {
    if (!form.name?.trim()) { toast.error('Tên xe không được trống'); return }
    setSaving(true)
    try {
      if (editId) {
        await carModelApi.update(editId, form)
        toast.success('Cập nhật thành công')
      } else {
        await carModelApi.create(form)
        toast.success('Thêm xe thành công')
      }
      setDialogOpen(false)
      fetch()
    } catch {
      toast.error('Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleThumbnailUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh phải nhỏ hơn 2MB')
      return
    }
    setUploading(id)
    try {
      const res = await carModelApi.uploadThumbnail(id, file)
      setModels((prev) => prev.map((m) => (m.id === id ? { ...m, imageUrl: res.data.imageUrl } : m)))
      toast.success('Cập nhật ảnh thành công')
    } catch {
      toast.error('Upload ảnh thất bại')
    } finally {
      setUploading(null)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!galleryModel) return
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 2 * 1024 * 1024) { toast.error('Ảnh phải nhỏ hơn 2MB'); return }
    setGalleryUploading(true)
    try {
      const res = await carModelApi.galleryUpload(galleryModel.id, file)
      setModels((prev) => prev.map((m) => (m.id === galleryModel.id ? res.data : m)))
      setGalleryModel(res.data)
      toast.success('Thêm ảnh thành công')
    } catch {
      toast.error('Upload ảnh thất bại')
    } finally {
      setGalleryUploading(false)
    }
  }

  const handleGalleryRemove = async (url: string) => {
    if (!galleryModel) return
    try {
      const res = await carModelApi.galleryRemove(galleryModel.id, url)
      setModels((prev) => prev.map((m) => (m.id === galleryModel.id ? res.data : m)))
      setGalleryModel(res.data)
      toast.success('Đã xóa ảnh')
    } catch {
      toast.error('Xóa ảnh thất bại')
    }
  }

  const openPromo = async (model: CarModel) => {
    setPromoModel(model)
    setPromoLoading(true)
    try {
      const res = await carModelApi.getPromotion(model.id)
      setPromo(res.data)
    } catch {
      setPromo({
        carModelId: model.id,
        ...(DEFAULT_PROMOS[model.slug] ?? { title: '', description: '', items: [], validUntil: '', active: true }),
      })
    } finally {
      setPromoLoading(false)
    }
  }

  const handleSavePromo = async () => {
    if (!promoModel || !promo) return
    setPromoSaving(true)
    try {
      await carModelApi.savePromotion(promoModel.id, promo)
      toast.success('Lưu ưu đãi thành công')
      setPromoModel(null)
      setPromo(null)
    } catch {
      toast.error('Lưu thất bại')
    } finally {
      setPromoSaving(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa "${name}"?`)) return
    try {
      await carModelApi.delete(id)
      setModels((prev) => prev.filter((m) => m.id !== id))
      toast.success('Đã xóa')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Quản lý dòng xe</h1>
          <p className="text-neutral-500 text-sm mt-1">{models.length} xe</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetch} variant="outline" size="sm" className="rounded-none gap-2">
            <RefreshCw size={14} />
          </Button>
          <Button onClick={openCreate} size="sm" className="rounded-none gap-2">
            <Plus size={14} /> Thêm xe
          </Button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Đang tải...</div>
        ) : models.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">Chưa có dòng xe nào. Nhấn &quot;Thêm xe&quot; để bắt đầu.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Ảnh</TableHead>
                  <TableHead>Tên xe</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá từ</TableHead>
                  <TableHead>Nổi bật</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>
                      <label className="cursor-pointer group relative block w-16 h-12">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleThumbnailUpload(model.id, e)}
                          disabled={uploading === model.id}
                        />
                        {uploading === model.id ? (
                          <div className="w-16 h-12 border border-neutral-200 flex items-center justify-center bg-neutral-50">
                            <Loader2 size={14} className="animate-spin text-neutral-400" />
                          </div>
                        ) : (
                          <div className="w-16 h-12 border border-neutral-200 overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getModelImage(model.slug, model.imageUrl)}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                              <ImageIcon size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        )}
                      </label>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-black">{model.name}</p>
                        <p className="text-xs text-neutral-400">{model.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-none text-xs">{model.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-600">{model.priceDisplay}₫</TableCell>
                    <TableCell>
                      <span className={model.featured ? 'text-green-600 text-xs font-medium' : 'text-neutral-400 text-xs'}>
                        {model.featured ? 'Có' : 'Không'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={model.active ? 'text-green-600 text-xs font-medium' : 'text-red-500 text-xs font-medium'}>
                        {model.active ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors">
                          <MoreVertical size={14} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => openEdit(model)} className="gap-2 cursor-pointer">
                            <Pencil size={14} /> Thông tin xe
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setGalleryModel(model)} className="gap-2 cursor-pointer">
                            <Images size={14} /> Ảnh chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPromo(model)} className="gap-2 cursor-pointer">
                            <Tag size={14} /> Form ưu đãi
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(model.id, model.name)}
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 size={14} /> Xóa xe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Tên xe *</Label>
              <Input
                value={form.name || ''}
                onChange={(e) => { set('name', e.target.value); if (!editId) set('slug', autoSlug(e.target.value)) }}
                placeholder="VD: Tiguan Facelift"
                className="rounded-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="tiguan-facelift" className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Danh mục</Label>
              <Select value={form.category || 'SUV'} onValueChange={(v) => set('category', v)}>
                <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['SUV', 'MPV', 'Sedan', 'Coupe'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Giá xe (VNĐ)</Label>
              <Input
                type="number"
                value={form.price || ''}
                onChange={(e) => {
                  const n = parseInt(e.target.value) || 0
                  set('price', n)
                  set('priceDisplay', n > 0 ? new Intl.NumberFormat('vi-VN').format(n) : '')
                }}
                placeholder="1699000000"
                className="rounded-none"
              />
              {(form.price ?? 0) > 0 && (
                <p className="text-xs text-neutral-400">Hiển thị: {new Intl.NumberFormat('vi-VN').format(form.price!)}₫</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Số chỗ</Label>
              <Input type="number" value={form.seats || 5} onChange={(e) => set('seats', parseInt(e.target.value))} className="rounded-none" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Mô tả ngắn</Label>
              <Input value={form.shortDescription || ''} onChange={(e) => set('shortDescription', e.target.value)} placeholder="SUV đô thị thông minh..." className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Động cơ</Label>
              <Input value={form.engine || ''} onChange={(e) => set('engine', e.target.value)} placeholder="2.0L TSI" className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Công suất</Label>
              <Input value={form.power || ''} onChange={(e) => set('power', e.target.value)} placeholder="190 mã lực" className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Mô-men xoắn</Label>
              <Input value={form.torque || ''} onChange={(e) => set('torque', e.target.value)} placeholder="320 Nm" className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Hộp số</Label>
              <Input value={form.transmission || ''} onChange={(e) => set('transmission', e.target.value)} placeholder="DSG 7 cấp" className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>Nhiên liệu</Label>
              <Select value={form.fuelType || 'Xăng'} onValueChange={(v) => set('fuelType', v)}>
                <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Xăng', 'Xăng Hybrid', 'Diesel', 'Điện'].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Mô tả đầy đủ</Label>
              <Textarea value={form.description || ''} onChange={(e) => set('description', e.target.value)} rows={4} className="rounded-none resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label>URL ảnh chính</Label>
              <Input value={form.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." className="rounded-none" />
            </div>
            <div className="space-y-1.5">
              <Label>YouTube Video ID</Label>
              <Input value={form.videoUrl || ''} onChange={(e) => set('videoUrl', e.target.value)} placeholder="dQw4w9WgXcQ" className="rounded-none" />
            </div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4" />
                Nổi bật
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!form.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4" />
                Hiển thị
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-none">Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-none">
              {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm xe'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery dialog */}
      <Dialog open={!!galleryModel} onOpenChange={(o) => { if (!o) setGalleryModel(null) }}>
        <DialogContent className="max-w-3xl rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ảnh chi tiết — {galleryModel?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">{galleryModel?.images?.length ?? 0} ảnh</p>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={galleryUploading} />
                <Button size="sm" className="rounded-none gap-2 pointer-events-none" disabled={galleryUploading}>
                  {galleryUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Thêm ảnh
                </Button>
              </label>
            </div>
            {(!galleryModel?.images || galleryModel.images.length === 0) ? (
              galleryModel && LOCAL_GALLERY[galleryModel.slug] ? (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-400 italic">Ảnh mặc định — upload ảnh thực để thay thế</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="relative aspect-video bg-neutral-100 overflow-hidden opacity-60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={LOCAL_GALLERY[galleryModel.slug]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-neutral-300 rounded py-16 text-center text-neutral-400 text-sm">
                  Chưa có ảnh nào. Nhấn &quot;Thêm ảnh&quot; để upload.
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryModel.images.map((url, i) => (
                  <div key={i} className="relative group aspect-video bg-neutral-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleGalleryRemove(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setGalleryModel(null)} className="rounded-none">Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Promo dialog */}
      <Dialog open={!!promoModel} onOpenChange={(o) => { if (!o) { setPromoModel(null); setPromo(null) } }}>
        <DialogContent className="max-w-2xl rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form ưu đãi — {promoModel?.name}</DialogTitle>
          </DialogHeader>
          {promoLoading ? (
            <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-neutral-400" /></div>
          ) : (
            <div className="space-y-5 py-4">
              <div className="space-y-1.5">
                <Label>Tiêu đề ưu đãi</Label>
                <Input
                  value={promo?.title ?? ''}
                  onChange={(e) => setPromo((p) => ({ ...p!, title: e.target.value }))}
                  placeholder="VD: Ưu đãi tháng 6 — Giảm ngay 50 triệu"
                  className="rounded-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Mô tả ngắn</Label>
                <Textarea
                  value={promo?.description ?? ''}
                  onChange={(e) => setPromo((p) => ({ ...p!, description: e.target.value }))}
                  placeholder="Mô tả chương trình ưu đãi..."
                  className="rounded-none resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Danh sách ưu đãi</Label>
                {(promo?.items ?? []).map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const items = [...(promo?.items ?? [])]
                        items[i] = e.target.value
                        setPromo((p) => ({ ...p!, items }))
                      }}
                      placeholder={`Ưu đãi ${i + 1}`}
                      className="rounded-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-neutral-400 hover:text-red-600 shrink-0"
                      onClick={() => setPromo((p) => ({ ...p!, items: (p?.items ?? []).filter((_, idx) => idx !== i) }))}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none gap-1"
                  onClick={() => setPromo((p) => ({ ...p!, items: [...(p?.items ?? []), ''] }))}
                >
                  <Plus size={14} /> Thêm ưu đãi
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>Hiệu lực đến</Label>
                <Input
                  value={promo?.validUntil ?? ''}
                  onChange={(e) => setPromo((p) => ({ ...p!, validUntil: e.target.value }))}
                  placeholder="VD: 30/06/2026"
                  className="rounded-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!promo?.active}
                  onChange={(e) => setPromo((p) => ({ ...p!, active: e.target.checked }))}
                  className="w-4 h-4"
                />
                Hiển thị trên trang xe
              </label>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => { setPromoModel(null); setPromo(null) }} className="rounded-none">Hủy</Button>
            <Button onClick={handleSavePromo} disabled={promoSaving || promoLoading} className="rounded-none">
              {promoSaving ? 'Đang lưu...' : 'Lưu ưu đãi'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
