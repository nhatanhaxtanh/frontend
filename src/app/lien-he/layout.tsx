import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Liên hệ & Showroom Volkswagen Flagship tại TP.HCM',
  description: 'Liên hệ Volkswagen Flagship: 5 Đường Số 2, An Khánh, Thủ Đức, TP.HCM. Hotline: 098 3338 527. Mở cửa 8:00–18:00 mỗi ngày. Tư vấn & lái thử miễn phí.',
  alternates: { canonical: `${SITE_URL}/lien-he` },
  openGraph: {
    title: 'Liên hệ Volkswagen Flagship — Showroom TP.HCM',
    description: 'Showroom tại 5 Đường Số 2, An Khánh, Thủ Đức, TP.HCM. Hotline: 098 3338 527. Tư vấn & lái thử miễn phí.',
    url: `${SITE_URL}/lien-he`,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
