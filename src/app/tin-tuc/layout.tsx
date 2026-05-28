import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Tin tức mới nhất về xe Volkswagen: ra mắt xe mới, sự kiện, khuyến mãi và thông tin kỹ thuật từ Volkswagen An Phú — Đại lý ủy quyền chính thức tại TP.HCM.',
  openGraph: {
    title: 'Tin tức Volkswagen | Volkswagen An Phú',
    description: 'Tin tức mới nhất về xe Volkswagen: ra mắt xe mới, sự kiện, khuyến mãi và thông tin kỹ thuật từ Volkswagen An Phú.',
    url: 'https://volkswagenanphu.vn/tin-tuc',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
