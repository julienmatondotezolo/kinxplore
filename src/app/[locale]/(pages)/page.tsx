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
          <Hero onGenerate={handleGenerate} isLoading={isLoading} />

          <div className="relative bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-pink-50/30 pb-20 pt-10 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
              <div className="absolute top-[60%] left-[20%] w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl" />
            </div>

            {error && (
              <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 relative z-10">
                {error}
              </div>
            )}

            <div className="relative z-10">
              <PopularDestinations />
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10" id="services">
              <h2 className="text-3xl font-bold mb-12">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Calendar,
                    title: "Custom Planning",
                    desc: "Personalized itineraries designed to match your unique dreams.",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Zap,
                    title: "Hassle-Free",
                    desc: "Instant AI generation saves you hours of research time.",
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Safe & Secure",
                    desc: "We prioritize safe locations and verified spots in Kinshasa.",
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Support",
                    desc: "Our local team is ready to assist you anytime.",
                    gradient: "from-orange-500 to-red-500",
                  },
                ].map((svc, i) => (
                  <div
                    key={i}
                    className="group relative glass p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${svc.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <svc.icon size={28} />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{svc.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                    
                    {/* Decorative gradient border on hover */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${svc.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us Banner */}
            <div className="max-w-7xl mx-auto px-4 mb-20 relative z-10">
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden shadow-2xl">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute right-20 top-10 w-32 h-32 bg-yellow-400/40 rounded-full blur-3xl animate-pulse delay-1000" />
                  <div className="absolute left-10 bottom-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-500" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Why choose KinXplore?</h2>
                  <p className="text-blue-100 text-lg mb-8">
                    Experience ultimate comfort with our AI-driven planning. We know Kinshasa like
                    the back of our hand.
                  </p>
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-300">
                    Learn More
                  </button>
                </div>
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