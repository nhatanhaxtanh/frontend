'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { carModelApi } from '@/lib/api'
import type { CarModel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Fuel, Users, Zap, Settings2, Gauge, GitMerge, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getModelImage } from '@/lib/model-images'
import { cn } from '@/lib/utils'

const HIGHLIGHTS: Record<string, { title: string; description: string }[]> = {
  'tiguan-2024': [
    { title: 'IQ.DRIVE', description: 'Hệ thống hỗ trợ lái thông minh: hỗ trợ giữ làn, phanh khẩn cấp, kiểm soát hành trình thích ứng.' },
    { title: 'Digital Cockpit Pro', description: 'Buồng lái kỹ thuật số với màn hình 10 inch tích hợp, hiển thị thông tin trực quan.' },
    { title: 'Động cơ TSI', description: 'Động cơ tăng áp tiên tiến, mạnh mẽ nhưng tiết kiệm nhiên liệu vượt trội.' },
  ],
  'teramont-2024': [
    { title: '7 chỗ rộng rãi', description: 'Không gian nội thất thoải mái cho cả gia đình, hàng ghế thứ 3 đủ rộng cho người lớn.' },
    { title: 'Panorama Roof', description: 'Cửa sổ trời toàn cảnh mang lại cảm giác khoáng đạt, tràn ngập ánh sáng tự nhiên.' },
    { title: 'Hệ thống 4Motion', description: 'Dẫn động 4 bánh thông minh, tự động phân phối lực kéo tối ưu trên mọi địa hình.' },
  ],
  'teramont-x-2024': [
    { title: 'Dynaudio Premium', description: 'Hệ thống âm thanh Dynaudio 12 loa, mang lại trải nghiệm âm nhạc như phòng hòa nhạc.' },
    { title: 'Nội thất Platinum', description: 'Da Nappa cao cấp, ốp gỗ thực và chrome toàn bộ, đẳng cấp không kém xe sang.' },
    { title: 'Màn hình 12 inch', description: 'Màn hình giải trí trung tâm 12 inch kết hợp Digital Cockpit Pro 10.25 inch.' },
  ],
  'touareg-2024': [
    { title: 'Innovision Cockpit', description: 'Buồng lái sáng tạo với màn hình cong 15 inch, xóa bỏ hoàn toàn các nút vật lý.' },
    { title: 'Air Suspension', description: 'Hệ thống treo khí điều chỉnh độ cao gầm, thay đổi linh hoạt theo chế độ lái.' },
    { title: 'V6 TDI', description: 'Động cơ diesel V6 3.0L, 231 mã lực, mô-men xoắn 500 Nm — hiệu suất đỉnh cao.' },
  ],
  'viloran-2024': [
    { title: 'Executive Lounge', description: 'Ghế thương gia hàng 2 có chức năng mát-xa, điều chỉnh điện và để chân thư giãn.' },
    { title: 'Ambient Lighting', description: '30 màu đèn viền nội thất tạo không gian sang trọng, thay đổi theo tâm trạng.' },
    { title: 'Cách âm vượt trội', description: 'Kính cách âm 2 lớp và vật liệu hút âm cao cấp, tạo cabin yên tĩnh tuyệt đối.' },
  ],
}

