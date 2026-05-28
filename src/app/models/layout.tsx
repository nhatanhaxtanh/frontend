import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dòng xe',
  description: 'Khám phá toàn bộ dòng xe Volkswagen chính hãng tại An Phú: Tiguan, Teramont, Touareg, Viloran, Golf. Giá bán minh bạch, hỗ trợ tài chính ưu đãi.',
  openGraph: {
    title: 'Dòng xe Volkswagen | Volkswagen An Phú',
    description: 'Khám phá toàn bộ dòng xe Volkswagen chính hãng: Tiguan, Teramont, Touareg, Viloran, Golf. Giá bán minh bạch, hỗ trợ tài chính ưu đãi.',
    url: 'https://volkswagenanphu.vn/models',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
