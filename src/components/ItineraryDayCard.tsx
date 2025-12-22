"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Tag, ChevronDown, Clock } from "lucide-react";
import React, { useState } from "react";

import type { DayActivity } from "@/utils/itineraryParser";

interface ItineraryDayCardProps {
  day: DayActivity;
  index: number;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const primaryDestination = day.destinations[0];
  const additionalCount = day.destinations.length - 1;
  const hasMoreActivities = day.activities.length > 2;
  const hasMoreDestinations = additionalCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="flex gap-3 sm:gap-4"
    >
      {/* Day Number Circle */}
      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md ring-4 ring-blue-50">
        {day.day}
      </div>

      {/* Card Content */}
      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl active:shadow-2xl transition-all touch-manipulation">
        {/* Main Content - Clickable */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer group"
        >
          {/* Image */}
          {primaryDestination && (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
              {primaryDestination.image_url ? (
                <img
                  src={primaryDestination.image_url}
                  alt={primaryDestination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-center justify-center">
                  <MapPin size={28} className="text-white/90 sm:w-8 sm:h-8" />
                </div>
              )}
              {/* Day indicator badge on image */}
              <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                Day {day.day}
              </div>
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Header */}
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm sm:text-base line-clamp-1 mb-0.5">
                {day.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={10} className="sm:w-3 sm:h-3" />
                {day.date || `Day ${day.day}`}
              </p>
            </div>

            {/* Primary Destination */}
            {primaryDestination && (
              <div className="mt-2">
                <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                  📍 {primaryDestination.name}
                </p>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={11} className="flex-shrink-0 sm:w-3 sm:h-3" />
                  <p className="text-[10px] sm:text-xs line-clamp-1">{primaryDestination.location}</p>
                </div>
              </div>
            )}

            {/* Activities/Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
              {day.activities.slice(0, 2).map((activity, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-0.5 sm:gap-1 bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium"
                >
                  <Tag size={9} className="sm:w-2.5 sm:h-2.5" />
                  {activity.length > 18 ? activity.substring(0, 18) + "..." : activity}
                </span>
              ))}
              {hasMoreActivities && (
                <span className="inline-flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold border border-blue-100">
                  +{day.activities.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Expand Button */}
          {(hasMoreActivities || hasMoreDestinations) && (
            <div className="flex-shrink-0 self-center">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center border border-gray-200 group-hover:border-blue-200 transition-colors"
              >
                <ChevronDown size={16} className="text-gray-600 group-hover:text-blue-600 sm:w-5 sm:h-5" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden"
            >
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* All Activities */}
                {day.activities.length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      Activities ({day.activities.length})
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {day.activities.map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2 bg-white rounded-lg p-2 sm:p-2.5 shadow-sm border border-gray-100"
                        >
                          <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-blue-700">
                            {i + 1}
                          </div>
                          <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed flex-1">
                            {activity}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Destinations */}
                {day.destinations.length > 1 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={14} className="text-purple-600" />
                      Destinations ({day.destinations.length})
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {day.destinations.slice(1).map((dest, i) => (
                        <motion.div
                          key={dest.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (i + 1) * 0.05 }}
                          className="flex items-start gap-2 bg-white rounded-lg p-2 sm:p-2.5 shadow-sm border border-gray-100"
                        >
                          {dest.image_url && (
                            <img
                              src={dest.image_url}
                              alt={dest.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                              {dest.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {dest.location}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

