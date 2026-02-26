"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Car,
  Clock,
  Lightbulb,
  Map,
  Plane,
  Smartphone,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Link } from "@/navigation";

export default function InfoTransportPage() {
  const t = useTranslations("InfoTransport");

  const sections = [
    {
      icon: Smartphone,
      title: t("s1Title"),
      text: t("s1Text"),
      items: [t("s1Item1"), t("s1Item2"), t("s1Item3")],
    },
    {
      icon: Map,
      title: t("s2Title"),
      text: t("s2Text"),
      items: [t("s2Item1"), t("s2Item2"), t("s2Item3")],
    },
    {
      icon: Clock,
      title: t("s3Title"),
      text: t("s3Text"),
      items: [t("s3Item1"), t("s3Item2"), t("s3Item3")],
    },
    {
      icon: AlertTriangle,
      title: t("s4Title"),
      text: t("s4Text"),
      items: [t("s4Item1"), t("s4Item2"), t("s4Item3")],
    },
    {
      icon: Plane,
      title: t("s5Title"),
      text: t("s5Text"),
      items: [t("s5Item1"), t("s5Item2"), t("s5Item3")],
    },
    {
      icon: Users,
      title: t("s6Title"),
      text: t("s6Text"),
      items: [t("s6Item1"), t("s6Item2"), t("s6Item3"), t("s6Item4")],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Car className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white rounded-2xl p-8 border border-gray-100 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{section.text}</p>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1.5 text-xs">●</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Tip box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-amber-50 rounded-2xl p-8 border border-amber-100 mb-8"
          >
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-900 font-medium">{t("tip")}</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Link
              href="/services/city-transfer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              {t("cta")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
