"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar, CircleDollarSign, Compass, MapPin, Plane, Search, Star, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { DestinationSearch } from "@/components/DestinationSearch";
import { ResultsCounter } from "@/components/ResultsCounter";
import { useCategories } from "@/hooks/useCategories";
import { useDestinations } from "@/hooks/useDestinations";
import { useDestinationStore } from "@/store/useDestinationStore";

export default function DestinationsPage() {
  const t = useTranslations("Packages");

  // Fetch data from backend using React Query
  const { data: destinations, isLoading: isLoadingDestinations, error: destinationsError } = useDestinations();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  // Zustand store
  const {
    activeCategory,
    searchQuery,
    setActiveCategory,
    setDestinations,
    setCategories,
    getFilteredDestinations,
    getCategoryList,
  } = useDestinationStore();

  // Update store when data is fetched
  useEffect(() => {
    if (destinations) {
      setDestinations(destinations);
    }
  }, [destinations, setDestinations]);

  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }
  }, [categories, setCategories]);

  // Get filtered destinations from store
  const filteredDestinations = getFilteredDestinations();
  const categoryList = getCategoryList();
  const isFiltered = activeCategory !== "all" || searchQuery.trim() !== "";
  const totalDestinations = destinations?.length || 0;

  // Animation variants
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
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const categoryButtonVariants = {
    inactive: {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    active: {
      scale: 1.05,
      backgroundColor: "rgb(37, 99, 235)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
    hover: {
      scale: 1.08,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const filterCountVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

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

        {/* Search Component */}
        <DestinationSearch />

        {/* Results Counter */}
        <ResultsCounter 
          count={filteredDestinations.length} 
          total={totalDestinations}
          isFiltered={isFiltered}
        />

        {/* Category Tabs with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {categoryList.map((cat, index) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                variants={categoryButtonVariants}
                initial="inactive"
                animate={activeCategory === cat ? "active" : "inactive"}
                whileHover="hover"
                whileTap="tap"
                transition={{
                  delay: index * 0.05,
                }}
                className={`relative px-6 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest overflow-hidden ${
                  activeCategory === cat
                    ? "text-white shadow-lg shadow-blue-500/30"
                    : "backdrop-blur-md text-gray-500 hover:text-blue-600 border border-white hover:border-blue-100"
                }`}
              >
                {/* Animated background for active state */}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-blue-600 -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                
                <span className="relative z-10">{cat}</span>
                
                {/* Count badge */}
                <AnimatePresence>
                  {activeCategory === cat && (
                    <motion.span
                      variants={filterCountVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[8px] font-bold bg-white text-blue-600 rounded-full"
                    >
                      {filteredDestinations.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
          
          {/* Active filter indicator with animation */}
          <AnimatePresence>
            {activeCategory !== "all" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 mt-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2"
                >
                  <span>Filtering by: {activeCategory}</span>
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveCategory("all")}
                    className="hover:text-blue-900 transition-colors"
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Destinations Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          {filteredDestinations.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <Compass size={64} className="mx-auto text-gray-300 mb-4" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                No destinations found
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-4"
              >
                Try selecting a different category
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory("all")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Show All Destinations
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="destinations-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredDestinations.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3 },
                    }}
                    className="group relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-4 border-white cursor-pointer h-full"
                  >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <motion.img
                    src={dest.image || "https://picsum.photos/800/600?random=" + i}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 0.85 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Badges with animation */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg"
                    >
                      {getDestinationTag(dest)}
                    </motion.div>
                    {i === 0 && (
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg"
                      >
                        Bestseller
                      </motion.div>
                    )}
                  </div>

                  {/* Rating Badge with animation */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/20"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    </motion.div>
                    <span className="text-[10px] font-black text-white">{dest.ratings.toFixed(1)}</span>
                  </motion.div>

                  {/* Arrow Button with animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ 
                      opacity: 1, 
                      y: 0,
                      backgroundColor: "rgb(37, 99, 235)",
                      color: "white",
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-32 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100"
                  >
                    <motion.div
                      whileHover={{ x: 3, y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowUpRight size={20} />
                    </motion.div>
                  </motion.div>

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
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <Footer />
    </div>
  );
}
