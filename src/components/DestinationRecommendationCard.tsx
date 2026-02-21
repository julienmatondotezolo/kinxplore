"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Tag, DollarSign, Sparkles } from "lucide-react";
import React from "react";

import type { DestinationRecommendation } from "@/types/chat.types";

interface DestinationRecommendationCardProps {
  destination: DestinationRecommendation;
  index: number;
}

export const DestinationRecommendationCard: React.FC<DestinationRecommendationCardProps> = ({
  destination,
  index,
}) => {
  // Get primary category with proper null checks
  const primaryCategory =
    destination.categories &&
    destination.categories.length > 0 &&
    destination.categories[0]?.parent?.name
      ? destination.categories[0].parent.name
      : "Destination";

  // Format price
  const priceFormatted = destination.price ? `$${destination.price}` : "Contact for pricing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.15,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-pink-500 overflow-hidden">
        {destination.image_url ? (
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400/20 via-blue-500/20 to-pink-400/20">
            <MapPin size={64} className="text-white/60" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
          <Tag size={14} className="text-blue-600" />
          <span className="text-xs font-bold text-gray-900">{primaryCategory}</span>
        </div>

        {/* Rating Badge */}
        {destination.ratings && destination.ratings > 0 && (
          <div className="absolute top-4 right-4 bg-yellow-400 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
            <Star size={14} className="text-gray-900 fill-gray-900" />
            <span className="text-xs font-black text-gray-900">{destination.ratings.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Location */}
        <div>
          <h3 className="font-black text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {destination.name}
          </h3>
          <div className="flex items-start gap-2 text-gray-500">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-2 font-medium">{destination.location}</p>
          </div>
        </div>

        {/* AI Recommendation Reason - Most prominent */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-4 relative overflow-hidden">
          {/* Sparkle Icon */}
          <div className="absolute top-3 right-3 text-blue-400 opacity-50">
            <Sparkles size={20} />
          </div>
          <div className="flex items-start gap-2 mb-2">
            <Sparkles size={16} className="text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Recommendation</p>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{destination.reason}</p>
        </div>

        {/* Description */}
        {destination.description && (
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{destination.description}</p>
        )}

        {/* Footer with Price */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-blue-600" />
            <span className="font-bold text-gray-900 text-base">{priceFormatted}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

