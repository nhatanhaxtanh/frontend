'use client'

import { useEffect, useState } from 'react'
import { newsApi } from '@/lib/api'
import type { NewsPost } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, RefreshCw, ImageIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = ['Xe mới', 'Sự kiện', 'Khuyến mãi', 'Tin tức']

const empty = (): Partial<NewsPost> => ({
  title: '', slug: '', category: 'Xe mới', imageUrl: '', excerpt: '', content: '', published: true,
})

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Partial<NewsPost>>(empty())
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)

  const fetch = async () => {
    setLoading(true)
    try { const res = await newsApi.adminGetAll(); setPosts(res.data) }
    catch { toast.error('Không thể tải dữ liệu') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const set = (key: keyof NewsPost, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  const autoSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

  const openCreate = () => { setForm(empty()); setEditId(null); setDialogOpen(true) }
  const openEdit = (p: NewsPost) => { setForm({ ...p }); setEditId(p.id); setDialogOpen(true) }

  const handleSave = async () => {
    if (!form.title?.trim()) { toast.error('Tiêu đề không được trống'); return }
    setSaving(true)
    try {
      editId ? await newsApi.update(editId, form) : await newsApi.create(form)
      toast.success(editId ? 'Cập nhật thành công' : 'Đăng bài thành công')
      setDialogOpen(false); fetch()
    } catch { toast.error('Lưu thất bại') }
    finally { setSaving(false) }
  }

  const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (file.size > 2 * 1024 * 1024) { toast.error('Ảnh phải nhỏ hơn 2MB'); return }
    setUploadingImage(id)
    try {
      const res = await newsApi.uploadImage(id, file)
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, imageUrl: res.data.imageUrl } : p))
      toast.success('Upload ảnh thành công')
    } catch {
      toast.error('Upload ảnh thất bại')
    } finally {
      setUploadingImage(null)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Xóa "${title}"?`)) return
    try { await newsApi.delete(id); setPosts((p) => p.filter((x) => x.id !== id)); toast.success('Đã xóa') }
    catch { toast.error('Xóa thất bại') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Tin tức &amp; Sự kiện</h1>
          <p className="text-neutral-500 text-sm mt-1">{posts.length} bài viết</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetch} variant="outline" size="sm" className="rounded-none"><RefreshCw size={14} /></Button>
          <Button onClick={openCreate} size="sm" className="rounded-none gap-2"><Plus size={14} /> Thêm bài</Button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">Chưa có bài viết nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <label className="cursor-pointer group relative block w-16 h-12">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(post.id, e)} disabled={uploadingImage === post.id} />
                        {uploadingImage === post.id ? (
                          <div className="w-16 h-12 border border-neutral-200 flex items-center justify-center bg-neutral-50">
                            <Loader2 size={14} className="animate-spin text-neutral-400" />
                          </div>
                        ) : (
                          <div className="w-16 h-12 border border-neutral-200 overflow-hidden relative bg-neutral-100">
                            {post.imageUrl
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-neutral-300"><ImageIcon size={16} /></div>
                            }
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                              <ImageIcon size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        )}
                      </label>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-black line-clamp-1">{post.title}</p>
                        <p className="text-xs text-neutral-400">{post.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1">{post.category}</span>
                    </TableCell>
                    <TableCell>
                      <span className={post.published ? 'text-green-600 text-xs font-medium' : 'text-neutral-400 text-xs'}>
                        {post.published ? 'Đã đăng' : 'Ẩn'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-400">
                      {post.createdAt ? format(new Date(post.createdAt), 'dd/MM/yyyy') : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(post)} className="h-7 w-7 p-0"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id, post.title)} className="h-7 w-7 p-0 text-neutral-400 hover:text-red-600"><Trash2 size={14} /></Button>
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
            <DialogTitle>{editId ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Tiêu đề *</Label>
              <Input value={form.title || ''} onChange={(e) => { set('title', e.target.value); if (!editId) set('slug', autoSlug(e.target.value)) }} className="rounded-none" placeholder="Tiêu đề bài viết" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Slug (URL)</Label>
                <Input value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} className="rounded-none" placeholder="tieu-de-bai-viet" />
              </div>
              <div className="space-y-1.5">
                <Label>Danh mục</Label>
                <Select value={form.category || 'Xe mới'} onValueChange={(v) => set('category', v)}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Ảnh đại diện</Label>
              <div className="flex gap-2">
                <Input value={form.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value)} className="rounded-none flex-1" placeholder="/images/news/... hoặc https://..." />
                {editId && (
                  <label className="cursor-pointer shrink-0">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file || !editId) return
                      e.target.value = ''
                      if (file.size > 2 * 1024 * 1024) { toast.error('Ảnh phải nhỏ hơn 2MB'); return }
                      try {
                        const res = await newsApi.uploadImage(editId, file)
                        set('imageUrl', res.data.imageUrl)
                        toast.success('Upload ảnh thành công')
                      } catch { toast.error('Upload ảnh thất bại') }
                    }} />
                    <Button type="button" variant="outline" size="sm" className="rounded-none h-10 gap-1.5 pointer-events-none">
                      <ImageIcon size={13} /> Upload
                    </Button>
                  </label>
                )}
              </div>
              {form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="" className="h-24 w-auto object-cover border border-neutral-200 mt-1" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Mô tả ngắn</Label>
              <Textarea value={form.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)} className="rounded-none resize-none" rows={2} placeholder="Tóm tắt nội dung bài viết..." />
            </div>
            <div className="space-y-1.5">
              <Label>Nội dung (HTML)</Label>
              <Textarea value={form.content || ''} onChange={(e) => set('content', e.target.value)} className="rounded-none resize-none font-mono text-xs" rows={8} placeholder="<p>Nội dung bài viết...</p>" />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={!!form.published} onChange={(e) => set('published', e.target.checked)} className="w-4 h-4" />
              Hiển thị (đã đăng)
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-none">Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-none">
              {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Đăng bài'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
