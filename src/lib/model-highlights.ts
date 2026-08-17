import type { CarHighlight } from '@/lib/types'

// Nội dung mặc định cho phần "Tại sao chọn ..." trên trang chi tiết xe.
// Chỉ dùng làm fallback / gợi ý điền sẵn khi model chưa có highlights trong DB.
export const DEFAULT_MODEL_HIGHLIGHTS: Record<string, CarHighlight[]> = {
  'tiguan-facelift': [
    { title: 'IQ.DRIVE', description: 'Hệ thống hỗ trợ lái thông minh: giữ làn, phanh khẩn cấp, kiểm soát hành trình thích ứng.' },
    { title: 'Digital Cockpit Pro', description: 'Buồng lái kỹ thuật số với màn hình 10 inch, hiển thị thông tin trực quan hoàn toàn.' },
    { title: 'Thiết kế Facelift', description: 'Ngôn ngữ thiết kế IQ. mới nhất, đèn LED ma trận IQ.Light và lưới tản nhiệt phẳng hiện đại.' },
  ],
  'teramont-usa-base': [
    { title: 'Nhập khẩu Mỹ', description: 'Tiêu chuẩn sản xuất Bắc Mỹ nghiêm ngặt, chất lượng vượt trội so với xe lắp ráp trong nước.' },
    { title: '7 chỗ rộng rãi', description: 'Không gian nội thất thoải mái cho cả gia đình, hàng ghế thứ 3 đủ rộng cho người lớn.' },
    { title: 'Hệ thống an toàn', description: 'Đầy đủ gói an toàn IQ.DRIVE, phanh khẩn cấp, cảnh báo điểm mù và hỗ trợ đỗ xe.' },
  ],
  'teramont-usa-limited': [
    { title: 'Phiên bản Limited', description: 'Trang bị vượt trội so với Base: ghế da cao cấp, cửa sổ trời panorama và mâm 20 inch.' },
    { title: 'Hệ thống giải trí', description: 'Màn hình 8 inch, kết nối Apple CarPlay/Android Auto không dây, âm thanh 8 loa cao cấp.' },
    { title: '4Motion AWD', description: 'Dẫn động 4 bánh toàn thời gian, phân phối lực kéo thông minh trên mọi địa hình.' },
  ],
  'teramont-president': [
    { title: 'Đỉnh cao sang trọng', description: 'Phiên bản President: nội thất da Nappa, ốp gỗ thực, đèn viền 30 màu và ghế massage.' },
    { title: 'Màn hình 12 inch', description: 'Hệ thống giải trí 12 inch kết hợp Digital Cockpit Pro 10.25 inch toàn màn hình.' },
    { title: 'Công nghệ Premium', description: 'Head-up Display, camera 360°, cửa sổ trời toàn cảnh 2 tầng và sạc không dây.' },
  ],
  'teramont-x-platinum': [
    { title: 'Dynaudio Premium', description: 'Hệ thống âm thanh Dynaudio 12 loa 480W, trải nghiệm âm nhạc như phòng hòa nhạc.' },
    { title: 'Nội thất Platinum', description: 'Da Nappa cao cấp, ốp gỗ thực và chrome toàn bộ, đẳng cấp không kém xe hạng sang.' },
    { title: 'Màn hình 12 inch', description: 'Màn hình trung tâm 12 inch kết hợp Digital Cockpit Pro 10.25 inch hiện đại.' },
  ],
  'viloran-premium': [
    { title: 'Không gian rộng rãi', description: '3 hàng ghế thoải mái, cốp rộng, điều hòa 3 vùng độc lập cho toàn bộ hành khách.' },
    { title: 'Công nghệ kết nối', description: 'Màn hình 9.2 inch, Apple CarPlay/Android Auto không dây, 6 cổng USB toàn xe.' },
    { title: 'An toàn toàn diện', description: 'IQ.DRIVE đầy đủ: Lane Assist, Front Assist, Blind Spot Monitor và Park Assist.' },
  ],
  'viloran-luxury': [
    { title: 'Executive Lounge', description: 'Ghế hàng 2 kiểu thương gia có mát-xa, chỉnh điện và để chân — trải nghiệm hạng nhất.' },
    { title: 'Ambient Lighting', description: '30 màu đèn viền nội thất tạo không gian sang trọng, thay đổi theo tâm trạng.' },
    { title: 'Cách âm vượt trội', description: 'Kính cách âm 2 lớp và vật liệu hút âm cao cấp, cabin yên tĩnh tuyệt đối.' },
  ],
  'golf-15-etsi': [
    { title: 'eTSI Mild Hybrid', description: 'Công nghệ mild hybrid 48V tiết kiệm nhiên liệu đến 15%, vẫn đủ mạnh mẽ cho đô thị.' },
    { title: 'Thiết kế Sport', description: 'Thiết kế hatchback thể thao trẻ trung, mâm 16 inch, đèn LED và lưới tản nhiệt thể thao.' },
    { title: 'Digital Cockpit', description: 'Buồng lái kỹ thuật số với màn hình 10 inch và màn hình cảm ứng trung tâm 8.25 inch.' },
  ],
  'golf-20': [
    { title: 'Động cơ 2.0 TSI', description: 'Động cơ 2.0L TSI mạnh mẽ, cung cấp hiệu suất lái thú vị trên mọi cung đường.' },
    { title: 'DSG 7 cấp', description: 'Hộp số ly hợp kép DSG 7 cấp phản hồi nhanh, chuyển số êm ái và chính xác.' },
    { title: 'R-Line Body Kit', description: 'Body kit thể thao R-Line, mâm 18 inch, hệ thống xả thể thao và nội thất sport.' },
  ],
  'touareg-elegance': [
    { title: 'Innovision Cockpit', description: 'Màn hình cong 15 inch không viền, xóa bỏ hoàn toàn các nút vật lý truyền thống.' },
    { title: 'Air Suspension', description: 'Treo khí 4 cấp điều chỉnh độ cao gầm linh hoạt, thích nghi với mọi loại địa hình.' },
    { title: 'Thiết kế Elegance', description: 'Ngoại thất thanh lịch với mâm 19 inch chrome, lưới tản nhiệt mạ bạc và đèn LED matrix.' },
  ],
  'touareg-rline': [
    { title: 'R-Line Sport', description: 'Body kit thể thao R-Line, mâm 20 inch đen bóng, hệ thống xả thể thao đôi.' },
    { title: 'Chế độ lái', description: '5 chế độ lái: Eco, Comfort, Normal, Sport, Off-road — tùy chỉnh hoàn toàn trải nghiệm.' },
    { title: 'Động cơ mạnh mẽ', description: 'V6 TDI 3.0L 231 mã lực kết hợp 4Motion AWD, sẵn sàng chinh phục mọi địa hình.' },
  ],
  'touareg-highline': [
    { title: 'Highline tối thượng', description: 'Phiên bản cao nhất dòng Touareg, tích hợp mọi công nghệ và tiện nghi hàng đầu.' },
    { title: 'Head-up Display AR', description: 'Màn hình HUD thực tế tăng cường chiếu thông tin dẫn đường lên kính chắn gió.' },
    { title: 'Massage & Ventilation', description: 'Ghế trước mát-xa 10 điểm và thông gió chủ động, thoải mái trong mọi hành trình.' },
  ],
}

export const FALLBACK_HIGHLIGHTS: CarHighlight[] = [
  { title: 'Công nghệ tiên tiến', description: 'Tích hợp các công nghệ hỗ trợ lái an toàn và giải trí hiện đại nhất của Volkswagen.' },
  { title: 'Thiết kế Đức', description: 'Ngôn ngữ thiết kế IQ. tinh tế, kết hợp giữa thẩm mỹ và khí động học.' },
  { title: 'Hiệu suất vượt trội', description: 'Động cơ TSI/TDI tối ưu cân bằng giữa sức mạnh và tiết kiệm nhiên liệu.' },
]

export function getModelHighlights(slug: string, highlights?: CarHighlight[] | null): CarHighlight[] {
  const fromDb = (highlights ?? []).filter((h) => h?.title?.trim())
  if (fromDb.length) return fromDb
  return DEFAULT_MODEL_HIGHLIGHTS[slug] ?? FALLBACK_HIGHLIGHTS
}
