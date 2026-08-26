import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ScrollToTop from "@/components/ScrollToTop";
import TestDrivePopup from "@/components/TestDrivePopup";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://volkswagenanphu.vn'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Volkswagen An Phú — Đại lý ủy quyền chính thức",
    template: "%s | Volkswagen An Phú",
  },
  description:
    "Đại lý ủy quyền chính thức của Volkswagen tại TP. Hồ Chí Minh. Khám phá các dòng xe Tiguan, Teramont, Touareg và đăng ký lái thử miễn phí.",
  keywords: ["Volkswagen", "VW An Phú", "Tiguan", "Teramont", "Touareg", "xe Đức", "đại lý Volkswagen", "đại lý VW TP.HCM"],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: BASE_URL,
    siteName: 'Volkswagen An Phú',
    title: 'Volkswagen An Phú — Đại lý ủy quyền chính thức',
    description: 'Đại lý ủy quyền chính thức của Volkswagen tại TP. Hồ Chí Minh. Khám phá các dòng xe Tiguan, Teramont, Touareg và đăng ký lái thử miễn phí.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630, alt: 'Volkswagen An Phú' }],
  },
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Volkswagen An Phú',
  url: 'https://volkswagenanphu.vn',
  logo: 'https://volkswagenanphu.vn/images/logo.png',
  image: 'https://volkswagenanphu.vn/images/hero.jpg',
  description: 'Đại lý ủy quyền chính thức của Volkswagen tại TP. Hồ Chí Minh.',
  telephone: '+84983338527',
  email: 'qui.maiphu@vwanphu.vn',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5 Đường Số 2, An Khánh',
    addressLocality: 'Thủ Đức',
    addressRegion: 'TP. Hồ Chí Minh',
    addressCountry: 'VN',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '18:00',
  },
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18201531270"
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18201531270');
        `}
      </Script>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
        <ScrollToTop />
        <TestDrivePopup />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
