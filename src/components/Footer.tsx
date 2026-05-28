import Link from 'next/link'
import { Phone, MapPin, Mail, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import VWLogo from '@/components/VWLogo'

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Zalo',
    href: 'https://zalo.me/0981058232',
    icon: (
      <span className="text-xs font-bold leading-none">Z</span>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <VWLogo size={36} className="text-white" />
              <span className="text-white text-sm font-semibold tracking-[0.15em] uppercase">
                Volkswagen An Phú
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Đại lý ủy quyền chính thức của Volkswagen tại TP. Hồ Chí Minh. Cam kết mang đến trải
              nghiệm lái xe đẳng cấp Đức.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-black transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-wide uppercase text-xs mb-4">
              Dòng xe
            </h4>
            <ul className="space-y-2 text-sm">
              {['Tiguan', 'Teramont', 'Teramont X', 'Touareg', 'Viloran'].map((model) => (
                <li key={model}>
                  <Link
                    href={`/models/${model.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-white transition-colors"
                  >
                    {model}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-wide uppercase text-xs mb-4">
              Dịch vụ
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dang-ky-lai-thu" className="hover:text-white transition-colors">
                  Đăng ký lái thử
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="hover:text-white transition-colors">
                  Tin tức &amp; Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-white transition-colors">
                  Tư vấn mua xe
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-white transition-colors">
                  Hỗ trợ tài chính
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-wide uppercase text-xs mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-neutral-500" />
                <span>507C Võ Nguyên Giáp, An Khánh, Thủ Đức, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-neutral-500" />
                <a href="tel:0981058232" className="hover:text-white transition-colors">
                  098 105 8232
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-neutral-500" />
                <span>qui.maiphu@vwanphu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-neutral-500" />
                <span>8:00 – 18:00, Thứ 2 – Chủ nhật</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-neutral-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Volkswagen An Phú. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/dieu-khoan" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
