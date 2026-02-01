import { motion } from "framer-motion";
import { Plane, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { useDestinations } from "@/hooks/useDestinations";
import { useRouter } from "@/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const PopularDestinations: React.FC = () => {
  const t = useTranslations("PopularDestinations");
  const router = useRouter();
  const { data: allDestinations, isLoading } = useDestinations();

  // Get first 4 destinations for popular section
  const destinations = allDestinations?.slice(0, 4) || [];

  const handleDestinationClick = (destinationId: string) => {
    router.push(`/destinations/${destinationId}`);
  };

  if (isLoading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4" id="destinations">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-12">{t("title")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-[2.5rem] aspect-square mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-4" id="destinations">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{t("title")}</h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
      >
        {destinations.map((dest, idx) => (
          <motion.div
            key={dest.id}
            variants={itemVariants}
            onClick={() => handleDestinationClick(dest.id)}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] mb-6 aspect-square shadow-sm transition-all duration-500 group-hover:shadow-2xl">
              <img
                src={dest.image || `https://picsum.photos/600/600?random=${idx + 101}`}
                alt={dest.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
              />

              {/* Booking Pill */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-md rounded-full py-3 px-6 flex items-center justify-between shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t("bookingTrip")}</span>
                <div className="bg-blue-600 text-white p-1.5 rounded-full">
                  <Plane size={14} className="rotate-45" />
                </div>
              </div>
            </div>

            <div className="space-y-2 px-1">
              <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                {dest.name}
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-gray-900">${dest.price}</span>
                  <span className="text-sm font-medium text-gray-400">{t("starting")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-gray-300 fill-gray-300" />
                  <span className="text-sm font-bold text-gray-900">
                    {dest.ratings ? dest.ratings.toFixed(1) : "5.0"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
