import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { CarModel, CarPromotion } from '@/lib/types'
import ModelDetailClient from './ModelDetailClient'

const BACKEND = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : 'http://localhost:8080/api'

const FALLBACK_MODELS: Record<string, CarModel> = {
  'tiguan-facelift':      { id: 1,  name: 'Tiguan Facelift',      slug: 'tiguan-facelift',      category: 'SUV',       price: 1699000000, priceDisplay: '1.699.000.000', shortDescription: 'SUV đô thị thông minh, thiết kế facelift mới nhất với công nghệ IQ.DRIVE.', description: 'Volkswagen Tiguan Facelift là chiếc SUV đô thị được thiết kế lại theo ngôn ngữ IQ. mới nhất. Đèn LED ma trận IQ.Light, lưới tản nhiệt phẳng và cản trước/sau hoàn toàn mới tạo nên diện mạo sắc sảo, hiện đại.\n\nNội thất trang bị Digital Cockpit Pro 10 inch, màn hình cảm ứng 9.2 inch, hệ thống IQ.DRIVE đầy đủ gồm Lane Assist, Front Assist và Adaptive Cruise Control.', engine: '1.5L TSI EVO', power: '150 mã lực', torque: '250 Nm', seats: 5, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: 'GVbe1KgEmAU', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'teramont-usa-base':    { id: 2,  name: 'Teramont USA Base',    slug: 'teramont-usa-base',    category: 'SUV',       price: 1999000000, priceDisplay: '1.999.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Base, chất lượng tiêu chuẩn Bắc Mỹ.', description: 'Teramont USA Base nhập khẩu nguyên chiếc từ Mỹ, đáp ứng tiêu chuẩn sản xuất Bắc Mỹ nghiêm ngặt. Không gian nội thất rộng rãi với 3 hàng ghế thoải mái, đặc biệt hàng ghế 3 đủ rộng cho người lớn.\n\nĐộng cơ 2.0L TSI mạnh mẽ kết hợp hộp số DSG 7 cấp, hệ thống an toàn IQ.DRIVE chuẩn Mỹ.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: '93RZ0hXDbvQ', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'teramont-usa-limited': { id: 3,  name: 'Teramont USA Limited', slug: 'teramont-usa-limited', category: 'SUV',       price: 2299000000, priceDisplay: '2.299.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Limited với trang bị cao cấp vượt trội.', description: 'Teramont USA Limited là phiên bản cao cấp hơn của dòng Teramont nhập Mỹ. Nội thất ghế da cao cấp, cửa sổ trời panorama toàn cảnh, mâm 20 inch và hệ thống âm thanh 8 loa preMIUM.\n\nDẫn động 4 bánh 4Motion AWD toàn thời gian, camera 360°, Head-up Display và sạc không dây chuẩn Qi.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: 'LbLNp-fTnJg', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'teramont-president':   { id: 4,  name: 'Teramont President',   slug: 'teramont-president',   category: 'SUV',       price: 2499000000, priceDisplay: '2.499.000.000', shortDescription: 'SUV 7 chỗ phiên bản President — đỉnh cao sang trọng của dòng Teramont.', description: 'Teramont President là phiên bản tối thượng, được trang bị những tiện nghi sang trọng nhất. Da Nappa cao cấp, ốp gỗ thực, đèn viền 30 màu và ghế massage hàng trước.\n\nMàn hình trung tâm 12 inch, Digital Cockpit Pro 10.25 inch, Head-up Display và camera 360° là tiêu chuẩn. Cửa sổ trời toàn cảnh 2 tầng mang ánh sáng tràn ngập không gian.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: '3f3MIgXjqLc', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'teramont-x-platinum':  { id: 5,  name: 'Teramont X Platinum',  slug: 'teramont-x-platinum',  category: 'SUV',       price: 2349000000, priceDisplay: '2.349.000.000', shortDescription: 'SUV 7 chỗ Teramont X phiên bản Platinum sang trọng tột cùng.', description: 'Teramont X Platinum là phiên bản cao cấp nhất của Teramont X, tích hợp hệ thống âm thanh Dynaudio 12 loa 480W. Nội thất da Nappa, ốp gỗ thực và chrome toàn bộ, đẳng cấp không kém xe hạng sang.\n\nMàn hình trung tâm 12 inch kết hợp Digital Cockpit Pro 10.25 inch. Panoramic sunroof và đèn viền 30 màu.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: '-BukoMPoDCs', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'viloran-premium':      { id: 6,  name: 'Viloran Premium',      slug: 'viloran-premium',      category: 'MPV',       price: 1799000000, priceDisplay: '1.799.000.000', shortDescription: 'MPV sang trọng phiên bản Premium cho gia đình hiện đại.', description: 'Viloran Premium mang đến không gian MPV rộng rãi với 3 hàng ghế thoải mái. Điều hòa 3 vùng độc lập, 6 cổng USB toàn xe và màn hình giải trí 9.2 inch.\n\nHệ thống an toàn IQ.DRIVE đầy đủ, thiết kế ngoại thất sang trọng với đèn LED và mâm 18 inch thể thao.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: 'D9L3oHC4aa0', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'viloran-luxury':       { id: 7,  name: 'Viloran Luxury',       slug: 'viloran-luxury',       category: 'MPV',       price: 2099000000, priceDisplay: '2.099.000.000', shortDescription: 'MPV executive phiên bản Luxury — trải nghiệm di chuyển đẳng cấp hạng nhất.', description: 'Viloran Luxury là phiên bản cao cấp nhất, biến mỗi chuyến đi thành trải nghiệm hạng nhất. Ghế hàng 2 kiểu thương gia có mát-xa 10 điểm, chỉnh điện và để chân đầy đủ.\n\nĐèn viền nội thất 30 màu, kính cách âm 2 lớp và hệ thống thông gió chủ động. Mái kính panorama toàn cảnh và âm thanh cao cấp.', engine: '2.0L TSI', power: '220 mã lực', torque: '350 Nm', seats: 7, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: 'PKg4sT5ErdA', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'golf-15-etsi':         { id: 8,  name: 'Golf 1.5 eTSI',        slug: 'golf-15-etsi',         category: 'Hatchback', price: 797000000,  priceDisplay: '797.000.000',   shortDescription: 'Hatchback thể thao tiết kiệm nhiên liệu với công nghệ eTSI Mild Hybrid.', description: 'Golf 1.5 eTSI trang bị công nghệ mild hybrid 48V, giảm tiêu hao nhiên liệu đến 15% so với phiên bản thường. Động cơ 1.5L TSI EVO kết hợp hộp số DSG 7 cấp mang lại trải nghiệm lái thú vị và tiết kiệm.\n\nThiết kế hatchback thể thao trẻ trung, Digital Cockpit 10 inch và màn hình cảm ứng 8.25 inch. Đèn LED matrix và mâm 16 inch thể thao.', engine: '1.5L eTSI', power: '130 mã lực', torque: '200 Nm', seats: 5, fuelType: 'Xăng Hybrid', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: 'oQp9KxVqiuQ', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'golf-20':              { id: 9,  name: 'Golf 2.0',             slug: 'golf-20',              category: 'Hatchback', price: 1898000000, priceDisplay: '1.898.000.000', shortDescription: 'Hatchback hiệu suất cao với động cơ 2.0 TSI mạnh mẽ và body kit R-Line thể thao.', description: 'Golf 2.0 TSI là phiên bản hiệu suất cao nhất của dòng Golf tại Việt Nam. Động cơ 2.0L TSI mạnh mẽ kết hợp hộp số DSG 7 cấp cho khả năng tăng tốc ấn tượng.\n\nBody kit R-Line thể thao, mâm 18 inch đen bóng, nội thất sport với ghế racing và vô lăng thể thao. Hệ thống lái thể thao Progressive Steering.', engine: '2.0L TSI', power: '190 mã lực', torque: '320 Nm', seats: 5, fuelType: 'Xăng', transmission: 'DSG 7 cấp', imageUrl: '', videoUrl: 'y9MeLRO1sIs', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'touareg-elegance':     { id: 10, name: 'Touareg Elegance',     slug: 'touareg-elegance',     category: 'SUV',       price: 2899000000, priceDisplay: '2.899.000.000', shortDescription: 'SUV flagship phiên bản Elegance tinh tế, kết hợp sang trọng và công nghệ.', description: 'Touareg Elegance mang ngôn ngữ thiết kế thanh lịch với Innovision Cockpit màn hình cong 15 inch. Ngoại thất mâm 19 inch chrome, lưới tản nhiệt mạ bạc và đèn LED matrix tinh tế.\n\nHệ thống treo khí 4 cấp, động cơ V6 TDI 3.0L mạnh mẽ và dẫn động 4Motion. Air suspension cho phép thay đổi độ cao gầm theo địa hình.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Xăng', transmission: 'Tiptronic 8 cấp', imageUrl: '', videoUrl: 'do_O-fuB-RE', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'touareg-rline':        { id: 11, name: 'Touareg R-Line',       slug: 'touareg-rline',        category: 'SUV',       price: 2999000000, priceDisplay: '2.999.000.000', shortDescription: 'SUV flagship phiên bản R-Line thể thao mạnh mẽ, cá tính vượt trội.', description: 'Touareg R-Line mang phong cách thể thao với body kit R-Line đặc trưng, mâm 20 inch đen bóng và hệ thống xả thể thao đôi. Nội thất sport với đường chỉ khâu màu đỏ và vô lăng thể thao.\n\n5 chế độ lái từ Eco đến Off-road, hệ thống treo khí và dẫn động 4Motion AWD toàn thời gian.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Xăng', transmission: 'Tiptronic 8 cấp', imageUrl: '', videoUrl: 'uJoRgj_b8ZY', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
  'touareg-highline':     { id: 12, name: 'Touareg Highline',     slug: 'touareg-highline',     category: 'SUV',       price: 3499000000, priceDisplay: '3.499.000.000', shortDescription: 'SUV flagship phiên bản Highline — tích hợp mọi công nghệ đỉnh cao nhất.', description: 'Touareg Highline là phiên bản tối thượng, tích hợp toàn bộ công nghệ cao cấp nhất của Volkswagen. Head-up Display thực tế tăng cường AR, ghế massage 10 điểm và thông gió chủ động.\n\nNight Vision, Bose Surround 14 loa, da Nappa toàn bộ và ốp gỗ thực. Mâm 21 inch và cản thể thao tạo nên tổng thể đẳng cấp tối thượng.', engine: '3.0L V6 TDI', power: '231 mã lực', torque: '500 Nm', seats: 5, fuelType: 'Xăng', transmission: 'Tiptronic 8 cấp', imageUrl: '', videoUrl: '83qH1PkYUVo', images: [], sortOrder: 0, featured: true, active: true, createdAt: '' },
}

async function fetchModel(slug: string): Promise<CarModel | null> {
  try {
    const res = await fetch(`${BACKEND}/models/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchPromotion(slug: string): Promise<CarPromotion | null> {
  try {
    const res = await fetch(`${BACKEND}/models/${slug}/promotion`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const BASE_URL = 'https://volkswagenanphu.vn'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const model = await fetchModel(slug) ?? FALLBACK_MODELS[slug] ?? null
  if (!model) return { title: 'Dòng xe | Volkswagen An Phú' }
  return {
    title: `${model.name} — Giá & Thông số kỹ thuật | Volkswagen An Phú`,
    description: model.shortDescription,
    alternates: { canonical: `${BASE_URL}/models/${slug}` },
    openGraph: {
      title: `${model.name} | Volkswagen An Phú`,
      description: model.shortDescription,
      url: `${BASE_URL}/models/${slug}`,
      ...(model.imageUrl ? { images: [{ url: model.imageUrl, width: 1200, height: 630, alt: model.name }] } : {}),
    },
  }
}

export default async function ModelDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [model, promotion] = await Promise.all([
    fetchModel(slug),
    fetchPromotion(slug),
  ])
  const resolvedModel = model ?? FALLBACK_MODELS[slug] ?? null
  if (!resolvedModel) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Volkswagen ${resolvedModel.name}`,
    description: resolvedModel.shortDescription,
    brand: { '@type': 'Brand', name: 'Volkswagen' },
    ...(resolvedModel.imageUrl ? { image: resolvedModel.imageUrl } : {}),
    offers: {
      '@type': 'Offer',
      price: resolvedModel.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/models/${slug}`,
      seller: { '@type': 'AutoDealer', name: 'Volkswagen An Phú' },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ModelDetailClient model={resolvedModel} promotion={promotion} />
    </>
  )
}
