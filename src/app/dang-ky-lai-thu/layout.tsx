import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký lái thử miễn phí xe Volkswagen tại TP.HCM',
  description: 'Đăng ký lái thử miễn phí Tiguan, Teramont, Touareg, Viloran, Golf tại Volkswagen An Phú — 507C Võ Nguyên Giáp, Thủ Đức. Xác nhận trong 24 giờ.',
  alternates: { canonical: 'https://volkswagenanphu.vn/dang-ky-lai-thu' },
  openGraph: {
    title: 'Đăng ký lái thử miễn phí | Volkswagen An Phú',
    description: 'Trải nghiệm thực tế Tiguan, Teramont, Touareg, Viloran và Golf trước khi quyết định. Hoàn toàn miễn phí, không ràng buộc.',
    url: 'https://volkswagenanphu.vn/dang-ky-lai-thu',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