const FALLBACK_MODELS: Record<string, CarModel> = {
  'tiguan-2024': { id: 1, name: 'Tiguan 2024', slug: 'tiguan-2024', category: 'SUV', price: 1699000000, priceDisplay: '1.699.000.000', shortDescription: 'SUV đô thị thông minh, kết hợp hoàn hảo giữa thiết kế tinh tế và công nghệ hiện đại.', description: 'Volkswagen Tiguan 2024 là chiếc SUV đô thị được thiết kế cho những người yêu thích sự năng động và hiện đại. Với ngoại hình được cập nhật theo ngôn ngữ thiết kế IQ. mới nhất, Tiguan 2024 mang đến vẻ ngoài sắc sảo và đầy cá tính.\n\nNội thất được trang bị hệ thống Digital Cockpit Pro với màn hình kỹ thuật số 10 inch, màn hình cảm ứng trung tâm 8 inch và vô lăng đa chức năng. Hệ thống IQ.DRIVE tích hợp nhiều tính năng hỗ trợ lái an toàn như Lane Assist, Front Assist và Adaptive Cruise Control.', engine: '1.4L TSI EVO', power: '150 mã lực', torque: '250 Nm', seats: 5, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'teramont-2024': { id: 2, name: 'Teramont 2024', slug: 'teramont-2024', category: 'SUV', price: 2199000000, priceDisplay: '2.199.000.000', shortDescription: 'SUV 7 chỗ rộng rãi, lý tưởng cho gia đình hiện đại.', description: 'Volkswagen Teramont 2024 là chiếc SUV 7 chỗ cao cấp, mang đến không gian nội thất rộng rãi và thoải mái cho cả gia đình. Thiết kế ngoại thất mạnh mẽ với lưới tản nhiệt rộng và đèn LED sắc nét tạo nên diện mạo sang trọng và hiện đại.\n\nHàng ghế thứ 3 đủ rộng cho người lớn, tích hợp cổng sạc USB và điều hòa hàng sau độc lập. Cốp xe rộng với tính năng mở bằng chân thông minh.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'teramont-x-2024': { id: 3, name: 'Teramont X 2024', slug: 'teramont-x-2024', category: 'SUV', price: 2349000000, priceDisplay: '2.349.000.000', shortDescription: 'SUV 7 chỗ phiên bản Platinum đỉnh cao.', description: 'Volkswagen Teramont X Platinum 2024 là phiên bản cao cấp nhất của dòng Teramont, được trang bị những tiện nghi sang trọng nhất. Nội thất bọc da Nappa cao cấp, ốp gỗ thực và hệ thống âm thanh Dynaudio 12 loa mang lại trải nghiệm như phòng hòa nhạc.\n\nMàn hình trung tâm 12 inch kết hợp Digital Cockpit Pro 10.25 inch tạo nên buồng lái kỹ thuật số toàn diện. Panoramic sunroof toàn cảnh và đèn viền nội thất 30 màu.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'touareg-2024': { id: 4, name: 'Touareg 2024', slug: 'touareg-2024', category: 'SUV', price: 2999000000, priceDisplay: '2.999.000.000', shortDescription: 'SUV flagship đỉnh cao, biểu tượng của sự sang trọng và quyền năng.', description: 'Volkswagen Touareg 2024 là flagship SUV của Volkswagen, đại diện cho đỉnh cao công nghệ và sang trọng của thương hiệu. Innovision Cockpit với màn hình cong 15 inch là tâm điểm của khoang lái, xóa bỏ hoàn toàn các nút vật lý truyền thống.\n\nHệ thống treo khí 4 cấp điều chỉnh độ cao gầm xe linh hoạt, thích nghi với mọi loại địa hình. Động cơ diesel V6 3.0L mạnh mẽ kết hợp hệ thống dẫn động 4Motion đem lại khả năng vận hành vượt trội.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Diesel', transmission: 'Tiptronic 8 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'viloran-2024': { id: 5, name: 'Viloran 2024', slug: 'viloran-2024', category: 'MPV', price: 1999000000, priceDisplay: '1.999.000.000', shortDescription: 'MPV sang trọng bậc nhất, không gian executive cho gia đình hiện đại.', description: 'Volkswagen Viloran 2024 là chiếc MPV sang trọng được thiết kế đặc biệt cho thị trường châu Á. Với không gian nội thất rộng rãi và đẳng cấp, Viloran mang đến trải nghiệm di chuyển như một phòng khách di động.\n\nGhế hàng 2 kiểu thương gia với chức năng mát-xa, điều chỉnh điện và ngả phẳng hoàn toàn. Hệ thống cách âm vượt trội với kính 2 lớp tạo nên không gian yên tĩnh tuyệt đối.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
}

const DEFAULT_HIGHLIGHTS = [
  { title: 'Công nghệ tiên tiến', description: 'Tích hợp các công nghệ hỗ trợ lái an toàn và giải trí hiện đại nhất của Volkswagen.' },
  { title: 'Thiết kế Đức', description: 'Ngôn ngữ thiết kế IQ. tinh tế, kết hợp giữa thẩm mỹ và khí động học.' },
  { title: 'Hiệu suất vượt trội', description: 'Động cơ TSI/TDI tối ưu cân bằng giữa sức mạnh và tiết kiệm nhiên liệu.' },
]

export default function ModelDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [model, setModel] = useState<CarModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [sticky, setSticky] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slug) return
    carModelApi.getBySlug(slug)
      .then((res) => setModel(res.data))
      .catch(() => setModel(FALLBACK_MODELS[slug] ?? null))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) setSticky(window.scrollY > heroRef.current.offsetHeight - 80)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!model) {
    return (
      <div className="pt-16 min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Không tìm thấy xe</h1>
        <Link href="/models">
          <Button variant="outline" className="rounded-none"><ArrowLeft size={16} className="mr-2" /> Quay lại</Button>
        </Link>
      </div>
    )
  }

  const mainImage = getModelImage(model.slug, model.imageUrl)
  const gallery: string[] = model.images?.length
    ? model.images
    : [mainImage, mainImage, mainImage]

  const highlights = HIGHLIGHTS[model.slug] ?? DEFAULT_HIGHLIGHTS

  const specs = [
    { icon: Zap, label: 'Công suất', value: model.power || '—' },
    { icon: Gauge, label: 'Mô-men xoắn', value: model.torque || '—' },
    { icon: Settings2, label: 'Động cơ', value: model.engine || '—' },
    { icon: GitMerge, label: 'Hộp số', value: model.transmission || '—' },
    { icon: Users, label: 'Số chỗ', value: model.seats ? `${model.seats} chỗ` : '—' },
    { icon: Fuel, label: 'Nhiên liệu', value: model.fuelType || '—' },
  ]

  return (
    <div className="pt-16">
      {/* Sticky bar */}
      <AnimatePresence>
        {sticky && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-neutral-200 shadow-sm"
          >
            <div className="container mx-auto px-6 max-w-7xl h-14 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/models" className="text-neutral-400 hover:text-black transition-colors">
                  <ArrowLeft size={16} />
                </Link>
                <span className="font-bold text-black">{model.name}</span>
                <span className="text-neutral-400 text-sm hidden md:block">Từ {model.priceDisplay}₫</span>
              </div>
              <div className="flex gap-3">
                <Link href="/lien-he">
                  <Button variant="outline" size="sm" className="rounded-none text-xs uppercase tracking-wide hidden md:flex">Nhận báo giá</Button>
                </Link>
                <Link href="/dang-ky-lai-thu">
                  <Button size="sm" className="rounded-none text-xs uppercase tracking-wide">Lái thử</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div ref={heroRef} className="bg-neutral-950 py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <Link href="/models" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-10 transition-colors">
            <ArrowLeft size={14} /> Tất cả dòng xe
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">{model.category}</span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4">{model.name}</h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6">{model.shortDescription}</p>
              <p className="text-2xl font-bold text-white mb-8">Từ <span className="text-3xl">{model.priceDisplay}</span>₫</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dang-ky-lai-thu">
                  <Button className="rounded-none bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs font-semibold px-8 h-12 w-full sm:w-auto">
                    Đăng ký lái thử
                  </Button>
                </Link>
                <Link href="/lien-he">
                  <Button variant="outline" className="rounded-none border-neutral-700 text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs font-semibold px-8 h-12 bg-transparent w-full sm:w-auto">
                    Nhận báo giá
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer group"
              onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}
            >
              <Image src={mainImage} alt={model.name} fill priority className="object-cover object-center group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-white px-4 py-2">Xem ảnh</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick specs bar */}
      <div className="bg-black">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-neutral-800">
            {specs.map((s) => (
              <div key={s.label} className="px-6 py-5 text-center">
                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-white font-bold text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-neutral-100 py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-black">Hình ảnh</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                className="w-9 h-9 border border-neutral-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setGalleryIndex((i) => (i + 1) % gallery.length)}
                className="w-9 h-9 border border-neutral-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {gallery.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className={cn(
                  'relative overflow-hidden cursor-pointer group bg-neutral-200',
                  i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'
                )}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
              >
                <Image
                  src={img}
                  alt={`${model.name} ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={cn('h-1 transition-all', galleryIndex === i ? 'bg-black w-8' : 'bg-neutral-300 w-4')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Điểm nổi bật</span>
              <h2 className="text-4xl font-bold text-black mt-2 mb-10">Tại sao chọn<br />{model.name}?</h2>
              <div className="space-y-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="font-bold text-black mb-1">{h.title}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-[4/3] overflow-hidden bg-neutral-100"
            >
              <Image src={mainImage} alt={model.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full specs table */}
      <div className="bg-neutral-50 py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-black mb-10">Thông số kỹ thuật</h2>
            <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
              {[
                { label: 'Động cơ', value: model.engine },
                { label: 'Công suất tối đa', value: model.power },
                { label: 'Mô-men xoắn', value: model.torque },
                { label: 'Hộp số', value: model.transmission },
                { label: 'Nhiên liệu', value: model.fuelType },
                { label: 'Số chỗ ngồi', value: model.seats ? `${model.seats} chỗ` : null },
                { label: 'Phân khúc', value: model.category },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="grid grid-cols-2 px-6 py-4">
                  <span className="text-neutral-500 text-sm">{row.label}</span>
                  <span className="text-black font-medium text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Description */}
      {model.description && (
        <div className="bg-white py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-black mb-6">Giới thiệu</h2>
            <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap text-base">{model.description}</div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-neutral-950 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Bước tiếp theo</span>
              <h3 className="text-4xl font-bold text-white mt-2 mb-4">Quan tâm đến<br />{model.name}?</h3>
              <p className="text-neutral-400 leading-relaxed">Đặt lịch lái thử miễn phí hoặc liên hệ chuyên viên tư vấn để nhận báo giá tốt nhất và các chương trình ưu đãi hiện hành.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link href="/dang-ky-lai-thu">
                <Button className="rounded-none bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs font-semibold px-10 h-12 w-full sm:w-auto">
                  Lái thử miễn phí
                </Button>
              </Link>
              <a href="tel:0981058232" className="w-full sm:w-auto">
                <Button variant="outline" className="rounded-none border-neutral-700 text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs font-semibold px-10 h-12 bg-transparent w-full">
                  <span className="mr-2">Gọi ngay</span> 098 105 8232
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center px-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-neutral-300" onClick={() => setLightboxOpen(false)}>
              <X size={28} />
            </button>
            <button className="absolute left-6 text-white hover:text-neutral-300 p-2" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length) }}>
              <ChevronLeft size={32} />
            </button>
            <div className="relative w-full max-w-4xl aspect-[16/9]" onClick={(e) => e.stopPropagation()}>
              <Image src={gallery[lightboxIndex]} alt={model.name} fill className="object-contain" sizes="100vw" />
            </div>
            <button className="absolute right-6 text-white hover:text-neutral-300 p-2" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % gallery.length) }}>
              <ChevronRight size={32} />
            </button>
            <div className="absolute bottom-6 text-neutral-500 text-sm">{lightboxIndex + 1} / {gallery.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
