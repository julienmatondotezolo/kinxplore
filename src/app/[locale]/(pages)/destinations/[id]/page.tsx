"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Facebook,
  Globe,
  Heart,
  Instagram,
  MapPin,
  MoreHorizontal,
  Share2,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useDestination } from "@/hooks/useDestinations";
import { Link, useRouter } from "@/navigation";

// Dynamically import DestinationMap with SSR disabled to avoid "window is not defined" error
const DestinationMap = dynamic(() => import("@/components/DestinationMap").then((mod) => mod.DestinationMap), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-[400px] w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function DestinationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const t = useTranslations("DestinationDetail");
  // const [activeTab, setActiveTab] = useState("overview"); // Unused for now

  // Track if map loaded successfully
  const [showLocationSection, setShowLocationSection] = useState(true);

  const { data: destination, isLoading, error } = useDestination(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t("notFound")}</h2>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-bold">
          <ArrowLeft size={20} />
          {t("backToDestinations")}
        </button>
      </div>
    );
  }

  // Get facilities from destination data or use empty array
  const destinationFacilities = destination.facilities || [];

  // Helper function to render facility icon (emoji or default icon)
  const renderFacilityIcon = (facility: any) => {
    if (facility.icon) {
      // If icon is an emoji, render it directly
      return <span className="text-2xl">{facility.icon}</span>;
    }
    // Default icon if no icon provided
    return <CheckCircle2 size={20} />;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation />

      <main className="pt-24 pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-8 font-medium">
            <Link href="/" className="hover:text-black transition-colors">
              {t("breadcrumbs.home")}
            </Link>
            <ChevronRight size={12} />
            <Link href="/destinations" className="hover:text-black transition-colors">
              {t("breadcrumbs.destination")}
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600">{t("breadcrumbs.details")}</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-gray-900 leading-tight">
                {destination.name}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-[15px]">
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{destination.ratings.toFixed(1)}</span>
                  <span className="text-gray-400 font-light underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-gray-600">
                    ({t("reviews", { count: 12 })})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="font-light">{destination.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-sm shadow-sm bg-white">
                <Share2 size={18} />
                <span>{t("share")}</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-red-600 hover:bg-red-50 transition-all font-bold text-sm text-red-600 shadow-sm bg-white">
                <Heart size={18} />
                <span>{t("save")}</span>
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          {(() => {
            const extraImages = destination.images?.sort((a, b) => a.sort_order - b.sort_order) || [];
            const galleryImages = [
              destination.image || `https://picsum.photos/1200/800?random=${destination.id}1`,
              ...(extraImages.length > 0
                ? extraImages.slice(0, 4).map((img) => img.url)
                : [
                    `https://picsum.photos/800/800?random=${destination.id}2`,
                    `https://picsum.photos/800/800?random=${destination.id}3`,
                    `https://picsum.photos/800/800?random=${destination.id}4`,
                    `https://picsum.photos/800/800?random=${destination.id}5`,
                  ]),
            ];
            return (
              <>
                {/* Mobile: swipeable carousel */}
                <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 h-[300px] mb-12 rounded-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {galleryImages.map((src, i) => (
                    <div key={i} className="snap-center shrink-0 w-[85%] h-full rounded-[24px] overflow-hidden">
                      <img
                        src={src}
                        alt={i === 0 ? destination.name : (extraImages[i - 1]?.alt_text || "Detail")}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {/* Desktop: grid layout */}
                <div className="hidden md:grid md:grid-cols-4 grid-rows-2 gap-4 h-[600px] mb-12 rounded-[40px] overflow-hidden shadow-2xl shadow-blue-500/10">
                  <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
                    <img
                      src={galleryImages[0]}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  {galleryImages.slice(1, 5).map((src, i) => (
                    <div key={i} className="relative group overflow-hidden">
                      <img
                        src={src}
                        alt={extraImages[i]?.alt_text || "Detail"}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {i === 3 && (
                        <button className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl text-[13px] font-bold shadow-2xl border border-gray-100 flex items-center gap-2 hover:bg-black hover:text-white transition-all z-10">
                          <MoreHorizontal size={18} />
                          {t("showAllPhotos")}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          <div className="flex flex-col gap-16">
            {/* Content */}
            <div className="space-y-16">
              {/* Overview */}
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">{t("overview")}</h2>
                <p className="text-gray-500 leading-relaxed font-light text-[17px]">{destination.description}</p>
              </section>

              {/* Social Links */}
              {((destination as any).instagram_url || (destination as any).facebook_url || (destination as any).website_url) && (
                <section className="flex flex-wrap items-center gap-3">
                  {(destination as any).instagram_url && (
                    <a
                      href={(destination as any).instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-pink-400 hover:bg-pink-50 transition-all font-bold text-sm shadow-sm bg-white text-pink-600"
                    >
                      <Instagram size={18} />
                      <span>{t("followOnInstagram")}</span>
                    </a>
                  )}
                  {(destination as any).facebook_url && (
                    <a
                      href={(destination as any).facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-sm shadow-sm bg-white text-blue-600"
                    >
                      <Facebook size={18} />
                      <span>{t("followOnFacebook")}</span>
                    </a>
                  )}
                  {(destination as any).website_url && (
                    <a
                      href={(destination as any).website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-gray-400 hover:bg-gray-50 transition-all font-bold text-sm shadow-sm bg-white text-gray-700"
                    >
                      <Globe size={18} />
                      <span>{t("visitWebsite")}</span>
                    </a>
                  )}
                </section>
              )}

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-black text-gray-900">{t("highlights")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                    {destination.highlights.map((highlight: string, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="mt-1 bg-blue-50 p-1 rounded-md">
                          <CheckCircle2 size={16} className="text-blue-600" />
                        </div>
                        <span className="text-[16px] font-light text-gray-600 leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Facilities */}
              {destinationFacilities.length > 0 && (
                <section className="space-y-10 pt-10 border-t border-gray-100">
                  <h2 className="text-2xl font-black text-gray-900">{t("facilities")}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                    {destinationFacilities.map((facility) => (
                      <div key={facility.id} className="flex items-center gap-5 group" title={facility.description}>
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-gray-100 group-hover:border-blue-600 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                          {renderFacilityIcon(facility)}
                        </div>
                        <span className="text-[15px] font-bold text-gray-600 group-hover:text-black transition-colors">
                          {facility.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Location */}
              {destination.location && showLocationSection && (
                <section className="space-y-8 pt-10 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900">{t("location")}</h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">{destination.location}</span>
                    </div>
                  </div>
                  <DestinationMap
                    address={destination.location}
                    destinationName={destination.name}
                    className="h-[400px] w-full"
                    onLoadError={() => setShowLocationSection(false)}
                  />
                </section>
              )}
            </div>

          </div>
        </div>

        {/* Floating Back Button */}
        <div className="fixed bottom-12 left-12 z-[100]">
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-8 py-5 rounded-full shadow-2xl hover:border-2 border-blue-600 flex items-center gap-3 transition-all active:scale-95 group font-black uppercase tracking-widest text-[13px]"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span>{t("goBack")}</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
