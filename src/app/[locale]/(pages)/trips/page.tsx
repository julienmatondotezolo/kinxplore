"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useTrips } from "@/hooks/useTrips";
import { Link } from "@/navigation";
import { Trip } from "@/types/api.types";

export default function TripsPage() {
  const t = useTranslations("Trips");
  const { data: trips, isLoading, error } = useTrips();

  const kinshasa = (trips || []).filter((t) => t.region === "kinshasa");
  const kongoCentral = (trips || []).filter((t) => t.region === "kongo_central");

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Link href={`/trips/${trip.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {trip.image ? (
            <img
              src={trip.image}
              alt={trip.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-300" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {trip.duration}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{trip.name}</h3>
          {trip.subtitle && (
            <p className="text-sm text-gray-500 mb-3">{trip.subtitle}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500 leading-snug flex-1">
              {t("contactAgentText")}
            </p>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );

  const RegionSection = ({ title, trips: regionTrips }: { title: string; trips: Trip[] }) => {
    if (regionTrips.length === 0) return null;
    return (
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {regionTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-gray-500">
              <p>{t("errorLoading")}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RegionSection title={t("regionKinshasa")} trips={kinshasa} />
              <RegionSection title={t("regionKongoCentral")} trips={kongoCentral} />
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
