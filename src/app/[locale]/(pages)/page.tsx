"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TripPlannerForm } from "@/components/TripPlannerForm";
import { Footer } from "@/components/Footer";
import { PopularDestinations } from "@/components/PopularDestinations";
import { ItineraryResult } from "@/components/ItineraryResult";
import { generateItinerary } from "@/services/gemini";
import { UserPreferences, Itinerary } from "@/types";
import { ShieldCheck, Calendar, Headphones, Zap } from "lucide-react";

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
          <Hero />

          <div className="relative">
            {/* Background gradient for form overlap */}
            <div className="absolute top-0 w-full h-32 bg-white z-0"></div>
            <div className="absolute bottom-0 w-full h-[calc(100%-8rem)] bg-gray-50 z-0"></div>

            <TripPlannerForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          <div className="bg-gray-50 pb-20 pt-10">
            {error && (
              <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
                {error}
              </div>
            )}

            <PopularDestinations />

            {/* Services Section */}
            <div className="max-w-7xl mx-auto px-4 py-20" id="services">
              <h2 className="text-3xl font-bold mb-12">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Calendar,
                    title: "Custom Planning",
                    desc: "Personalized itineraries designed to match your unique dreams.",
                  },
                  {
                    icon: Zap,
                    title: "Hassle-Free",
                    desc: "Instant AI generation saves you hours of research time.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Safe & Secure",
                    desc: "We prioritize safe locations and verified spots in Kinshasa.",
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Support",
                    desc: "Our local team is ready to assist you anytime.",
                  },
                ].map((svc, i) => (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-gray-100"
                  >
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                      <svc.icon size={28} />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{svc.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us Banner */}
            <div className="max-w-7xl mx-auto px-4 mb-20">
              <div className="bg-blue-600 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Why choose KinXplore?</h2>
                  <p className="text-blue-100 text-lg mb-8">
                    Experience ultimate comfort with our AI-driven planning. We know Kinshasa like
                    the back of our hand.
                  </p>
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
                    Learn More
                  </button>
                </div>
                {/* Decorative Circle */}
                <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-blue-500 rounded-full opacity-50"></div>
                <div className="absolute right-20 top-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-30"></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ItineraryResult itinerary={itinerary} onReset={handleReset} />
      )}

      <Footer />
    </div>
  );
}