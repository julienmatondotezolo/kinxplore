"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export default function EventsPage() {
  const t = useTranslations("Events");

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-32 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-200"
          >
            <CalendarDays size={64} className="mx-auto text-blue-300 mb-6 stroke-[1.5]" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("comingSoon")}</h3>
            <p className="text-gray-500 max-w-md mx-auto">{t("comingSoonDesc")}</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
