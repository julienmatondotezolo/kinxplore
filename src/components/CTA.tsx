import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export const CTA: React.FC = () => {
  const t = useTranslations("CTA");

  return (
    <div className="max-w-7xl mx-auto px-4 mb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative glass rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl border border-white/40"
      >
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
            >
              {t("title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-500 font-medium max-w-xl"
            >
              {t("description")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-shrink-0 flex flex-col gap-4 w-full md:w-auto"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-12 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group">
              {t("startPlan")}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-sm font-medium text-gray-400">{t("freeForever")}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
