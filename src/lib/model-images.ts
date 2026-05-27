const LOCAL_IMAGES: Record<string, string> = {
  'tiguan-2024': '/images/models/tiguan.jpg',
  'teramont-2024': '/images/models/teramont.jpg',
  'teramont-x-2024': '/images/models/teramont-x.jpg',
  'touareg-2024': '/images/models/touareg.jpg',
  'viloran-2024': '/images/models/viloran.jpg',
}

export function getModelImage(slug?: string, imageUrl?: string): string {
  if (imageUrl && imageUrl.startsWith('http')) return imageUrl
  if (slug && LOCAL_IMAGES[slug]) return LOCAL_IMAGES[slug]
  return '/images/models/tiguan.jpg'
}
