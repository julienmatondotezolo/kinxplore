"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export default function LocalSupportPage() {
  const t = useTranslations("ServicePages");

  const features = [
    t("localSupportFeature1"),
    t("localSupportFeature2"),
    t("localSupportFeature3"),
    t("localSupportFeature4"),
    t("localSupportFeature5"),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {t("localSupportTitle")}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t("localSupportSubtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 border border-gray-100 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("whatWeOffer")}</h2>
            <div className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-gray-600">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 border border-gray-100 mb-8"
          >
            <p className="text-gray-600 leading-relaxed">{t("localSupportDescription")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              {t("contactUs")}
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
