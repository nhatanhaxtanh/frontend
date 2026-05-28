const LOCAL_IMAGES: Record<string, string> = {
  'tiguan-facelift': '/images/models/tiguanfacelit.jpg',
  'teramont-usa-base': '/images/models/usa.jpeg',
  'teramont-usa-limited': '/images/models/limited.PNG',
  'teramont-president': '/images/models/teramontpresident.jpg',
  'teramont-x-platinum': '/images/models/teramontxplatinum.jpg',
  'viloran-premium': '/images/models/viloranpremium.jpg',
  'viloran-luxury': '/images/models/viloranluxury.jpg',
  'golf-15-etsi': '/images/models/golf15.jpg',
  'golf-20': '/images/models/Golf20.jpg',
  'touareg-elegance': '/images/models/TouaregElegance.jpg',
  'touareg-rline': '/images/models/TouaregRline.jpeg',
  'touareg-highline': '/images/models/TouaregHighline.jpg',
  // legacy slugs
  'tiguan-2024': '/images/models/tiguanfacelit.jpg',
  'teramont-2024': '/images/models/teramont.jpg',
  'teramont-x-2024': '/images/models/teramont-x.jpg',
  'touareg-2024': '/images/models/touareg.jpg',
  'viloran-2024': '/images/models/viloran.jpg',
}

export function getModelImage(slug?: string, imageUrl?: string): string {
  if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
    // localhost URLs were uploaded in dev — not accessible in production Docker
    if (!imageUrl.includes('localhost')) return imageUrl
  }
  if (slug && LOCAL_IMAGES[slug]) return LOCAL_IMAGES[slug]
  return '/images/models/tiguan.jpg'
}
