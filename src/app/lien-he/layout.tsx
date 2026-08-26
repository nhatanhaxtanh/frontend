import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ & Showroom Volkswagen An Phú tại TP.HCM',
  description: 'Liên hệ Volkswagen An Phú: 5 Đường Số 2, An Khánh, Thủ Đức, TP.HCM. Hotline: 098 3338 527. Mở cửa 8:00–18:00 mỗi ngày. Tư vấn & lái thử miễn phí.',
  alternates: { canonical: 'https://volkswagenanphu.vn/lien-he' },
  openGraph: {
    title: 'Liên hệ Volkswagen An Phú — Showroom TP.HCM',
    description: 'Showroom tại 5 Đường Số 2, An Khánh, Thủ Đức, TP.HCM. Hotline: 098 3338 527. Tư vấn & lái thử miễn phí.',
    url: 'https://volkswagenanphu.vn/lien-he',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
