import HeroSection from '@/components/home/HeroSection'
import FeaturedModels from '@/components/home/FeaturedModels'
import ServicesSection from '@/components/home/ServicesSection'
import TestDriveCTA from '@/components/home/TestDriveCTA'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import WhyVWSection from '@/components/home/WhyVWSection'
import NewsSection from '@/components/home/NewsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedModels />
      <WhyVWSection />
      <ServicesSection />
      <NewsSection />
      <TestDriveCTA />
      <TestimonialsSection />
    </>
  )
}
