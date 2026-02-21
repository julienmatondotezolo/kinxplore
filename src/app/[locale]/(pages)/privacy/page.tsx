"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export default function PrivacyPage() {
  const t = useTranslations("Legal");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {t("privacyTitle")}
            </h1>
            <p className="text-sm text-gray-400">{t("lastUpdated")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-gray max-w-none space-y-8"
          >
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("privacyDataCollection")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("privacyDataCollectionText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("privacyConfidentiality")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("privacyConfidentialityText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("privacyPartnerSharing")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("privacyPartnerSharingText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("privacyRights")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("privacyRightsText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("privacyContact")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("privacyContactText")}</p>
            </section>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
