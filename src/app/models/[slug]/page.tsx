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
  'tiguan-facelift': [
    { title: 'IQ.DRIVE', description: 'Hệ thống hỗ trợ lái thông minh: giữ làn, phanh khẩn cấp, kiểm soát hành trình thích ứng.' },
    { title: 'Digital Cockpit Pro', description: 'Buồng lái kỹ thuật số với màn hình 10 inch, hiển thị thông tin trực quan hoàn toàn.' },
    { title: 'Thiết kế Facelift', description: 'Ngôn ngữ thiết kế IQ. mới nhất, đèn LED ma trận IQ.Light và lưới tản nhiệt phẳng hiện đại.' },
  ],
  'teramont-usa-base': [
    { title: 'Nhập khẩu Mỹ', description: 'Tiêu chuẩn sản xuất Bắc Mỹ nghiêm ngặt, chất lượng vượt trội so với xe lắp ráp trong nước.' },
    { title: '7 chỗ rộng rãi', description: 'Không gian nội thất thoải mái cho cả gia đình, hàng ghế thứ 3 đủ rộng cho người lớn.' },
    { title: 'Hệ thống an toàn', description: 'Đầy đủ gói an toàn IQ.DRIVE, phanh khẩn cấp, cảnh báo điểm mù và hỗ trợ đỗ xe.' },
  ],
  'teramont-usa-limited': [
    { title: 'Phiên bản Limited', description: 'Trang bị vượt trội so với Base: ghế da cao cấp, cửa sổ trời panorama và mâm 20 inch.' },
    { title: 'Hệ thống giải trí', description: 'Màn hình 8 inch, kết nối Apple CarPlay/Android Auto không dây, âm thanh 8 loa cao cấp.' },
    { title: '4Motion AWD', description: 'Dẫn động 4 bánh toàn thời gian, phân phối lực kéo thông minh trên mọi địa hình.' },
  ],
  'teramont-president': [
    { title: 'Đỉnh cao sang trọng', description: 'Phiên bản President: nội thất da Nappa, ốp gỗ thực, đèn viền 30 màu và ghế massage.' },
    { title: 'Màn hình 12 inch', description: 'Hệ thống giải trí 12 inch kết hợp Digital Cockpit Pro 10.25 inch toàn màn hình.' },
    { title: 'Công nghệ Premium', description: 'Head-up Display, camera 360°, cửa sổ trời toàn cảnh 2 tầng và sạc không dây.' },
  ],
  'teramont-x-platinum': [
    { title: 'Dynaudio Premium', description: 'Hệ thống âm thanh Dynaudio 12 loa 480W, trải nghiệm âm nhạc như phòng hòa nhạc.' },
    { title: 'Nội thất Platinum', description: 'Da Nappa cao cấp, ốp gỗ thực và chrome toàn bộ, đẳng cấp không kém xe hạng sang.' },
    { title: 'Màn hình 12 inch', description: 'Màn hình trung tâm 12 inch kết hợp Digital Cockpit Pro 10.25 inch hiện đại.' },
  ],
  'viloran-premium': [
    { title: 'Không gian rộng rãi', description: '3 hàng ghế thoải mái, cốp rộng, điều hòa 3 vùng độc lập cho toàn bộ hành khách.' },
    { title: 'Công nghệ kết nối', description: 'Màn hình 9.2 inch, Apple CarPlay/Android Auto không dây, 6 cổng USB toàn xe.' },
    { title: 'An toàn toàn diện', description: 'IQ.DRIVE đầy đủ: Lane Assist, Front Assist, Blind Spot Monitor và Park Assist.' },
  ],
  'viloran-luxury': [
    { title: 'Executive Lounge', description: 'Ghế hàng 2 kiểu thương gia có mát-xa, chỉnh điện và để chân — trải nghiệm hạng nhất.' },
    { title: 'Ambient Lighting', description: '30 màu đèn viền nội thất tạo không gian sang trọng, thay đổi theo tâm trạng.' },
    { title: 'Cách âm vượt trội', description: 'Kính cách âm 2 lớp và vật liệu hút âm cao cấp, cabin yên tĩnh tuyệt đối.' },
  ],
  'golf-15-etsi': [
    { title: 'eTSI Mild Hybrid', description: 'Công nghệ mild hybrid 48V tiết kiệm nhiên liệu đến 15%, vẫn đủ mạnh mẽ cho đô thị.' },
    { title: 'Thiết kế Sport', description: 'Thiết kế hatchback thể thao trẻ trung, mâm 16 inch, đèn LED và lưới tản nhiệt thể thao.' },
    { title: 'Digital Cockpit', description: 'Buồng lái kỹ thuật số với màn hình 10 inch và màn hình cảm ứng trung tâm 8.25 inch.' },
  ],
  'golf-20': [
    { title: 'Động cơ 2.0 TSI', description: 'Động cơ 2.0L TSI mạnh mẽ, cung cấp hiệu suất lái thú vị trên mọi cung đường.' },
    { title: 'DSG 7 cấp', description: 'Hộp số ly hợp kép DSG 7 cấp phản hồi nhanh, chuyển số êm ái và chính xác.' },
    { title: 'R-Line Body Kit', description: 'Body kit thể thao R-Line, mâm 18 inch, hệ thống xả thể thao và nội thất sport.' },
  ],
  'touareg-elegance': [
    { title: 'Innovision Cockpit', description: 'Màn hình cong 15 inch không viền, xóa bỏ hoàn toàn các nút vật lý truyền thống.' },
    { title: 'Air Suspension', description: 'Treo khí 4 cấp điều chỉnh độ cao gầm linh hoạt, thích nghi với mọi loại địa hình.' },
    { title: 'Thiết kế Elegance', description: 'Ngoại thất thanh lịch với mâm 19 inch chrome, lưới tản nhiệt mạ bạc và đèn LED matrix.' },
  ],
  'touareg-rline': [
    { title: 'R-Line Sport', description: 'Body kit thể thao R-Line, mâm 20 inch đen bóng, hệ thống xả thể thao đôi.' },
    { title: 'Chế độ lái', description: '5 chế độ lái: Eco, Comfort, Normal, Sport, Off-road — tùy chỉnh hoàn toàn trải nghiệm.' },
    { title: 'Động cơ mạnh mẽ', description: 'V6 TDI 3.0L 231 mã lực kết hợp 4Motion AWD, sẵn sàng chinh phục mọi địa hình.' },
  ],
  'touareg-highline': [
    { title: 'Highline tối thượng', description: 'Phiên bản cao nhất dòng Touareg, tích hợp mọi công nghệ và tiện nghi hàng đầu.' },
    { title: 'Head-up Display AR', description: 'Màn hình HUD thực tế tăng cường chiếu thông tin dẫn đường lên kính chắn gió.' },
    { title: 'Massage & Ventilation', description: 'Ghế trước mát-xa 10 điểm và thông gió chủ động, thoải mái trong mọi hành trình.' },
  ],
}

