import type { Metadata } from 'next'
import type { CarModel } from '@/lib/types'
import ModelsClient from './ModelsClient'

export const dynamic = 'force-dynamic'

const BACKEND = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : 'http://localhost:8080/api'

export const metadata: Metadata = {
  title: 'Khám phá dòng xe Volkswagen — Tiguan, Teramont, Touareg, Viloran, Golf',
  description: 'Danh sách đầy đủ các dòng xe Volkswagen chính hãng tại TP.HCM: Tiguan Facelift, Teramont, Touareg, Viloran, Golf. Xem giá, thông số kỹ thuật và đăng ký lái thử.',
  alternates: { canonical: 'https://volkswagenanphu.vn/models' },
  openGraph: {
    title: 'Dòng xe Volkswagen tại Volkswagen An Phú TP.HCM',
    description: 'SUV, MPV và Hatchback Volkswagen chính hãng. Tiguan từ 1.699 tỷ, Teramont từ 1.999 tỷ, Touareg từ 2.899 tỷ. Lái thử miễn phí tại showroom.',
    url: 'https://volkswagenanphu.vn/models',
  },
}

const FALLBACK: Partial<CarModel>[] = [
  { id: 1,  name: 'Tiguan Facelift',       slug: 'tiguan-facelift',       category: 'SUV',       priceDisplay: '1.699.000.000', shortDescription: 'SUV đô thị thông minh, thiết kế facelift mới nhất', seats: 5 },
  { id: 2,  name: 'Teramont USA Base',     slug: 'teramont-usa-base',     category: 'SUV',       priceDisplay: '1.999.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Base', seats: 7 },
  { id: 3,  name: 'Teramont USA Limited',  slug: 'teramont-usa-limited',  category: 'SUV',       priceDisplay: '2.299.000.000', shortDescription: 'SUV 7 chỗ nhập Mỹ phiên bản Limited cao cấp', seats: 7 },
  { id: 4,  name: 'Teramont President',    slug: 'teramont-president',    category: 'SUV',       priceDisplay: '2.499.000.000', shortDescription: 'SUV 7 chỗ phiên bản President đỉnh cao', seats: 7 },
  { id: 5,  name: 'Teramont X Platinum',   slug: 'teramont-x-platinum',   category: 'SUV',       priceDisplay: '2.349.000.000', shortDescription: 'SUV 7 chỗ Teramont X phiên bản Platinum', seats: 7 },
  { id: 6,  name: 'Viloran Premium',       slug: 'viloran-premium',       category: 'MPV',       priceDisplay: '1.799.000.000', shortDescription: 'MPV sang trọng phiên bản Premium', seats: 7 },
  { id: 7,  name: 'Viloran Luxury',        slug: 'viloran-luxury',        category: 'MPV',       priceDisplay: '2.099.000.000', shortDescription: 'MPV executive phiên bản Luxury tối thượng', seats: 7 },
  { id: 8,  name: 'Golf 1.5 eTSI',        slug: 'golf-15-etsi',          category: 'Hatchback', priceDisplay: '797.000.000',   shortDescription: 'Hatchback thể thao, tiết kiệm nhiên liệu', seats: 5 },
  { id: 9,  name: 'Golf 2.0',             slug: 'golf-20',               category: 'Hatchback', priceDisplay: '1.898.000.000', shortDescription: 'Hatchback hiệu suất cao động cơ 2.0 TSI', seats: 5 },
  { id: 10, name: 'Touareg Elegance',      slug: 'touareg-elegance',      category: 'SUV',       priceDisplay: '2.899.000.000', shortDescription: 'SUV flagship phiên bản Elegance tinh tế', seats: 5 },
  { id: 11, name: 'Touareg R-Line',        slug: 'touareg-rline',         category: 'SUV',       priceDisplay: '2.999.000.000', shortDescription: 'SUV flagship phiên bản R-Line thể thao', seats: 5 },
  { id: 12, name: 'Touareg Highline',      slug: 'touareg-highline',      category: 'SUV',       priceDisplay: '3.499.000.000', shortDescription: 'SUV flagship phiên bản Highline tối thượng', seats: 5 },
]

async function fetchModels(): Promise<Partial<CarModel>[]> {
  try {
    const res = await fetch(`${BACKEND}/models`, { cache: 'no-store' })
    if (!res.ok) return FALLBACK
    const data = await res.json()
    return data.length > 0 ? data : FALLBACK
  } catch {
    return FALLBACK
  }
}

export default async function ModelsPage() {
  const models = await fetchModels()
  return <ModelsClient models={models} />
}
