import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Tin tức mới nhất về xe Volkswagen: ra mắt xe mới, sự kiện, khuyến mãi và thông tin kỹ thuật từ Volkswagen Flagship — Đại lý ủy quyền chính thức tại TP.HCM.',
  openGraph: {
    title: 'Tin tức Volkswagen | Volkswagen Flagship',
    description: 'Tin tức mới nhất về xe Volkswagen: ra mắt xe mới, sự kiện, khuyến mãi và thông tin kỹ thuật từ Volkswagen Flagship.',
    url: `${SITE_URL}/tin-tuc`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
