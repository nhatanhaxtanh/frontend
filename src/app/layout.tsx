import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Volkswagen Sài Gòn — Đại lý ủy quyền chính thức',
    template: '%s | Volkswagen Sài Gòn',
  },
  description:
    'Đại lý ủy quyền chính thức của Volkswagen tại TP. Hồ Chí Minh. Khám phá các dòng xe Tiguan, Teramont, Touareg và đăng ký lái thử miễn phí.',
  keywords: ['Volkswagen', 'VW Sài Gòn', 'Tiguan', 'Teramont', 'xe Đức', 'đại lý VW'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
