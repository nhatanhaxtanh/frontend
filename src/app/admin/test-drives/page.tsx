'use client'

import { useEffect, useState } from 'react'
import { testDriveApi } from '@/lib/api'
import type { TestDriveRequest, TestDriveStatus } from '@/lib/types'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_LABELS: Record<TestDriveStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

const STATUS_COLORS: Record<TestDriveStatus, string> = {
  PENDING: 'bg-orange-100 text-orange-700 border-orange-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminTestDrivesPage() {
  const [data, setData] = useState<TestDriveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await testDriveApi.getAll()
      setData(res.data)
    } catch {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await testDriveApi.updateStatus(id, status)
      setData((prev) => prev.map((item) => item.id === id ? { ...item, status: status as TestDriveStatus } : item))
      toast.success('Cập nhật trạng thái thành công')
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đăng ký này?')) return
    try {
      await testDriveApi.delete(id)
      setData((prev) => prev.filter((item) => item.id !== id))
      toast.success('Đã xóa')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  const filtered = data
    .filter((item) => tab === 'all' || item.status === tab.toUpperCase())
    .filter((item) =>
      search === '' ||
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.modelName?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Đăng ký lái thử</h1>
          <p className="text-neutral-500 text-sm mt-1">{data.length} tổng cộng</p>
        </div>
        <Button onClick={fetch} variant="outline" size="sm" className="rounded-none gap-2">
          <RefreshCw size={14} /> Tải lại
        </Button>
      </div>

      <div className="bg-white border border-neutral-200">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Tìm theo tên, SĐT, dòng xe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-none sm:max-w-xs"
          />
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="rounded-none h-9">
              <TabsTrigger value="all" className="rounded-none text-xs">Tất cả</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-none text-xs">Chờ</TabsTrigger>
              <TabsTrigger value="confirmed" className="rounded-none text-xs">Đã xác nhận</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-none text-xs">Hoàn thành</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">Không có dữ liệu</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dòng xe</TableHead>
                  <TableHead>Ngày / Giờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-black">{item.fullName}</p>
                        <p className="text-xs text-neutral-400">{item.phone}</p>
                        {item.email && <p className="text-xs text-neutral-400">{item.email}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-600">{item.modelName || '—'}</TableCell>
                    <TableCell className="text-sm text-neutral-600">
                      {item.preferredDate} {item.preferredTime && `• ${item.preferredTime}`}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        onValueChange={(val) => val && handleStatusChange(item.id, val)}
                      >
                        <SelectTrigger className={`rounded-none h-7 text-xs w-36 border ${STATUS_COLORS[item.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-400">
                      {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy') : '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 p-0 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
