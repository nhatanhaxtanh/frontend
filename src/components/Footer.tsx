import Link from 'next/link'
import { Phone, MapPin, Mail, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import VWLogo from '@/components/VWLogo'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <VWLogo size={36} className="text-white" />
              <span className="text-white text-sm font-semibold tracking-[0.15em] uppercase">
                Sài Gòn
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Đại lý ủy quyền chính thức của Volkswagen tại TP. Hồ Chí Minh. Cam kết mang đến trải
              nghiệm lái xe đẳng cấp Đức.
            </p>
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
                <a href="tel:0764949837" className="hover:text-white transition-colors">
                  076 4949 837
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-neutral-500" />
                <span>info@volkswagensaigon.vn</span>
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
          <p>© {new Date().getFullYear()} Volkswagen Sài Gòn. Bảo lưu mọi quyền.</p>
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
