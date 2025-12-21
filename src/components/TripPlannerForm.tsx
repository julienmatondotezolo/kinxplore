import { Activity, ArrowRight, Calendar, ChevronDown, MapPin, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useRouter } from "@/navigation";
import { TripStyle } from "@/types";
import { useDestinationStore } from "@/store/useDestinationStore";

interface Props {
  compact?: boolean;
}

export const TripPlannerForm: React.FC<Props> = ({ compact = false }) => {
  const t = useTranslations("Hero");
  const tStyles = useTranslations("TripStyles");
  const tCommunes = useTranslations("Communes");
  const router = useRouter();
  const { setHeroSearch } = useDestinationStore();
  const [style, setStyle] = useState<TripStyle>(TripStyle.Adventure);
  const [duration, setDuration] = useState<number>(3);
  const [destination, setDestination] = useState<string>("");

  const communes = [
    { value: "", label: t("selectLocation") },
    { value: "gombe", label: tCommunes("gombe") },
    { value: "maluku", label: tCommunes("maluku") },
    { value: "limete", label: tCommunes("limete") },
    { value: "lingwala", label: tCommunes("lingwala") },
    { value: "ngaliema", label: tCommunes("ngaliema") },
    { value: "kintambo", label: tCommunes("kintambo") },
    { value: "nsele", label: tCommunes("nsele") },
    { value: "bandalungwa", label: tCommunes("bandalungwa") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save search criteria to Zustand
    setHeroSearch({
      destination,
      duration,
      tripStyle: style.toLowerCase(),
    });
    
    // Navigate to destinations page
    router.push("/destinations");
  };

  if (compact) {
    return (
      <div className="w-full">
        {/* Desktop Pill Version */}
        <div className="hidden md:flex bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 items-center gap-2">
          {/* Destination */}
          <div className="flex-1 px-6 py-2 border-r border-gray-100 hover:bg-gray-50/50 rounded-full transition-colors cursor-pointer group relative">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("location")}</p>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-600" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none w-full appearance-none cursor-pointer pr-4"
              >
                {communes.map((commune) => (
                  <option key={commune.value} value={commune.label}>
                    {commune.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="text-gray-400 absolute right-4" />
            </div>
          </div>

          {/* Dates/Duration */}
          <div className="flex-1 px-6 py-2 border-r border-gray-100 hover:bg-gray-50/50 rounded-full transition-colors cursor-pointer group">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("duration")}</p>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-600" />
              <input
                type="number"
                min="1"
                max="14"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none w-12"
              />
              <span className="text-[10px] text-gray-400 font-medium">{t("days")}</span>
            </div>
          </div>

          {/* Style */}
          <div className="flex-1 px-6 py-2 hover:bg-gray-50/50 rounded-full transition-colors cursor-pointer group relative">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t("tripStyle")}</p>
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-600" />
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as TripStyle)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-sm font-bold text-gray-900 appearance-none focus:outline-none cursor-pointer pr-4"
              >
                {Object.values(TripStyle).map((s) => (
                  <option key={s} value={s}>
                    {tStyles(s.toLowerCase())}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="text-gray-400 absolute right-4" />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/40 active:scale-95 flex-shrink-0"
            title={t("startPlanning")}
          >
            <Search size={20} />
          </button>
        </div>

        {/* Mobile Stacked Version */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 space-y-4">
            {/* Destination */}
            <div className="space-y-1 px-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("location")}</p>
              <div className="flex items-center gap-3 py-1 border-b border-gray-50 relative">
                <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-base font-bold text-gray-900 focus:outline-none w-full appearance-none cursor-pointer pr-6"
                >
                  {communes.map((commune) => (
                    <option key={commune.value} value={commune.label}>
                      {commune.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-gray-400 absolute right-0 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-1 px-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
                <div className="flex items-center gap-3 py-1 border-b border-gray-50">
                  <Calendar size={18} className="text-blue-600 flex-shrink-0" />
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="bg-transparent text-base font-bold text-gray-900 focus:outline-none w-8"
                    />
                    <span className="text-xs text-gray-400 font-medium">Days</span>
                  </div>
                </div>
              </div>

              {/* Style */}
              <div className="space-y-1 px-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Style</p>
                <div className="flex items-center gap-3 py-1 border-b border-gray-50 relative">
                  <Activity size={18} className="text-blue-600 flex-shrink-0" />
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as TripStyle)}
                    className="w-full bg-transparent text-base font-bold text-gray-900 appearance-none focus:outline-none cursor-pointer pr-6"
                  >
                    {Object.values(TripStyle).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="text-gray-400 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Search size={20} />
            <span>{t("startPlanning")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-30 mx-4 md:mx-auto max-w-6xl -mt-24">
      {/* ... rest of the original form ... */}
      {/* Decorative background elements for the form area */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tl from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
      </div>

      {/* Tabs like in example 2 */}
      <div className="flex gap-1 mb-0 ml-4 md:ml-0">
        {[
          { id: "destination", label: "Destination" },
          { id: "flight", label: "Flight" },
          { id: "hotel", label: "Hotel" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 rounded-t-2xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "glass text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl md:rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 border border-white/40">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 ml-1">{t("location")}</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600 z-10">
                <MapPin size={20} />
              </div>
              <div className="w-full flex items-center justify-between pl-8 pr-0 py-1 border-b border-gray-200 group-hover:border-blue-600 transition-colors">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent font-bold text-gray-900 appearance-none focus:outline-none cursor-pointer py-2"
                >
                  {communes.map((commune) => (
                    <option key={commune.value} value={commune.label}>
                      {commune.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="text-gray-400 pointer-events-none absolute right-2" />
              </div>
            </div>
          </div>

          {/* Date / Duration */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 ml-1">Duration (Days)</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600">
                <Calendar size={20} />
              </div>
              <div className="w-full flex items-center justify-between pl-8 pr-2 py-1 border-b border-gray-200 group-hover:border-blue-600 transition-colors">
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full bg-transparent font-bold text-gray-900 focus:outline-none py-2"
                />
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Style / Price analogue */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 ml-1">Trip Style</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600">
                <Activity size={20} />
              </div>
              <div className="w-full flex items-center justify-between pl-8 pr-0 py-1 border-b border-gray-200 group-hover:border-blue-600 transition-colors">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as TripStyle)}
                  className="w-full bg-transparent font-bold text-gray-900 appearance-none focus:outline-none cursor-pointer py-2"
                >
                  {Object.values(TripStyle).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="text-gray-400 pointer-events-none absolute right-2" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:pl-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-[0_10px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {t("startPlanning")}
              <div className="bg-white/20 p-1 rounded-lg group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
