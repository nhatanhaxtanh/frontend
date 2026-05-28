import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký lái thử',
  description: 'Đăng ký lái thử miễn phí các dòng xe Volkswagen tại showroom An Phú. Trải nghiệm thực tế Tiguan, Teramont, Touareg, Viloran và Golf trước khi quyết định.',
  openGraph: {
    title: 'Đăng ký lái thử miễn phí | Volkswagen An Phú',
    description: 'Đăng ký lái thử miễn phí các dòng xe Volkswagen tại showroom An Phú. Chuyên viên tư vấn sẽ liên hệ xác nhận trong 24 giờ.',
    url: 'https://volkswagenanphu.vn/dang-ky-lai-thu',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
