'use client'

import { useEffect, useState } from 'react'
import { carModelApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'

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
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(model)} className="h-7 w-7 p-0">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(model.id, model.name)} className="h-7 w-7 p-0 text-neutral-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
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
                placeholder="VD: Tiguan 2024"
                className="rounded-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="tiguan-2024" className="rounded-none" />
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
              <Label>Giá hiển thị (VD: 1.699.000.000)</Label>
              <Input value={form.priceDisplay || ''} onChange={(e) => set('priceDisplay', e.target.value)} placeholder="1.699.000.000" className="rounded-none" />
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
    </div>
  )
}
