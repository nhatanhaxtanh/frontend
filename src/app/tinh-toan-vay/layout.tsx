import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tính toán khoản vay mua xe Volkswagen | Volkswagen An Phú',
  description: 'Công cụ tính toán trả góp xe Volkswagen: chọn dòng xe, tỷ lệ vay đến 85%, thời hạn đến 96 tháng. Ước tính khoản trả góp hàng tháng nhanh chóng, chính xác.',
  alternates: { canonical: 'https://volkswagenanphu.vn/tinh-toan-vay' },
  openGraph: {
    title: 'Tính toán khoản vay mua xe Volkswagen',
    description: 'Tính toán trả góp xe Volkswagen dễ dàng — chọn dòng xe, tỷ lệ vay, thời hạn và lãi suất để biết số tiền trả hàng tháng.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
