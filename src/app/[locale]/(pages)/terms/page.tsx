"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export default function TermsPage() {
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
              {t("termsTitle")}
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
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("termsAcceptance")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("termsAcceptanceText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("termsServices")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("termsServicesText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("termsLiability")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("termsLiabilityText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("termsGuideRules")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("termsGuideRulesText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("termsModifications")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("termsModificationsText")}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("termsContact")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("termsContactText")}</p>
            </section>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
