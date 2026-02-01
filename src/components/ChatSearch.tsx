"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { useRouter } from "@/navigation";

export const ChatSearch: React.FC = () => {
  const t = useTranslations("Hero");
  const router = useRouter();

  const handleExploreClick = () => {
    router.push("/destinations");
  };

  return (
    <div className="w-full max-w-2xl flex justify-center lg:justify-start">
      <motion.button
        onClick={handleExploreClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-center gap-2.5 group"
      >
        <Compass size={20} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-sm sm:text-base font-bold">
          {t("exploreAllDestinations")}
        </span>
      </motion.button>
    </div>
  );
};
