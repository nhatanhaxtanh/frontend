export interface CarHighlight {
  title: string
  description: string
}

export interface CarModel {
  id: number
  name: string
  slug: string
  category: string
  price: number
  priceDisplay: string
  priceEstimated?: boolean
  shortDescription: string
  description: string
  engine: string
  power: string
  torque: string
  seats: number
  fuelType: string
  transmission: string
  imageUrl: string
  videoUrl?: string
  images: string[]
  highlights?: CarHighlight[]
  sortOrder: number
  featured: boolean
  active: boolean
  createdAt: string
}

export interface TestDriveRequest {
  id: number
  fullName: string
  phone: string
  email: string
  preferredDate: string
  preferredTime: string
  modelId: number | null
  modelName: string
  notes: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

export interface TestDriveFormData {
  fullName: string
  phone: string
  email: string
  preferredDate: string
  preferredTime: string
  modelId: string
  notes: string
}

export interface LoginDto {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
}

export interface ApiError {
  message: string
  status: number
}

export type TestDriveStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface CarPromotion {
  id?: number
  carModelId: number
  title: string
  description: string
  items: string[]
  validUntil: string
  active: boolean
}

export interface HeroSlide {
  id: number
  label: string
  heading: string
  sub: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  sortOrder: number
  active: boolean
}

export interface HandoverPhoto {
  id: number
  imageUrl: string | null
  caption: string | null
  sortOrder: number
  active: boolean
  createdAt: string
}

export interface NewsPost {
  id: number
  title: string
  slug: string
  category: string
  imageUrl: string
  excerpt: string
  content: string
  published: boolean
  createdAt: string
}
