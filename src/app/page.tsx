import type { HeroSlide } from '@/lib/types'
import HeroSection from '@/components/home/HeroSection'
import FeaturedModels from '@/components/home/FeaturedModels'
import ShowcaseVideo from '@/components/home/ShowcaseVideo'
import ServicesSection from '@/components/home/ServicesSection'
import TestDriveCTA from '@/components/home/TestDriveCTA'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import WhyVWSection from '@/components/home/WhyVWSection'
import NewsSection from '@/components/home/NewsSection'
import MapSection from '@/components/MapSection'

const BACKEND = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : 'http://localhost:8080/api'

/**
 * Lấy hero slide ngay ở server để HTML đầu tiên đã đúng slide số 1.
 * Nếu để client tự fetch, người dùng sẽ thấy slide mặc định loé lên rồi mới bị thay.
 */
async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${BACKEND}/hero-slides`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const heroSlides = await fetchHeroSlides()

  return (
    <>
      <HeroSection initialSlides={heroSlides} />
      <FeaturedModels />
      <ShowcaseVideo />
      <WhyVWSection />
      <ServicesSection />
      <NewsSection />
      <MapSection />
      <TestDriveCTA />
      <TestimonialsSection />
    </>
  )
}
