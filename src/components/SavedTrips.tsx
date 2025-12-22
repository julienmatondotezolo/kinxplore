"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Trash2,
  Eye,
  Share2,
  Clock,
  Loader2,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { ItineraryRenderer } from "./ItineraryRenderer";
import { useTripStore } from "@/store/useTripStore";
import type { SavedTrip } from "@/store/useTripStore";
import { parseItinerary } from "@/utils/itineraryParser";

export const SavedTrips: React.FC = () => {
  const t = useTranslations("Hero");
  const { savedTrips, loadTrips, deleteTrip, setCurrentTrip } = useTripStore();
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);

  useEffect(() => {
    const loadSavedTrips = async () => {
      setIsLoading(true);
      await loadTrips();
      setIsLoading(false);
    };
    loadSavedTrips();
  }, [loadTrips]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this trip?")) return;

    setDeletingId(id);
    await deleteTrip(id);
    setDeletingId(null);
    if (selectedTrip?.id === id) {
      setSelectedTrip(null);
    }
  };

  const handleViewTrip = (trip: SavedTrip) => {
    setSelectedTrip(trip);
    setCurrentTrip(trip);
  };

  const handleShare = async (trip: SavedTrip, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.name,
          text: `Check out my trip: ${trip.recommendations.summary}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${trip.name}\n\n${trip.recommendations.summary}\n\nDestinations: ${trip.recommendations.destinations.length}`;
      await navigator.clipboard.writeText(shareText);
      alert("Trip details copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
          <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
        </div>
        <p className="text-gray-600 font-semibold">Loading your trips...</p>
      </div>
    );
  }

  if (savedTrips.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <Package size={40} className="text-blue-600 sm:w-12 sm:h-12" />
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 text-center">
          No Saved Trips Yet
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-md text-center mb-6">
          Start planning your adventure in Kinshasa and save your itineraries here
        </p>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 touch-manipulation">
          <Sparkles size={18} />
          Start Planning
          <ArrowRight size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600">
          You have {savedTrips.length} saved {savedTrips.length === 1 ? "trip" : "trips"}
        </p>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {savedTrips.map((trip, index) => {
            const dayActivities = parseItinerary(
              trip.recommendations.itinerary,
              trip.recommendations.destinations
            );
            const primaryDestination = trip.recommendations.destinations[0];

            return (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleViewTrip(trip)}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                {/* Trip Image/Header */}
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400">
                  {primaryDestination?.image_url ? (
                    <img
                      src={primaryDestination.image_url}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin size={48} className="text-white/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Days Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Calendar size={14} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">
                      {dayActivities.length} {dayActivities.length === 1 ? "day" : "days"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => handleShare(trip, e)}
                      className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-colors touch-manipulation"
                      aria-label="Share trip"
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      disabled={deletingId === trip.id}
                      className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-colors touch-manipulation disabled:opacity-50"
                      aria-label="Delete trip"
                    >
                      {deletingId === trip.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {trip.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {trip.recommendations.summary}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={12} className="text-purple-600" />
                      <span className="font-medium">
                        {trip.recommendations.destinations.length} places
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} className="text-blue-600" />
                      <span className="font-medium">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 touch-manipulation">
                    <Eye size={16} />
                    View Itinerary
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTrip(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
                      {selectedTrip.name}
                    </h2>
                    <p className="text-sm text-white/90">
                      {selectedTrip.recommendations.summary}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTrip(null)}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Destinations */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={20} className="text-purple-600" />
                    Destinations ({selectedTrip.recommendations.destinations.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTrip.recommendations.destinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
                      >
                        {dest.image_url && (
                          <img
                            src={dest.image_url}
                            alt={dest.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 line-clamp-1">
                            {dest.name}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {dest.location}
                          </p>
                          {dest.price && (
                            <p className="text-xs font-bold text-blue-600 mt-1">
                              From ${dest.price}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" />
                    Full Itinerary
                  </h3>
                  <ItineraryRenderer itineraryText={selectedTrip.recommendations.itinerary} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

