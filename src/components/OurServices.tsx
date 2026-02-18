import { motion } from "framer-motion";
import { ArrowRight, Calendar, Headphones, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Link } from "@/navigation";

const useServices = () => {
  const t = useTranslations("Services");

  return [
    {
      icon: Calendar,
      title: t("tripPlanning.title"),
      desc: t("tripPlanning.description"),
      bgColor: "bg-[#DEFCE9]",
      iconBg: "bg-[#63E6BE]",
      link: "/trips",
    },
    {
      icon: Headphones,
      title: t("localSupport.title"),
      desc: t("localSupport.description"),
      bgColor: "bg-[#FFF4E6]",
      iconBg: "bg-[#FFD8A8]",
      link: undefined as string | undefined,
    },
    {
      icon: Plane,
      title: t("airportService.title"),
      desc: t("airportService.description"),
      bgColor: "bg-[#E8F4FD]",
      iconBg: "bg-[#90CAF9]",
      link: "#contact",
    },
  ];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const OurServices: React.FC = () => {
  const t = useTranslations("Services");
  const services = useServices();

  return (
    <div className="py-32 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {services.map((svc, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className={`group ${svc.bgColor} p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl flex flex-col items-start text-left`}
            >
              <div
                className={`w-14 h-14 ${svc.iconBg} rounded-2xl flex items-center justify-center text-gray-900 mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <svc.icon size={28} />
              </div>
              <h3 className="font-extrabold text-3xl text-gray-900 mb-4">{svc.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-10">{svc.desc}</p>

              {svc.link?.startsWith("#") ? (
                <a href={svc.link} className="mt-auto flex items-center gap-2 font-bold text-gray-900 group/btn">
                  {t("exploreNow")}
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              ) : svc.link ? (
                <Link href={svc.link} className="mt-auto flex items-center gap-2 font-bold text-gray-900 group/btn">
                  {t("exploreNow")}
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <span className="mt-auto flex items-center gap-2 font-bold text-gray-900 group/btn">
                  {t("exploreNow")}
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
