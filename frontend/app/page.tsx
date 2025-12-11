'use client'

import Navbar from '@/components/home/Navbar'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import TechnicalOverview from '@/components/home/TechnicalOverview'
import HowItWorks from '@/components/home/HowItWorks'
import UseCaseSection from '@/components/home/UseCaseSection'
import AlgorithmsSection from '@/components/home/AlgorithmsSection'
import CreatorsSection from '@/components/home/CreatorsSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/home/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TechnicalOverview />
      <HowItWorks />
      <UseCaseSection />
      <AlgorithmsSection />
      <CreatorsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
