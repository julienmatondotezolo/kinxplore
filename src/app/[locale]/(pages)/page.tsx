"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { PopularDestinations } from "@/components/PopularDestinations";
import { ItineraryResult } from "@/components/ItineraryResult";
import { generateItinerary } from "@/services/gemini";
import { UserPreferences, Itinerary } from "@/types";
import { BrandReel } from "@/components/BrandReel";
import { OurServices } from "@/components/OurServices";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { Community } from "@/components/Community";
import { CTA } from "@/components/CTA";

export default function HomePage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateItinerary(prefs);
      setItinerary(result);
    } catch (err) {
      setError("Failed to generate itinerary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation />

      {!itinerary ? (
        <>
          <Hero onGenerate={handleGenerate} isLoading={isLoading} />

          <BrandReel />

          <div className="relative bg-[#FAFBFF] overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
            </div>

            {error && (
              <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 relative z-10">
                {error}
              </div>
            )}

            <div className="relative z-10">
              <PopularDestinations />
            </div>

            <OurServices />

            <WhyChooseUs />

            <Testimonials />

            <Community />

            <CTA />
          </div>
        </>
      ) : (
        <ItineraryResult itinerary={itinerary} onReset={handleReset} />
      )}

      <Footer />
    </div>
  );
}