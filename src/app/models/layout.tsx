import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Dòng xe',
  description: 'Khám phá toàn bộ dòng xe Volkswagen chính hãng tại Volkswagen Flagship: Tiguan, Teramont, Touareg, Viloran, Golf. Giá bán minh bạch, hỗ trợ tài chính ưu đãi.',
  openGraph: {
    title: 'Dòng xe Volkswagen | Volkswagen Flagship',
    description: 'Khám phá toàn bộ dòng xe Volkswagen chính hãng: Tiguan, Teramont, Touareg, Viloran, Golf. Giá bán minh bạch, hỗ trợ tài chính ưu đãi.',
    url: `${SITE_URL}/models`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
