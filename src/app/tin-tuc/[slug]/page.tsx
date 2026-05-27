'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { newsApi } from '@/lib/api'
import type { NewsPost } from '@/lib/types'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'

const FALLBACK_POSTS: NewsPost[] = [
  {
    id: 1,
    slug: 'tiguan-facelift-2025',
    category: 'Xe mới',
    title: 'Volkswagen Tiguan Facelift 2025 chính thức ra mắt tại Việt Nam',
    excerpt: 'Phiên bản nâng cấp mang đến thiết kế hiện đại hơn cùng loạt công nghệ an toàn tiên tiến.',
    imageUrl: '/images/news/news1.jpg',
    createdAt: '2025-03-15T00:00:00',
    published: true,
    content: `<p>Volkswagen An Phú chính thức giới thiệu Tiguan Facelift 2025 tại thị trường Việt Nam, đánh dấu bước nâng cấp toàn diện cho mẫu SUV đô thị được yêu thích nhất của thương hiệu.</p>

<h2>Thiết kế ngoại thất mới</h2>
<p>Tiguan 2025 khoác lên mình ngôn ngữ thiết kế IQ. mới nhất của Volkswagen với lưới tản nhiệt được làm phẳng hoàn toàn, kết hợp cùng cụm đèn pha LED ma trận IQ.Light tinh tế. Dải đèn LED chạy dọc theo chiều rộng xe tạo nên nhận diện đặc trưng ngay cả trong bóng tối.</p>
<p>Bộ mâm xe hợp kim 18 inch kiểu mới, cản trước và sau được thiết kế lại mạnh mẽ hơn, mang đến tổng thể ngoại hình vừa thanh lịch vừa năng động.</p>

<h2>Công nghệ nội thất vượt trội</h2>
<p>Khoang lái hoàn toàn mới với hệ thống Digital Cockpit Pro tích hợp màn hình 10 inch kỹ thuật số thay thế hoàn toàn các đồng hồ cơ truyền thống. Màn hình cảm ứng trung tâm 9.2 inch chạy hệ thống thông tin giải trí MIB3 hỗ trợ kết nối không dây với Apple CarPlay và Android Auto.</p>
<p>Vô lăng đa chức năng mới với thiết kế phẳng đáy, tích hợp các phím bấm cảm ứng và nút bấm vật lý được bố trí khoa học. Ghế ngồi có thể điều chỉnh điện với chức năng sưởi hàng trước theo tiêu chuẩn.</p>

<h2>Hệ thống an toàn IQ.DRIVE</h2>
<p>Tiguan 2025 được trang bị đầy đủ bộ công nghệ hỗ trợ lái thông minh IQ.DRIVE bao gồm: hỗ trợ giữ làn đường Lane Assist, phanh khẩn cấp tự động Front Assist với nhận diện người đi bộ, kiểm soát hành trình thích ứng ACC, hỗ trợ đỗ xe Park Assist và camera 360 độ.</p>

<h2>Giá và phiên bản</h2>
<p>Volkswagen Tiguan Facelift 2025 được phân phối tại Việt Nam với 2 phiên bản: Elegance và R-Line, giá bán từ 1.699.000.000 VNĐ. Xe hiện có sẵn tại showroom Volkswagen An Phú để khách hàng trải nghiệm thực tế.</p>
<p>Liên hệ hotline <strong>098 105 8232</strong> để đặt lịch lái thử miễn phí hoặc nhận tư vấn chi tiết từ đội ngũ chuyên viên của chúng tôi.</p>`,
  },
  {
    id: 2,
    slug: 'teramont-x-platinum',
    category: 'Sự kiện',
    title: 'Ra mắt Teramont X Platinum – Đỉnh cao của dòng SUV 7 chỗ',
    excerpt: 'Teramont X Platinum nâng cấp nội thất, trang bị thêm màn hình panorama và hệ thống âm thanh Dynaudio cao cấp.',
    imageUrl: '/images/news/news2.jpg',
    createdAt: '2025-02-20T00:00:00',
    published: true,
    content: `<p>Volkswagen An Phú vừa tổ chức lễ ra mắt chính thức Teramont X Platinum 2025 — phiên bản đỉnh cao nhất trong dòng SUV 7 chỗ của Volkswagen tại Việt Nam, thu hút sự quan tâm đặc biệt từ giới yêu xe.</p>

<h2>Nội thất Platinum đẳng cấp</h2>
<p>Điểm nhấn nổi bật nhất của Teramont X Platinum là khoang nội thất được nâng cấp toàn diện với chất liệu da Nappa cao cấp bọc toàn bộ ghế ngồi, taplo và cửa xe. Ốp gỗ thực màu Nut Brown được sắp xếp tinh tế xuyên suốt cabin, kết hợp cùng các chi tiết chrome tạo nên không gian sang trọng không kém xe hạng sang.</p>

<h2>Hệ thống âm thanh Dynaudio</h2>
<p>Lần đầu tiên xuất hiện trên Teramont X tại Việt Nam, hệ thống âm thanh Dynaudio Confidence 12 loa với công suất 480W mang đến trải nghiệm âm nhạc đỉnh cao ngay trong lòng xe. Dynaudio — thương hiệu loa Hi-Fi hàng đầu Đan Mạch — đã tinh chỉnh đặc biệt hệ thống này để phù hợp với khoang âm thanh của Teramont X.</p>

<h2>Màn hình Panorama và công nghệ</h2>
<p>Màn hình trung tâm 12 inch với độ phân giải cao kết hợp cùng Digital Cockpit Pro 10.25 inch tạo nên buồng lái kỹ thuật số toàn diện. Mái kính Panorama toàn cảnh 2 tầng mang ánh sáng tự nhiên tràn ngập không gian, tạo cảm giác khoáng đạt cho tất cả 7 hành khách.</p>
<p>Đèn viền nội thất 30 màu điều chỉnh theo 4 chế độ không gian, Head-up Display chiếu thông tin lên kính chắn gió và hệ thống sạc không dây Qi chuẩn cho cả hàng ghế trước lẫn sau.</p>

<h2>Thông tin đặt xe</h2>
<p>Volkswagen Teramont X Platinum 2025 có giá bán 2.349.000.000 VNĐ. Với số lượng xe có hạn, quý khách có thể liên hệ trực tiếp showroom Volkswagen An Phú hoặc gọi <strong>098 105 8232</strong> để được tư vấn và đặt chỗ sớm nhất.</p>`,
  },
  {
    id: 3,
    slug: 'lai-thu-mien-phi',
    category: 'Khuyến mãi',
    title: 'Chương trình lái thử miễn phí tháng 4 – Trải nghiệm trước, quyết định sau',
    excerpt: 'Đăng ký lái thử toàn bộ dòng xe Volkswagen hoàn toàn miễn phí trong tháng 4/2025 tại showroom An Phú.',
    imageUrl: '/images/news/news3.jpg',
    createdAt: '2025-01-10T00:00:00',
    published: true,
    content: `<p>Volkswagen An Phú triển khai chương trình lái thử miễn phí trong suốt tháng 4/2025, mang đến cơ hội trải nghiệm thực tế toàn bộ dòng xe Volkswagen trước khi đưa ra quyết định mua.</p>

<h2>Các dòng xe tham gia chương trình</h2>
<p>Khách hàng có thể đăng ký lái thử tất cả 5 mẫu xe đang có mặt tại showroom, bao gồm:</p>
<ul>
<li><strong>Tiguan 2025</strong> — SUV đô thị 5 chỗ, từ 1.699.000.000 VNĐ</li>
<li><strong>Teramont 2025</strong> — SUV 7 chỗ rộng rãi, từ 2.199.000.000 VNĐ</li>
<li><strong>Teramont X Platinum</strong> — SUV 7 chỗ cao cấp, từ 2.349.000.000 VNĐ</li>
<li><strong>Touareg 2025</strong> — SUV flagship, từ 2.999.000.000 VNĐ</li>
<li><strong>Viloran 2025</strong> — MPV executive 7 chỗ, từ 1.999.000.000 VNĐ</li>
</ul>

<h2>Quy trình đăng ký đơn giản</h2>
<p>Khách hàng chỉ cần điền form đăng ký trực tuyến trên website hoặc gọi trực tiếp đến hotline <strong>098 105 8232</strong>. Chuyên viên tư vấn sẽ liên hệ xác nhận lịch hẹn trong vòng 24 giờ và hướng dẫn chuẩn bị giấy tờ cần thiết (CCCD và bằng lái xe hợp lệ).</p>

<h2>Ưu đãi kèm theo</h2>
<p>Khách hàng tham gia lái thử trong tháng 4 sẽ nhận được tư vấn cá nhân hóa từ chuyên gia Volkswagen, báo giá chi tiết và các chương trình hỗ trợ tài chính ưu đãi. Đặc biệt, khách hàng đặt cọc ngay sau buổi lái thử sẽ được tặng gói phụ kiện chính hãng trị giá lên đến 15.000.000 VNĐ.</p>
<p>Chương trình áp dụng từ ngày 01/04/2025 đến hết ngày 30/04/2025. Số lượng suất lái thử mỗi ngày có hạn, quý khách vui lòng đăng ký sớm để chọn khung giờ phù hợp.</p>`,
  },
]

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<NewsPost | null>(null)
  const [related, setRelated] = useState<Partial<NewsPost>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    newsApi.getBySlug(slug)
      .then((res) => setPost(res.data))
      .catch(() => {
        const fallback = FALLBACK_POSTS.find((p) => p.slug === slug) ?? null
        setPost(fallback)
      })
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    newsApi.getAll()
      .then((res) => setRelated(res.data.filter((p) => p.slug !== slug).slice(0, 3)))
      .catch(() => setRelated(FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, 3)))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="flex items-center gap-2 text-sm underline underline-offset-4">
          <ArrowLeft size={14} /> Quay lại tin tức
        </Link>
      </div>
    )
  }

  const readTime = estimateReadTime(post.content || '')

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative h-72 md:h-[500px] bg-neutral-900 overflow-hidden">
        <Image
          src={post.imageUrl || '/images/hero.jpg'}
          alt={post.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white text-black text-xs px-3 py-1 uppercase tracking-widest font-semibold mb-4">
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-5 mt-4 text-neutral-300 text-sm">
                {post.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {readTime} phút đọc
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-14 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">

            {/* Main article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={14} /> Tất cả tin tức
              </Link>

              {/* Excerpt */}
              <p className="text-lg text-neutral-600 leading-relaxed border-l-4 border-black pl-5 mb-10 font-medium">
                {post.excerpt}
              </p>

              {/* Body */}
              {post.content ? (
                <div
                  className="prose prose-neutral max-w-none
                    prose-headings:font-bold prose-headings:text-black prose-headings:mt-10 prose-headings:mb-4
                    prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-5
                    prose-li:text-neutral-600 prose-li:leading-relaxed
                    prose-strong:text-black
                    prose-a:text-black prose-a:underline prose-a:underline-offset-4
                    prose-ul:my-5 prose-ul:space-y-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-neutral-400 italic">Nội dung đang được cập nhật...</p>
              )}

              {/* Bottom nav */}
              <div className="mt-14 pt-8 border-t border-neutral-200 flex items-center justify-between">
                <Link href="/tin-tuc" className="flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4">
                  <ArrowLeft size={14} /> Tin tức khác
                </Link>
                <Link href="/dang-ky-lai-thu">
                  <span className="bg-black text-white text-xs px-6 py-3 uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors cursor-pointer inline-block">
                    Đăng ký lái thử
                  </span>
                </Link>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                {/* Contact CTA */}
                <div className="bg-neutral-950 p-6 mb-8">
                  <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase mb-2">Tư vấn miễn phí</p>
                  <p className="text-white font-bold text-lg mb-1">Volkswagen An Phú</p>
                  <a href="tel:0981058232" className="text-neutral-300 text-sm hover:text-white transition-colors block mb-4">
                    098 105 8232
                  </a>
                  <Link href="/dang-ky-lai-thu" className="block w-full bg-white text-black text-xs font-semibold uppercase tracking-widest text-center py-3 hover:bg-neutral-200 transition-colors">
                    Lái thử ngay
                  </Link>
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div>
                    <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-4">Bài viết liên quan</p>
                    <div className="space-y-5">
                      {related.map((r) => (
                        <Link key={r.id} href={`/tin-tuc/${r.slug}`} className="group flex gap-3">
                          <div className="relative w-20 h-16 shrink-0 overflow-hidden bg-neutral-100">
                            <Image
                              src={r.imageUrl || '/images/hero.jpg'}
                              alt={r.title ?? ''}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-400 mb-1">{r.category}</p>
                            <p className="text-sm font-medium text-black line-clamp-2 group-hover:underline underline-offset-2 leading-snug">
                              {r.title}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link href="/tin-tuc" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-black mt-6 hover:gap-2 transition-all">
                      Xem tất cả <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile related */}
      {related.length > 0 && (
        <div className="lg:hidden bg-neutral-50 py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-6">Bài viết liên quan</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/tin-tuc/${r.slug}`} className="group flex sm:flex-col gap-3">
                  <div className="relative w-20 sm:w-full aspect-video shrink-0 overflow-hidden bg-neutral-200">
                    <Image src={r.imageUrl || '/images/hero.jpg'} alt={r.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 80px, 33vw" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-1">{r.category}</p>
                    <p className="text-sm font-medium text-black line-clamp-2 group-hover:underline underline-offset-2">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
