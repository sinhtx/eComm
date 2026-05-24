'use client'

import { HeroSection } from '@/components/HeroSection'
import { StoryBeat } from '@/components/StoryBeat'
import { aboutContent } from '@/lib/constants/aboutContent'

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <HeroSection
        backgroundImage="/images/farm-landscape.jpg"
        headline={aboutContent.hero.headline}
        subheading={aboutContent.hero.subheading}
        ctaText="Get in Touch"
        ctaLink="/contact"
        height="short"
      />

      {/* Your Journey */}
      <StoryBeat
        title={aboutContent.journey.headline}
        subtitle="A tech career turned farm dream"
        body={aboutContent.journey.body}
        imageUrl="/images/farmer-portrait.jpg"
        imageAlt="Farmer portrait"
        backgroundColor="cream"
      />

      {/* Hurricane Ian & Recovery */}
      <StoryBeat
        title={aboutContent.hurricane.headline}
        subtitle="How adversity became opportunity"
        body={aboutContent.hurricane.body}
        imageUrl="/images/farm-recovery.jpg"
        imageAlt="Farm recovery"
        imagePosition="right"
        backgroundColor="off-white"
      />

      {/* Organic Philosophy */}
      <StoryBeat
        title={aboutContent.organic.headline}
        subtitle="Standards we live by"
        body={aboutContent.organic.body}
        imageUrl="/images/organic-farming.jpg"
        imageAlt="Organic farming practices"
        backgroundColor="cream"
      />

      {/* Woman-Owned */}
      <StoryBeat
        title={aboutContent.womenOwned.headline}
        subtitle="Building opportunities in agriculture"
        body={aboutContent.womenOwned.body}
        imageUrl="/images/woman-farmer.jpg"
        imageAlt="Woman farmer at work"
        imagePosition="right"
        backgroundColor="off-white"
      />

      {/* Future Vision */}
      <StoryBeat
        title={aboutContent.future.headline}
        subtitle="What comes next"
        body={aboutContent.future.body}
        imageUrl="/images/future-vision.jpg"
        imageAlt="Future farm vision"
        backgroundColor="cream"
        ctaText="Shop Now"
        ctaLink="/shop"
      />
    </div>
  )
}
