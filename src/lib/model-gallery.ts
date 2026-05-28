// Số lượng ảnh trong mỗi thư mục gallery
// Ảnh đặt tại: public/images/models/gallery/{slug}/1.jpg, 2.jpg, 3.jpg...
// Khi thêm ảnh mới: tăng số tương ứng lên
export const modelGalleryCount: Record<string, number> = {
  'tiguan-facelift': 0,
  'teramont-usa-base': 18,
  'teramont-usa-limited': 13,
  'teramont-president': 0,
  'teramont-x-platinum': 0,
  'viloran-premium': 0,
  'viloran-luxury': 0,
  'golf-15-etsi': 0,
  'golf-20': 0,
  'touareg-elegance': 0,
  'touareg-rline': 0,
  'touareg-highline': 0,
}

export function getModelGallery(slug: string, fallbackImage: string): string[] {
  const count = modelGalleryCount[slug] ?? 0
  if (count === 0) return [fallbackImage]
  return Array.from({ length: count }, (_, i) => `/images/models/gallery/${slug}/${i + 1}.jpg`)
}
