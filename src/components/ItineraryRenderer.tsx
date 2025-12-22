"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Utensils, Sun, Moon, Coffee } from "lucide-react";
import React from "react";

interface ItineraryRendererProps {
  itineraryText: string;
}

export const ItineraryRenderer: React.FC<ItineraryRendererProps> = ({ itineraryText }) => {
  // Parse the itinerary text into structured sections
  const parseItinerary = (text: string) => {
    const sections: Array<{
      type: "day" | "tip" | "intro";
      title?: string;
      content: string[];
      dayNumber?: number;
    }> = [];

    // Split by double newlines to get paragraphs
    const paragraphs = text.split(/\n\n+/);

    paragraphs.forEach((para) => {
      // Check if it's a day section (starts with **Jour or **Day)
      const dayMatch = para.match(/^\*\*(?:Jour|Day)\s+(\d+)(?:-(\d+))?\s*:\*\*/i);
      if (dayMatch) {
        const dayNumber = parseInt(dayMatch[1]);
        const activities = para
          .split("\n")
          .slice(1) // Skip the day header
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\*\s*/, "").trim())
          .filter((line) => line.length > 0);

        sections.push({
          type: "day",
          title: `Jour ${dayNumber}`,
          dayNumber,
          content: activities,
        });
      }
      // Check if it's a tips/advice section
      else if (para.match(/^\*\*(?:Conseils?|Tips?|Advice)/i)) {
        const tips = para
          .split("\n")
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\*\s*/, "").trim())
          .filter((line) => line.length > 0);

        sections.push({
          type: "tip",
          title: "Conseils pratiques",
          content: tips,
        });
      }
      // Otherwise it's intro/general text
      else if (para.trim()) {
        sections.push({
          type: "intro",
          content: [para.trim()],
        });
      }
    });

    return sections;
  };

  // Format activity text with proper styling
  const formatActivity = (text: string) => {
    // Bold text between ** **
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Get icon based on activity time
  const getActivityIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("matin") || lowerText.includes("morning")) {
      return <Sun size={14} className="text-orange-500" />;
    } else if (lowerText.includes("après-midi") || lowerText.includes("afternoon")) {
      return <Coffee size={14} className="text-amber-600" />;
    } else if (lowerText.includes("soir") || lowerText.includes("evening") || lowerText.includes("dîner") || lowerText.includes("dinner")) {
      return <Moon size={14} className="text-indigo-600" />;
    } else if (lowerText.includes("déjeuner") || lowerText.includes("lunch") || lowerText.includes("restaurant")) {
      return <Utensils size={14} className="text-green-600" />;
    }
    return <MapPin size={14} className="text-blue-600" />;
  };

  const sections = parseItinerary(itineraryText);

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => {
        if (section.type === "intro") {
          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.05 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100"
            >
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {section.content[0]}
              </p>
            </motion.div>
          );
        }

        if (section.type === "day") {
          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {section.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90">
                      {section.content.length} activités
                    </p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {section.content.map((activity, actIndex) => (
                  <motion.div
                    key={actIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (actIndex * 0.05) }}
                    className="group flex items-start gap-3 sm:gap-4 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-purple-50/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-gray-100">
                      {getActivityIcon(activity)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {formatActivity(activity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        }

        if (section.type === "tip") {
          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200"
            >
              {/* Tips Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-xl">💡</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                  {section.title}
                </h3>
              </div>

              {/* Tips List */}
              <div className="space-y-2 sm:space-y-3">
                {section.content.map((tip, tipIndex) => (
                  <motion.div
                    key={tipIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (tipIndex * 0.05) }}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mt-2" />
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
                      {formatActivity(tip)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
};

