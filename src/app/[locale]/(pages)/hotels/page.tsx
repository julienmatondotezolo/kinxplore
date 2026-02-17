"use client";

import { motion } from "framer-motion";
import { Hotel, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useDestinations } from "@/hooks/useDestinations";
import { Link } from "@/navigation";

export default function HotelsPage() {
  const t = useTranslations("Hotels");
  const { data: destinations, isLoading, error } = useDestinations();

  const hotels = (destinations || []).filter((dest) =>
    dest.categories?.some(
      (cat) => cat.parent?.name?.toLowerCase() === "hotel" || cat.parent?.name?.toLowerCase() === "hôtel"
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
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
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-gray-500">
              <p>Failed to load. Please try again.</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-32 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-200">
              <Hotel size={64} className="mx-auto text-blue-300 mb-6 stroke-[1.5]" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("noResults")}</h3>
              <p className="text-gray-500 max-w-sm mx-auto">{t("noResultsDesc")}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
            >
              {hotels.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.id}`}
                  className="group cursor-pointer flex flex-col gap-4"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm aspect-square w-full">
                    <img
                      src={dest.image || `https://picsum.photos/800/800?random=${dest.id}`}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 backdrop-blur-sm px-3.5 py-1.5 rounded-lg shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                        {dest.categories?.[0]?.parent?.name || "Hotel"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-[16px] truncate leading-tight">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{dest.ratings.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 font-light text-sm line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-bold text-gray-900 text-[17px]">${dest.price}</span>
                      <span className="text-gray-500 text-sm font-light">{t("totalBeforeTaxes")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
