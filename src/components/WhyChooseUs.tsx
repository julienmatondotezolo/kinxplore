/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { Car, CheckCircle2, ChevronRight, Clock, Globe, Headphones, MapPin, Smartphone, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export const WhyChooseUs: React.FC = () => {
  const t = useTranslations("WhyChooseUs");

  const points = [
    { icon: MapPin, title: t("localExpertise.title"), desc: t("localExpertise.description") },
    { icon: CheckCircle2, title: t("reliableService.title"), desc: t("reliableService.description") },
    { icon: Car, title: t("professionalDrivers.title"), desc: t("professionalDrivers.description") },
    { icon: Headphones, title: t("assistance247.title"), desc: t("assistance247.description") },
    { icon: Tag, title: t("transparentPricing.title"), desc: t("transparentPricing.description") },
    { icon: Clock, title: t("comfortableVehicles.title"), desc: t("comfortableVehicles.description") },
  ];

  return (
    <div className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-10"
        >
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {t("title")}
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">{t("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 items-start group"
              >
                <div className="mt-1 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex flex-shrink-0 items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <point.icon size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-gray-900">{point.title}</h4>
                  <p className="text-gray-500 font-medium text-sm">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            {t("learnMore")} <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Right Side: Device Mockup (Mobile-optimized web app) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative"
        >
          {/* Background circle decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10" />

          <div className="relative max-w-sm mx-auto">
            {/* Phone Mockup Frame */}
            <div className="relative rounded-[3.5rem] border-[12px] border-gray-900 shadow-2xl overflow-hidden aspect-[9/19.5] bg-white">
              {/* Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-900 rounded-b-3xl z-20 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-gray-800 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="h-full pt-12 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg">KinXplore</span>
                  <div className="w-8 h-8 rounded-full bg-blue-100" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold leading-tight">Where do you want to travel?</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                      <p className="font-bold text-sm">Kinshasa, DRC</p>
                    </div>
                  </div>
                </div>
                {/* Visual destination cards in phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[4/5] rounded-2xl bg-blue-50 overflow-hidden relative">
                    <img src="https://picsum.photos/200/300?random=401" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className="absolute bottom-2 left-2 text-[10px] font-bold text-white leading-none">Safari</p>
                  </div>
                  <div className="aspect-[4/5] rounded-2xl bg-blue-50 overflow-hidden relative">
                    <img src="https://picsum.photos/200/300?random=402" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className="absolute bottom-2 left-2 text-[10px] font-bold text-white leading-none">Sunset</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element beside phone */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 bottom-20 w-40 h-40 glass rounded-[2rem] p-4 shadow-2xl flex flex-col justify-center gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-[10px] font-bold text-gray-900 uppercase">Success</p>
              </div>
              <p className="text-xs font-bold text-gray-500 leading-tight">Itinerary generated instantly!</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
