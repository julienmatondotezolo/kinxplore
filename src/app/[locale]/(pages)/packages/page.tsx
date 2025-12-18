"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar, CircleDollarSign, Users, Search, Star, MapPin, ArrowUpRight } from 'lucide-react';

const categories = [
  "all", "resort", "villa", "hotel", "cottage", "homestay", "guesthouse", "ecoLodge"
];

const packages = [
  {
    id: 1,
    name: "Bromo Valley Villas",
    location: "East Java, Indonesia",
    price: 280,
    rating: 4.9,
    image: "https://picsum.photos/800/600?random=100",
    category: "villa"
  },
  {
    id: 2,
    name: "Plataran Bromo",
    location: "East Java, Indonesia",
    price: 285,
    rating: 4.9,
    image: "https://picsum.photos/800/600?random=101",
    category: "resort"
  },
  {
    id: 3,
    name: "Jiwa Jawa Resort",
    location: "East Java, Indonesia",
    price: 287,
    rating: 4.9,
    image: "https://picsum.photos/800/600?random=102",
    category: "resort"
  },
  {
    id: 4,
    name: "Kinshasa Grand Hotel",
    location: "Gombe, Kinshasa",
    price: 320,
    rating: 4.8,
    image: "https://picsum.photos/800/600?random=103",
    category: "hotel"
  },
  {
    id: 5,
    name: "River View Lodge",
    location: "Maluku, Kinshasa",
    price: 150,
    rating: 4.7,
    image: "https://picsum.photos/800/600?random=104",
    category: "ecoLodge"
  },
  {
    id: 6,
    name: "City Center Guesthouse",
    location: "Lingwala, Kinshasa",
    price: 85,
    rating: 4.5,
    image: "https://picsum.photos/800/600?random=105",
    category: "guesthouse"
  }
];

export default function PackagesPage() {
  const t = useTranslations('Packages');
  const [activeCategory, setActiveCategory] = useState("all");

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const filteredPackages = activeCategory === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navigation />
      
      <motion.main 
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-gray-900 leading-tight max-w-4xl mx-auto"
          >
            {t('title')}
          </motion.h1>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-full shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex items-center gap-3">
            <Calendar size={20} className="text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t('date')}</span>
              <span className="text-sm font-bold text-gray-900">Select Date</span>
            </div>
          </div>
          
          <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex items-center gap-3">
            <CircleDollarSign size={20} className="text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t('budget')}</span>
              <span className="text-sm font-bold text-gray-900">$200 - $500</span>
            </div>
          </div>

          <div className="flex-1 w-full px-6 py-3 flex items-center gap-3">
            <Users size={20} className="text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t('guests')}</span>
              <span className="text-sm font-bold text-gray-900">2 Guests</span>
            </div>
          </div>

          <button className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 w-full md:w-auto justify-center">
            <Search size={18} />
            {t('search')}
          </button>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl border-4 border-white cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Rating Badge */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/20">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{pkg.rating}</span>
                </div>

                {/* Arrow Button */}
                <div className="absolute top-6 left-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 -rotate-45 group-hover:rotate-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <ArrowUpRight size={20} className="text-white" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-black mb-2 leading-tight uppercase">{pkg.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/80">
                      <MapPin size={14} />
                      <span className="text-xs font-bold tracking-wide">{pkg.location}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black tracking-tighter">${pkg.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}

