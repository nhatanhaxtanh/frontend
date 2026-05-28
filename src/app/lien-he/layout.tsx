import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với Volkswagen An Phú — Đại lý ủy quyền chính thức tại TP. Hồ Chí Minh. Địa chỉ: 507C Võ Nguyên Giáp, An Khánh, Thủ Đức. Hotline: 098 105 8232.',
  openGraph: {
    title: 'Liên hệ | Volkswagen An Phú',
    description: 'Liên hệ với Volkswagen An Phú. Địa chỉ: 507C Võ Nguyên Giáp, An Khánh, Thủ Đức, TP.HCM. Hotline: 098 105 8232.',
    url: 'https://volkswagenanphu.vn/lien-he',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
