"use client";

import { BrandReel } from "@/components/BrandReel";
import { Community } from "@/components/Community";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { OurServices } from "@/components/OurServices";
import { PopularDestinations } from "@/components/PopularDestinations";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation />

      <Hero />

      <BrandReel />

      <div className="relative bg-[#FAFBFF] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
        </div>

        <Reveal width="100%">
          <div className="relative z-10">
            <PopularDestinations />
          </div>
        </Reveal>

        <Reveal width="100%" delay={0.3}>
          <OurServices />
        </Reveal>

        <Reveal width="100%">
          <WhyChooseUs />
        </Reveal>

        <Reveal width="100%">
          <Testimonials />
        </Reveal>

        <Reveal width="100%">
          <Community />
        </Reveal>

        <Reveal width="100%">
          <CTA />
        </Reveal>
      </div>

      <Footer />
    </div>
  );
}
