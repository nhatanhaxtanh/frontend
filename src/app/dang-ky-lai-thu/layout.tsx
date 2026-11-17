import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Đăng ký lái thử miễn phí xe Volkswagen tại TP.HCM',
  description: 'Đăng ký lái thử miễn phí Tiguan, Teramont, Touareg, Viloran, Golf tại Volkswagen Flagship — 5 Đường Số 2, An Khánh, Thủ Đức. Xác nhận trong 24 giờ.',
  alternates: { canonical: `${SITE_URL}/dang-ky-lai-thu` },
  openGraph: {
    title: 'Đăng ký lái thử miễn phí | Volkswagen Flagship',
    description: 'Trải nghiệm thực tế Tiguan, Teramont, Touareg, Viloran và Golf trước khi quyết định. Hoàn toàn miễn phí, không ràng buộc.',
    url: `${SITE_URL}/dang-ky-lai-thu`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
