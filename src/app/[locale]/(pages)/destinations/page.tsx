"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, CircleDollarSign, Compass, MapPin, Plane, Search, Star, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useCategories } from "@/hooks/useCategories";
import { useDestinations } from "@/hooks/useDestinations";

export default function DestinationsPage() {
  const t = useTranslations("Packages");
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch data from backend using React Query
  const { data: destinations, isLoading: isLoadingDestinations, error: destinationsError } = useDestinations();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Create category list from API data
  const categoryList = useMemo(() => {
    if (!categories) return ["all"];
    return ["all", ...categories.map((cat) => cat.name.toLowerCase())];
  }, [categories]);

  // Filter destinations by category
  const filteredDestinations = useMemo(() => {
    if (!destinations) return [];
    if (activeCategory === "all") return destinations;

    return destinations.filter((dest) =>
      dest.categories.some(
        (cat) => cat.parent.name.toLowerCase() === activeCategory.toLowerCase()
      )
    );
  }, [destinations, activeCategory]);

  // Get primary category for a destination (first one)
  const getPrimaryCategory = (dest: any) => {
    return dest.categories?.[0]?.parent?.name || "Destination";
  };

  // Get tag based on category or subcategory
  const getDestinationTag = (dest: any) => {
    const subcategory = dest.categories?.[0]?.subcategory?.name;
    return subcategory || dest.categories?.[0]?.parent?.name || "Featured";
  };

  // Loading state
  if (isLoadingDestinations || isLoadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading destinations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (destinationsError || categoriesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load destinations</h2>
          <p className="text-gray-600 mb-4">
            {destinationsError?.message || categoriesError?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navigation />

      {/* Animated Background Blobs - Same as Hero */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-40 right-[15%] w-16 h-16 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full animate-float-delayed" />

        {/* Icon decorations */}
        <div className="absolute top-32 right-[20%] text-blue-400/20 animate-float">
          <Plane size={40} className="rotate-45" />
        </div>
        <div className="absolute bottom-32 left-[15%] text-purple-400/20 animate-float-delayed">
          <Compass size={36} />
        </div>
      </div>

      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-32 pb-24 px-4 md:px-12 max-w-7xl mx-auto relative z-10"
      >
        {/* Title Section */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full text-[10px] font-bold border border-blue-100/50 tracking-widest uppercase"
          >
            KinXplore Recommendations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight max-w-5xl mx-auto"
          >
            {t("title")}
          </motion.h1>
        </div>

        {/* Filter Bar - Modernized with Blue Theme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-[2rem] md:rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white p-3 flex flex-col md:flex-row items-center gap-3 mb-12 max-w-5xl mx-auto"
        >
          <div className="flex-1 w-full px-8 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex items-center gap-4 group cursor-pointer hover:bg-gray-50/50 rounded-2xl md:rounded-none transition-colors">
            <Calendar size={20} className="text-blue-600" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                {t("date")}
              </span>
              <span className="text-sm font-black text-gray-900">Select Date</span>
            </div>
          </div>

          <div className="flex-1 w-full px-8 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex items-center gap-4 group cursor-pointer hover:bg-gray-50/50 rounded-2xl md:rounded-none transition-colors">
            <CircleDollarSign size={20} className="text-blue-600" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                {t("budget")}
              </span>
              <span className="text-sm font-black text-gray-900">$200 - $1,000+</span>
            </div>
          </div>

          <div className="flex-1 w-full px-8 py-3 flex items-center gap-4 group cursor-pointer hover:bg-gray-50/50 rounded-2xl md:rounded-none transition-colors">
            <Users size={20} className="text-blue-600" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                {t("guests")}
              </span>
              <span className="text-sm font-black text-gray-900">2 Guests</span>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] md:rounded-full font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 flex items-center gap-3 w-full md:w-auto justify-center group">
            <Search size={18} className="group-hover:scale-110 transition-transform" />
            {t("search")}
          </button>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-16"
        >
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/80 backdrop-blur-md text-gray-500 hover:text-blue-600 border border-white hover:border-blue-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <Compass size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDestinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-4 border-white cursor-pointer h-full"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={dest.image || "https://picsum.photos/800/600?random=" + i}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
                    <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      {getDestinationTag(dest)}
                    </div>
                    {i === 0 && (
                      <div className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                        Bestseller
                      </div>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/20">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-black text-white">{dest.ratings.toFixed(1)}</span>
                  </div>

                  {/* Arrow Button */}
                  <div className="absolute bottom-32 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight size={20} />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">
                      {getPrimaryCategory(dest)}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight uppercase tracking-tight">
                      {dest.name}
                    </h3>
                    <div className="flex items-end justify-between border-t border-white/10 pt-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin size={14} className="text-blue-400" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{dest.location}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">From</p>
                        <p className="text-3xl font-black tracking-tighter text-blue-400">${dest.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>

      <Footer />
    </div>
  );
}
