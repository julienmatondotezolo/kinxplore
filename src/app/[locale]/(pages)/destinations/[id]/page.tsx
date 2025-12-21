"use client";

import { 
  ArrowLeft, 
  ChevronRight, 
  MapPin, 
  Star, 
  Share2, 
  Heart, 
  Wifi, 
  Car, 
  Waves, 
  Wind, 
  Palmtree, 
  Calendar,
  Users,
  Info,
  CheckCircle2,
  Clock,
  Globe,
  MoreHorizontal
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Link, useRouter } from "@/navigation";
import { useDestination } from "@/hooks/useDestinations";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function DestinationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const t = useTranslations("DestinationDetail");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: destination, isLoading, error } = useDestination(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t('notFound')}</h2>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 font-bold"
        >
          <ArrowLeft size={20} />
          {t('backToDestinations')}
        </button>
      </div>
    );
  }

  const facilities = [
    { icon: <Wifi size={20} />, label: "Wifi" },
    { icon: <Waves size={20} />, label: "Swimming Pool" },
    { icon: <Palmtree size={20} />, label: "Backyard" },
    { icon: <Car size={20} />, label: "Free Parking" },
    { icon: <Wind size={20} />, label: "Air Conditioner" },
    { icon: <CheckCircle2 size={20} />, label: "Security" },
  ];

  const highlights = [
    "The Sultan Qaboos Grand Mosque",
    "The Royal Opera House",
    "The National Museum",
    "Muttrah Souq",
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation />

      <main className="pt-24 pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-8 font-medium">
            <Link href="/" className="hover:text-black transition-colors">
              {t('breadcrumbs.home')}
            </Link>
            <ChevronRight size={12} />
            <Link href="/destinations" className="hover:text-black transition-colors">
              {t('breadcrumbs.destination')}
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600">{t('breadcrumbs.details')}</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-gray-900 leading-tight">
                {destination.name}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-[15px]">
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{destination.ratings.toFixed(1)}</span>
                  <span className="text-gray-400 font-light underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-gray-600">({t('reviews', { count: 12 })})</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="font-light">{destination.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-sm shadow-sm bg-white">
                <Share2 size={18} />
                <span>{t('share')}</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 hover:border-red-600 hover:bg-red-50 transition-all font-bold text-sm text-red-600 shadow-sm bg-white">
                <Heart size={18} />
                <span>{t('save')}</span>
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] md:h-[600px] mb-12 rounded-[40px] overflow-hidden shadow-2xl shadow-blue-500/10">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
              <img 
                src={destination.image || `https://picsum.photos/1200/800?random=${destination.id}1`} 
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:block relative group overflow-hidden">
              <img 
                src={`https://picsum.photos/800/800?random=${destination.id}2`} 
                alt="Detail"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:block relative group overflow-hidden">
              <img 
                src={`https://picsum.photos/800/800?random=${destination.id}3`} 
                alt="Detail"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:block relative group overflow-hidden">
              <img 
                src={`https://picsum.photos/800/800?random=${destination.id}4`} 
                alt="Detail"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:block relative group overflow-hidden">
              <img 
                src={`https://picsum.photos/800/800?random=${destination.id}5`} 
                alt="Detail"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <button className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl text-[13px] font-bold shadow-2xl border border-gray-100 flex items-center gap-2 hover:bg-black hover:text-white transition-all z-10">
                <MoreHorizontal size={18} />
                {t('showAllPhotos')}
              </button>
            </div>
          </div>

          {/* Info Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 mb-12">
            <div className="flex items-center gap-4 px-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t('duration')}</p>
                <p className="text-lg font-black">9 hr</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 border-l border-gray-100">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                <Palmtree size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t('tourType')}</p>
                <p className="text-lg font-black">{t('dailyTour')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 border-l border-gray-100">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t('groupSize')}</p>
                <p className="text-lg font-black">40 {t('person')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 border-l border-gray-100">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t('languages')}</p>
                <p className="text-lg font-black">EN, FR</p>
              </div>
            </div>
          </section>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Content */}
            <div className="flex-1 space-y-16">
              
              {/* Overview */}
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">{t('overview')}</h2>
                <p className="text-gray-500 leading-relaxed font-light text-[17px]">
                  {destination.description} This full-day PRIVATE tour to discover the landmarks of the capital of Oman since 1793. 
                  In this tour, you will enjoy panoramic views of Muscat and we will explore Oman's rich cultural heritage, 
                  which is well preserved in the capital.
                </p>
              </section>

              {/* Highlights */}
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">{t('highlights')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                  {highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 bg-blue-50 p-1 rounded-md">
                        <CheckCircle2 size={16} className="text-blue-600" />
                      </div>
                      <span className="text-[16px] font-light text-gray-600 leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Facilities */}
              <section className="space-y-10 pt-10 border-t border-gray-100">
                <h2 className="text-2xl font-black text-gray-900">{t('facilities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                  {facilities.map((facility, i) => (
                    <div key={i} className="flex items-center gap-5 group">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-gray-100 group-hover:border-blue-600 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                        {facility.icon}
                      </div>
                      <span className="text-[15px] font-bold text-gray-600 group-hover:text-black transition-colors">{facility.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location */}
              <section className="space-y-8 pt-10 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">{t('location')}</h2>
                  <button className="text-blue-600 font-bold text-[15px] hover:underline underline-offset-4">{t('showOnMap')}</button>
                </div>
                <div className="aspect-[2/1] bg-blue-50/30 rounded-[40px] border border-blue-100 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,0,0,0/800x800?access_token=pk.placeholder')] bg-cover opacity-20 grayscale transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border border-gray-100 transform transition-all duration-500 group-hover:scale-110">
                      <MapPin size={32} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Booking Card */}
            <div className="lg:w-[420px]">
              <div className="sticky top-32 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-blue-500/10 p-10 space-y-10">
                <div className="flex items-baseline justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('priceStartsFrom')}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-gray-900">${destination.price.toFixed(2)}</span>
                      <span className="text-gray-400 font-light text-[15px]">{t('perNight')}</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 text-orange-600 px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-2">
                    <Info size={14} />
                    <span>{t('bestPrice')}</span>
                  </div>
                </div>

                <div className="flex border border-gray-100 rounded-[24px] overflow-hidden bg-gray-50/50">
                  <button className="flex-1 px-6 py-5 flex flex-col items-start gap-1.5 hover:bg-white transition-colors border-r border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('checkIn')}</span>
                    <span className="text-[15px] font-black">Aug 2, 2024</span>
                  </button>
                  <button className="flex-1 px-6 py-5 flex flex-col items-start gap-1.5 hover:bg-white transition-colors">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('checkOut')}</span>
                    <span className="text-[15px] font-black">Aug 5, 2024</span>
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between text-gray-500 text-[15px] font-medium">
                    <div className="flex items-center gap-2 underline decoration-gray-200 decoration-dotted underline-offset-4">
                      <span>${destination.price.toFixed(2)} x {t('nights', { count: 3 })}</span>
                    </div>
                    <span>${(destination.price * 3).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500 text-[15px] font-medium">
                    <span className="underline decoration-gray-200 decoration-dotted underline-offset-4">{t('serviceFee')}</span>
                    <span>$0.00</span>
                  </div>
                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-lg font-black text-gray-900">{t('totalPrice')}</span>
                    <span className="text-3xl font-black text-blue-600">${(destination.price * 3).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/25 active:scale-95 transition-all">
                    {t('bookNow')}
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-gray-900 py-6 rounded-[24px] font-bold text-[15px] border border-gray-100 active:scale-95 transition-all">
                    {t('inquiryNow')}
                  </button>
                </div>
                
                <p className="text-center text-gray-400 text-[13px] font-bold cursor-pointer hover:text-blue-600 hover:underline transition-all uppercase tracking-widest">
                  {t('askQuestion')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Back Button */}
        <div className="fixed bottom-12 left-12 z-[100]">
          <button
            onClick={() => router.back()}
            className="bg-white hover:bg-black hover:text-white text-gray-900 px-8 py-5 rounded-full shadow-2xl border border-gray-100 flex items-center gap-3 transition-all active:scale-95 group font-black uppercase tracking-widest text-[13px]"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span>{t('goBack')}</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}