const FALLBACK_MODELS: Record<string, CarModel> = {
  'tiguan-facelift':      { id: 1,  name: 'Tiguan Facelift',      slug: 'tiguan-facelift',      category: 'SUV',       price: 1699000000, priceDisplay: '1.699.000.000', shortDescription: 'SUV đô thị thông minh, thiết kế facelift mới nhất với công nghệ IQ.DRIVE.', description: 'Volkswagen Tiguan Facelift là chiếc SUV đô thị được thiết kế lại theo ngôn ngữ IQ. mới nhất. Đèn LED ma trận IQ.Light, lưới tản nhiệt phẳng và cản trước/sau hoàn toàn mới tạo nên diện mạo sắc sảo, hiện đại.\n\nNội thất trang bị Digital Cockpit Pro 10 inch, màn hình cảm ứng 9.2 inch, hệ thống IQ.DRIVE đầy đủ gồm Lane Assist, Front Assist và Adaptive Cruise Control.', engine: '1.5L TSI EVO', power: '150 mã lực', torque: '250 Nm', seats: 5, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'teramont-usa-base':    { id: 2,  name: 'Teramont USA Base',    slug: 'teramont-usa-base',    category: 'SUV',       price: 1999000000, priceDisplay: '1.999.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Base, chất lượng tiêu chuẩn Bắc Mỹ.', description: 'Teramont USA Base nhập khẩu nguyên chiếc từ Mỹ, đáp ứng tiêu chuẩn sản xuất Bắc Mỹ nghiêm ngặt. Không gian nội thất rộng rãi với 3 hàng ghế thoải mái, đặc biệt hàng ghế 3 đủ rộng cho người lớn.\n\nĐộng cơ 2.0L TSI mạnh mẽ kết hợp hộp số DSG 7 cấp, hệ thống an toàn IQ.DRIVE chuẩn Mỹ.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'teramont-usa-limited': { id: 3,  name: 'Teramont USA Limited', slug: 'teramont-usa-limited', category: 'SUV',       price: 2299000000, priceDisplay: '2.299.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Limited với trang bị cao cấp vượt trội.', description: 'Teramont USA Limited là phiên bản cao cấp hơn của dòng Teramont nhập Mỹ. Nội thất ghế da cao cấp, cửa sổ trời panorama toàn cảnh, mâm 20 inch và hệ thống âm thanh 8 loa preMIUM.\n\nDẫn động 4 bánh 4Motion AWD toàn thời gian, camera 360°, Head-up Display và sạc không dây chuẩn Qi.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'teramont-president':   { id: 4,  name: 'Teramont President',   slug: 'teramont-president',   category: 'SUV',       price: 2499000000, priceDisplay: '2.499.000.000', shortDescription: 'SUV 7 chỗ phiên bản President — đỉnh cao sang trọng của dòng Teramont.', description: 'Teramont President là phiên bản tối thượng, được trang bị những tiện nghi sang trọng nhất. Da Nappa cao cấp, ốp gỗ thực, đèn viền 30 màu và ghế massage hàng trước.\n\nMàn hình trung tâm 12 inch, Digital Cockpit Pro 10.25 inch, Head-up Display và camera 360° là tiêu chuẩn. Cửa sổ trời toàn cảnh 2 tầng mang ánh sáng tràn ngập không gian.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'teramont-x-platinum':  { id: 5,  name: 'Teramont X Platinum',  slug: 'teramont-x-platinum',  category: 'SUV',       price: 2349000000, priceDisplay: '2.349.000.000', shortDescription: 'SUV 7 chỗ Teramont X phiên bản Platinum sang trọng tột cùng.', description: 'Teramont X Platinum là phiên bản cao cấp nhất của Teramont X, tích hợp hệ thống âm thanh Dynaudio 12 loa 480W. Nội thất da Nappa, ốp gỗ thực và chrome toàn bộ, đẳng cấp không kém xe hạng sang.\n\nMàn hình trung tâm 12 inch kết hợp Digital Cockpit Pro 10.25 inch. Panoramic sunroof và đèn viền 30 màu.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'viloran-premium':      { id: 6,  name: 'Viloran Premium',      slug: 'viloran-premium',      category: 'MPV',       price: 1799000000, priceDisplay: '1.799.000.000', shortDescription: 'MPV sang trọng phiên bản Premium cho gia đình hiện đại.', description: 'Viloran Premium mang đến không gian MPV rộng rãi với 3 hàng ghế thoải mái. Điều hòa 3 vùng độc lập, 6 cổng USB toàn xe và màn hình giải trí 9.2 inch.\n\nHệ thống an toàn IQ.DRIVE đầy đủ, thiết kế ngoại thất sang trọng với đèn LED và mâm 18 inch thể thao.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'viloran-luxury':       { id: 7,  name: 'Viloran Luxury',       slug: 'viloran-luxury',       category: 'MPV',       price: 2099000000, priceDisplay: '2.099.000.000', shortDescription: 'MPV executive phiên bản Luxury — trải nghiệm di chuyển đẳng cấp hạng nhất.', description: 'Viloran Luxury là phiên bản cao cấp nhất, biến mỗi chuyến đi thành trải nghiệm hạng nhất. Ghế hàng 2 kiểu thương gia có mát-xa 10 điểm, chỉnh điện và để chân đầy đủ.\n\nĐèn viền nội thất 30 màu, kính cách âm 2 lớp và hệ thống thông gió chủ động. Mái kính panorama toàn cảnh và âm thanh cao cấp.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'golf-15-etsi':         { id: 8,  name: 'Golf 1.5 eTSI',        slug: 'golf-15-etsi',         category: 'Hatchback', price: 797000000,  priceDisplay: '797.000.000',   shortDescription: 'Hatchback thể thao tiết kiệm nhiên liệu với công nghệ eTSI Mild Hybrid.', description: 'Golf 1.5 eTSI trang bị công nghệ mild hybrid 48V, giảm tiêu hao nhiên liệu đến 15% so với phiên bản thường. Động cơ 1.5L TSI EVO kết hợp hộp số DSG 7 cấp mang lại trải nghiệm lái thú vị và tiết kiệm.\n\nThiết kế hatchback thể thao trẻ trung, Digital Cockpit 10 inch và màn hình cảm ứng 8.25 inch. Đèn LED matrix và mâm 16 inch thể thao.', engine: '1.5L eTSI', power: '130 mã lực', torque: '200 Nm', seats: 5, fuelType: 'Xăng Hybrid', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'golf-20':              { id: 9,  name: 'Golf 2.0',             slug: 'golf-20',              category: 'Hatchback', price: 1898000000, priceDisplay: '1.898.000.000', shortDescription: 'Hatchback hiệu suất cao với động cơ 2.0 TSI mạnh mẽ và body kit R-Line thể thao.', description: 'Golf 2.0 TSI là phiên bản hiệu suất cao nhất của dòng Golf tại Việt Nam. Động cơ 2.0L TSI mạnh mẽ kết hợp hộp số DSG 7 cấp cho khả năng tăng tốc ấn tượng.\n\nBody kit R-Line thể thao, mâm 18 inch đen bóng, nội thất sport với ghế racing và vô lăng thể thao. Hệ thống lái thể thao Progressive Steering.', engine: '2.0L TSI', power: '190 mã lực', torque: '320 Nm', seats: 5, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'touareg-elegance':     { id: 10, name: 'Touareg Elegance',     slug: 'touareg-elegance',     category: 'SUV',       price: 2899000000, priceDisplay: '2.899.000.000', shortDescription: 'SUV flagship phiên bản Elegance tinh tế, kết hợp sang trọng và công nghệ.', description: 'Touareg Elegance mang ngôn ngữ thiết kế thanh lịch với Innovision Cockpit màn hình cong 15 inch. Ngoại thất mâm 19 inch chrome, lưới tản nhiệt mạ bạc và đèn LED matrix tinh tế.\n\nHệ thống treo khí 4 cấp, động cơ V6 TDI 3.0L mạnh mẽ và dẫn động 4Motion. Air suspension cho phép thay đổi độ cao gầm theo địa hình.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Diesel', transmission: 'Tiptronic 8 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'touareg-rline':        { id: 11, name: 'Touareg R-Line',       slug: 'touareg-rline',        category: 'SUV',       price: 2999000000, priceDisplay: '2.999.000.000', shortDescription: 'SUV flagship phiên bản R-Line thể thao mạnh mẽ, cá tính vượt trội.', description: 'Touareg R-Line mang phong cách thể thao với body kit R-Line đặc trưng, mâm 20 inch đen bóng và hệ thống xả thể thao đôi. Nội thất sport với đường chỉ khâu màu đỏ và vô lăng thể thao.\n\n5 chế độ lái từ Eco đến Off-road, hệ thống treo khí và dẫn động 4Motion AWD toàn thời gian.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Diesel', transmission: 'Tiptronic 8 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
  'touareg-highline':     { id: 12, name: 'Touareg Highline',     slug: 'touareg-highline',     category: 'SUV',       price: 3499000000, priceDisplay: '3.499.000.000', shortDescription: 'SUV flagship phiên bản Highline — tích hợp mọi công nghệ đỉnh cao nhất.', description: 'Touareg Highline là phiên bản tối thượng, tích hợp toàn bộ công nghệ cao cấp nhất của Volkswagen. Head-up Display thực tế tăng cường AR, ghế massage 10 điểm và thông gió chủ động.\n\nNight Vision, Bose Surround 14 loa, da Nappa toàn bộ và ốp gỗ thực. Mâm 21 inch và cản thể thao tạo nên tổng thể đẳng cấp tối thượng.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Diesel', transmission: 'Tiptronic 8 cấp', imageUrl: '', images: [], featured: true, active: true, createdAt: '' },
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

      {/* Video */}
      {model.videoUrl && (
        <div className="bg-black py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-white mb-8">Video</h2>
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${model.videoUrl}`}
                title={model.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
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
