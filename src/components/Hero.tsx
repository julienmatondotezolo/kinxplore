import React from 'react';
import { ArrowRight, Star, Plus, Plane, MapPin, Compass, ArrowUpRight, Heart, LayoutGrid, Bed } from 'lucide-react';
import { TripPlannerForm } from './TripPlannerForm';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const Hero: React.FC = () => {
  const t = useTranslations('Hero');
  const packages = [
    { 
      title: "Kinshasa Essentials", 
      price: "$450", 
      duration: "3 Days", 
      img: "https://picsum.photos/800/1000?random=60",
      badge: "Bestseller",
      tag: "Cultural"
    },
    { 
      title: "River Safari", 
      price: "$800", 
      duration: "5 Days", 
      img: "https://picsum.photos/600/400?random=61",
      tag: "Adventure"
    },
    { 
      title: "Nightlife Tour", 
      price: "$250", 
      duration: "1 Night", 
      img: "https://picsum.photos/600/400?random=62",
      badge: "Trending",
      tag: "Entertainment"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative pt-24 md:pt-32 pb-32 md:pb-48 px-4 overflow-hidden bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
      {/* ... Background Blobs ... */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large primary blob - top right */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Secondary blob - bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Accent blob - middle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-40 right-[15%] w-16 h-16 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full animate-float-delayed" />
        <div className="absolute top-[60%] left-[5%] w-12 h-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg -rotate-12 animate-float-slow" />
        
        {/* Icon decorations */}
        <div className="absolute top-32 right-[20%] text-blue-400/20 animate-float">
          <Plane size={40} className="rotate-45" />
        </div>
        <div className="absolute bottom-32 left-[15%] text-purple-400/20 animate-float-delayed">
          <Compass size={36} />
        </div>
        <div className="absolute top-[45%] right-[10%] text-pink-400/20 animate-float-slow">
          <MapPin size={32} />
        </div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Left Content */}
        <div className="space-y-8 md:space-y-10 relative z-10 w-[95%] mx-auto lg:w-full lg:mx-0">
          <div className="flex justify-center lg:justify-start">
            <motion.div 
              variants={itemVariants}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 via-white to-orange-50 backdrop-blur-sm text-orange-600 px-5 py-2.5 rounded-full text-[10px] md:text-xs font-bold border border-orange-100/50 tracking-wide shadow-sm"
            >
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              {t('badge')}
            </motion.div>
          </div>
          
          <div className="space-y-4 md:space-y-6 text-center lg:text-left max-w-[90%] mx-auto lg:max-w-none lg:mx-0">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-[4.2rem] font-black text-gray-900 leading-[1.2] md:leading-[1.1] tracking-tight"
            >
              <span className="block">{t('title')}</span>
              <span className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                {t('titleCity')}
                <span className="inline-block w-16 h-8 md:w-24 md:h-12 bg-gray-100 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-sm -rotate-2 transform hover:rotate-0 transition-transform duration-500">
                  <img src="https://picsum.photos/400/300?random=50" className="w-full h-full object-cover" alt="Kinshasa" />
                </span>
                {t('titleYourWay')}
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-lg text-gray-500 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0"
            >
              <span className="text-gray-900 font-bold">{t('subtitle')}</span> {t('description')}
            </motion.p>
          </div>

          {/* Search Form Integrated */}
          <motion.div variants={itemVariants} className="pt-4 md:pt-2 w-full mx-auto lg:mx-0">
            <TripPlannerForm compact={true} />
          </motion.div>

          {/* Mobile Recommended Section - Screenshot 2 Style */}
          <motion.div variants={itemVariants} className="lg:hidden space-y-8 pt-10">
            {/* Top Row: Review */}
            <div className="flex items-center gap-4 px-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://picsum.photos/100/100?random=${i + 30}`} className="w-10 h-10 rounded-full border-4 border-white object-cover shadow-sm" alt="User" />
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 tracking-tight">
                  <span className="underline decoration-blue-500 decoration-2 underline-offset-4">{t('reviews')}</span> {t('reviewsRating')}
                </p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">{t('topRated')}</p>
              </div>
            </div>

            {/* Packages Grid for Mobile */}
            <div className="space-y-4 px-2">
              {packages.map((pkg, i) => (
                <motion.div 
                  key={i}
                  variants={cardVariants}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white group cursor-pointer aspect-[16/10]"
                >
                  <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                  
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                    <ArrowUpRight size={16} className="text-gray-900" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">{pkg.tag}</p>
                    <h4 className="text-xl font-extrabold mb-2 leading-tight">{pkg.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold opacity-90">{pkg.duration}</span>
                      <span className="w-1 h-1 bg-white/40 rounded-full" />
                      <span className="text-xs font-bold text-blue-400">From {pkg.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Link */}
            <div className="pt-2 text-center">
              <button className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] group border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all">
                {t('explorePackages')}
                <ArrowRight size={14} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Modern Destination Packages Grid */}
        <div className="relative hidden lg:flex flex-col gap-6 h-full">
            {/* Top Row: Review */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 pl-12">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} src={`https://picsum.photos/100/100?random=${i + 30}`} className="w-10 h-10 rounded-full border-4 border-white object-cover shadow-sm" alt="User" />
                        ))}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900 tracking-tight">
                            <span className="underline decoration-blue-500 decoration-2 underline-offset-4">{t('reviews')}</span> {t('reviewsRating')}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">{t('topRated')}</p>
                    </div>
                </div>
            </motion.div>

            {/* Grid of Destination Cards */}
            <div className="grid grid-cols-2 gap-4 relative h-full max-h-[420px]">
                {/* Large Left Package Card */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group cursor-pointer h-full row-span-2"
                >
                    <img src={packages[0].img} alt={packages[0].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Badge */}
                    {packages[0].badge && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                            {packages[0].badge}
                        </div>
                    )}

                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">{packages[0].tag}</p>
                        <h4 className="text-xl font-extrabold mb-2 leading-tight">{packages[0].title}</h4>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold opacity-90">{packages[0].duration}</span>
                                <span className="w-1 h-1 bg-white/40 rounded-full" />
                                <span className="text-xs font-bold text-blue-400">From {packages[0].price}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Top Right Package Card */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white group cursor-pointer h-48"
                >
                    <img src={packages[1].img} alt={packages[1].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                    
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="text-base font-bold mb-0.5 leading-tight">{packages[1].title}</h4>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-white/80">
                            <span>{packages[1].duration}</span>
                            <span className="text-blue-400">{packages[1].price}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Right Package Card */}
                <motion.div 
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white group cursor-pointer h-40 mt-auto"
                >
                    <img src={packages[2].img} alt={packages[2].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                    
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="text-base font-bold mb-0.5 leading-tight">{packages[2].title}</h4>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-white/80">
                            <span>{packages[2].duration}</span>
                            <span className="text-blue-400">{packages[2].price}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Link */}
            <motion.div variants={itemVariants} className="pt-2 self-start pl-12">
                <button className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] group border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all">
                    {t('explorePackages')}
                    <ArrowRight size={14} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </motion.div>
        </div>

      </motion.div>
    </div>
  );
};