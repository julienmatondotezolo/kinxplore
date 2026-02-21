"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useTrip } from "@/hooks/useTrips";
import { Link, useRouter } from "@/navigation";

export default function TripDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const t = useTranslations("Trips");

  const { data: trip, isLoading, error } = useTrip(id);

  const formatRegion = (region: string) =>
    region === "kinshasa" ? "Kinshasa" : "Kongo Central";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("notFound")}</p>
          <button
            onClick={() => router.push("/trips")}
            className="px-6 py-2 bg-black text-white rounded-full font-bold"
          >
            {t("backToTrips")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-20">
        {/* Hero Image / Gallery */}
        {(() => {
          const extraImages = (trip.images || []).sort(
            (a, b) => a.sort_order - b.sort_order
          );
          const hasGallery = extraImages.length > 0;

          if (hasGallery) {
            const galleryImages = [
              trip.image || `https://picsum.photos/1200/800?random=${trip.id}1`,
              ...extraImages.slice(0, 4).map((img) => img.url),
            ];

            return (
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-4">
                  <button
                    onClick={() => router.push("/trips")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t("backToTrips")}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] md:h-[600px] mb-8 rounded-[40px] overflow-hidden shadow-2xl shadow-blue-500/10">
                  <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
                    <img
                      src={galleryImages[0]}
                      alt={trip.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  {galleryImages.slice(1, 5).map((src, i) => (
                    <div
                      key={i}
                      className="hidden md:block relative group overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={extraImages[i]?.alt_text || "Detail"}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      {i === 3 && galleryImages.length > 4 && (
                        <button className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl text-[13px] font-bold shadow-2xl border border-gray-100 flex items-center gap-2 hover:bg-black hover:text-white transition-all z-10">
                          <MoreHorizontal size={18} />
                          {t("showAllPhotos")}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">
                  {trip.name}
                </h1>
                {trip.subtitle && (
                  <p className="text-lg text-gray-500 mb-6">{trip.subtitle}</p>
                )}
              </div>
            );
          }

          return (
            <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
              {trip.image ? (
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <button
                  onClick={() => router.push("/trips")}
                  className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> {t("backToTrips")}
                </button>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
                  {trip.name}
                </h1>
                {trip.subtitle && (
                  <p className="text-lg text-white/80">{trip.subtitle}</p>
                )}
              </div>
            </div>
          );
        })()}

        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Content */}
            <div className="flex-1 space-y-10">
              {/* Info Bar */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{formatRegion(trip.region)}</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">{trip.duration}</span>
                </div>
                {trip.destinations && trip.destinations.length > 0 && (
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-sm">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{trip.destinations.length} {t("destinations")}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {trip.description && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("overview")}</h2>
                  <p className="text-gray-600 leading-relaxed">{trip.description}</p>
                </div>
              )}

              {/* What's Included */}
              {trip.included_items && trip.included_items.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("whatsIncluded")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trip.included_items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 bg-green-50/50 p-3 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-gray-700">
                          {item.fr || item.en || (typeof item === "string" ? item : JSON.stringify(item))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Program / Schedule */}
              {trip.program && trip.program.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("program")}</h2>
                  <div className="space-y-4">
                    {trip.program.map((item: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 items-start"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full" />
                          {index < trip.program.length - 1 && (
                            <div className="w-0.5 h-8 bg-blue-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-bold text-blue-600">{item.time}</p>
                          <p className="text-gray-700">
                            {item.fr || item.en || (typeof item === "string" ? item : JSON.stringify(item))}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Destinations */}
              {trip.destinations && trip.destinations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("destinationsIncluded")}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trip.destinations.map((dest: any) => (
                      <Link key={dest.id} href={`/destinations/${dest.id}`}>
                        <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={dest.image || `https://picsum.photos/seed/${dest.id}/400/250`}
                              alt={dest.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <p className="font-bold text-gray-900 text-sm">{dest.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {dest.location}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Pricing Card */}
            <div className="lg:w-[360px]">
              <div className="sticky top-32 bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-6">
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("contactAgentText")}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t("duration")}</span>
                    <span className="font-bold">{trip.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{t("region")}</span>
                    <span className="font-bold">{formatRegion(trip.region)}</span>
                  </div>
                  {trip.destinations && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t("stops")}</span>
                      <span className="font-bold">{trip.destinations.length} {t("destinations")}</span>
                    </div>
                  )}
                </div>

                <Link href={`/trips/${trip.id}/booking`}>
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95">
                    {t("bookNow")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
